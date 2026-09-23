import "server-only";
import { getStripeClient, isStripeConfigured } from "./client";
import { createAdminClient } from "@/lib/supabase/admin";
import { trackEvent } from "@/lib/analytics";
import { sendEmail } from "@/lib/notifications/send";
import type { Database } from "@/lib/supabase/database.types";
import type { FeeBreakdown } from "./fees";

type PaymentEventInsert = Database["public"]["Tables"]["payment_events"]["Insert"];

async function logPaymentEvent(event: PaymentEventInsert) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("payment_events")
    .insert(event)
    .select()
    .single();

  if (error) throw new Error(`Failed to log payment_event: ${error.message}`);
  return data;
}

// Grouped by contract_id rather than a user id — escrow.ts doesn't have a
// specific user in context (it's called from several different actions),
// and "payment completed for contract X" is still a useful grouping in
// PostHog even without an end-user identity attached.
async function trackPaymentCompleted(contractId: string, event: PaymentEventInsert) {
  await trackEvent("payment_completed", contractId, {
    event_type: event.event_type,
    amount: event.amount,
    fee_amount: event.fee_amount,
    pass_through_amount: event.pass_through_amount,
    is_simulated: event.is_simulated,
  });
}

// "Milestone approved / payment released" and "Payment released (period)"
// are the same underlying event from this file's perspective — both are
// a release to the talent's connected account, just with a different
// fee schedule already baked into the FeeBreakdown by the caller. One
// notification here covers both spec rows instead of duplicating the
// email call at every releaseEscrow call site.
async function notifyTalentPaymentReleased(contractId: string, passThroughAmount: number) {
  const admin = createAdminClient();
  const { data: contract } = await admin.from("contracts").select("talent_id").eq("id", contractId).single();
  if (!contract) return;
  const { data: talent } = await admin.from("users").select("email").eq("id", contract.talent_id).single();
  if (!talent?.email) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
  await sendEmail({
    to: talent.email,
    subject: "Payment released to you on WaeWork",
    heading: "You've been paid",
    body: `SGD ${passThroughAmount.toFixed(2)} has been released to you for a completed milestone or period on WaeWork.`,
    ctaLabel: "View contract",
    ctaUrl: `${siteUrl}/dashboard/talent/contracts/${contractId}`,
  });
}

// Every function here writes a payment_events row unconditionally — if
// STRIPE_SECRET_KEY isn't set, the Stripe call is skipped and the event
// is logged with is_simulated: true, so the audit trail always reflects
// what actually happened rather than silently pretending money moved.
// There is no live Stripe account behind this yet; the calls below are
// written for real (destination-charge Connect shape) so they're ready
// to go live the moment real keys + connected accounts exist.
//
// The platform fee is split from the pass-through amount using Stripe's
// application_fee_amount, set AT THE POINT the PaymentIntent is created —
// never computed afterward by subtracting a transfer from a total. See
// src/lib/stripe/fees.ts for the fee-schedule math that produces the
// FeeBreakdown callers pass in here.

// Not currently wired to a real trigger — there's no card-collection UI
// yet for hirers, so nothing calls this today. Kept ready for when a
// "charge on milestone creation, capture on approval" flow is built;
// releaseEscrow below instead creates-and-confirms a destination charge
// in one step, since that's the only payment-creation moment that
// actually exists in this app right now.
export async function holdEscrow(params: {
  contractId: string;
  milestoneId?: string;
  fees: FeeBreakdown;
  currency?: string;
  hirerStripeCustomerId?: string | null;
  talentStripeAccountId?: string | null;
}) {
  const { contractId, milestoneId, fees, currency = "sgd", hirerStripeCustomerId, talentStripeAccountId } =
    params;
  const stripe = getStripeClient();
  let stripeReferenceId: string | null = null;

  if (stripe && hirerStripeCustomerId && talentStripeAccountId) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(fees.totalCharge * 100),
      currency,
      customer: hirerStripeCustomerId,
      capture_method: "manual",
      application_fee_amount: Math.round(fees.applicationFeeAmount * 100),
      transfer_data: { destination: talentStripeAccountId },
      metadata: { contract_id: contractId, milestone_id: milestoneId ?? "", purpose: "escrow_hold" },
    });
    stripeReferenceId = paymentIntent.id;
  }

  return logPaymentEvent({
    contract_id: contractId,
    milestone_id: milestoneId ?? null,
    event_type: "escrow_hold",
    amount: fees.totalCharge,
    fee_amount: fees.applicationFeeAmount,
    pass_through_amount: fees.talentReceives,
    currency,
    stripe_reference_id: stripeReferenceId,
    is_simulated: !isStripeConfigured(),
  });
}

// Charges the client and pays the talent in one step (there's no prior
// hold to capture in this codebase yet — see holdEscrow above). The fee
// split is set on the PaymentIntent at creation time via
// application_fee_amount + transfer_data.destination, which is what
// makes this "at the point of payment" rather than a manual transfer of
// a pre-subtracted amount.
export async function releaseEscrow(params: {
  contractId: string;
  milestoneId?: string;
  fees: FeeBreakdown;
  currency?: string;
  hirerStripeCustomerId?: string | null;
  talentStripeAccountId?: string | null;
}) {
  const { contractId, milestoneId, fees, currency = "sgd", hirerStripeCustomerId, talentStripeAccountId } =
    params;
  const stripe = getStripeClient();
  let stripeReferenceId: string | null = null;

  if (stripe && hirerStripeCustomerId && talentStripeAccountId && fees.totalCharge > 0) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(fees.totalCharge * 100),
      currency,
      customer: hirerStripeCustomerId,
      confirm: true,
      off_session: true,
      application_fee_amount: Math.round(fees.applicationFeeAmount * 100),
      transfer_data: { destination: talentStripeAccountId },
      metadata: { contract_id: contractId, milestone_id: milestoneId ?? "", purpose: "release" },
    });
    stripeReferenceId = paymentIntent.id;
  }

  const event = await logPaymentEvent({
    contract_id: contractId,
    milestone_id: milestoneId ?? null,
    event_type: "release",
    amount: fees.totalCharge,
    fee_amount: fees.applicationFeeAmount,
    pass_through_amount: fees.talentReceives,
    currency,
    stripe_reference_id: stripeReferenceId,
    is_simulated: !isStripeConfigured(),
  });
  await trackPaymentCompleted(contractId, event);
  if (fees.talentReceives > 0) {
    await notifyTalentPaymentReleased(contractId, fees.talentReceives);
  }
  return event;
}

// The one-time placement fee (retainer contracts only) — entirely
// platform revenue, no connected-account transfer at all, so this is a
// plain charge on the platform's own Stripe account rather than a
// Connect destination charge.
export async function chargePlacementFee(params: {
  contractId: string;
  amount: number;
  currency?: string;
  hirerStripeCustomerId?: string | null;
}) {
  const { contractId, amount, currency = "sgd", hirerStripeCustomerId } = params;
  const stripe = getStripeClient();
  let stripeReferenceId: string | null = null;

  if (stripe && hirerStripeCustomerId && amount > 0) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      customer: hirerStripeCustomerId,
      confirm: true,
      off_session: true,
      metadata: { contract_id: contractId, purpose: "placement_fee" },
    });
    stripeReferenceId = paymentIntent.id;
  }

  const event = await logPaymentEvent({
    contract_id: contractId,
    event_type: "escrow_hold",
    amount,
    fee_amount: amount,
    pass_through_amount: 0,
    currency,
    stripe_reference_id: stripeReferenceId,
    is_simulated: !isStripeConfigured(),
    metadata: { purpose: "placement_fee" },
  });
  await trackPaymentCompleted(contractId, event);
  return event;
}

export async function refundEscrow(params: {
  contractId: string;
  terminationId?: string;
  amount: number;
  currency?: string;
  stripePaymentIntentId?: string | null;
}) {
  const { contractId, terminationId, amount, currency = "sgd", stripePaymentIntentId } = params;
  const stripe = getStripeClient();
  let stripeReferenceId: string | null = null;

  if (stripe && stripePaymentIntentId) {
    const refund = await stripe.refunds.create({
      payment_intent: stripePaymentIntentId,
      amount: Math.round(amount * 100),
      metadata: { contract_id: contractId, termination_id: terminationId ?? "" },
    });
    stripeReferenceId = refund.id;
  }

  // A refund returns the whole amount to the client — no platform fee is
  // retained on the portion being refunded.
  return logPaymentEvent({
    contract_id: contractId,
    termination_id: terminationId ?? null,
    event_type: "refund",
    amount,
    fee_amount: 0,
    pass_through_amount: amount,
    currency,
    stripe_reference_id: stripeReferenceId,
    is_simulated: !isStripeConfigured(),
  });
}

// Platform credit is never a real Stripe money movement — it's an
// internal ledger entry the billing system would apply against a future
// invoice. Always logged, never "simulated" in the same sense as the
// above (there's no Stripe call to skip).
export async function issueCredit(params: {
  contractId: string;
  terminationId?: string;
  amount: number;
  currency?: string;
}) {
  const { contractId, terminationId, amount, currency = "sgd" } = params;

  return logPaymentEvent({
    contract_id: contractId,
    termination_id: terminationId ?? null,
    event_type: "credit_issued",
    amount,
    fee_amount: 0,
    pass_through_amount: amount,
    currency,
    stripe_reference_id: null,
    is_simulated: false,
  });
}
