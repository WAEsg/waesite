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
// written for real ahead of that.
//
// This uses Stripe Connect's "separate charges and transfers" shape, not
// a destination charge: holdEscrow charges the hirer in full, landing in
// the PLATFORM's own Stripe balance (nothing is split or sent to the
// talent yet), and releaseEscrow later moves the talent's share out with
// a plain Transfer. A destination charge (application_fee_amount +
// transfer_data.destination set at charge time) collapses the charge and
// the payout into one instant — fine for pay-on-completion, but it can't
// represent an actual hold, since it has nothing left to do later. And a
// manual-capture authorization (the other way to "not pay out yet")
// isn't a real hold either: card networks void an uncaptured
// authorization after about a week, far short of a multi-week milestone
// or a 15-day retainer period. A completed charge that just sits in the
// platform's balance has no such expiry — see
// https://docs.stripe.com/connect/separate-charges-and-transfers.
//
// The platform fee is simply whatever isn't transferred out at release —
// there's no application_fee_amount involved in this shape, since that's
// a destination-charge-only parameter. See src/lib/stripe/fees.ts for the
// fee-schedule math that produces the FeeBreakdown callers pass in here.

// Charges the hirer in full, immediately, for fees.totalCharge. This is
// what actually creates the "hold" — see the file-level comment above for
// why this has to be a real charge rather than an authorization. Not
// wired to a real trigger yet: there's no hirer card-collection UI, so
// nothing calls this today. Once that exists, it should run at
// milestone/period creation, with releaseEscrow (below) transferring out
// the talent's share once that milestone/period is approved.
export async function holdEscrow(params: {
  contractId: string;
  milestoneId?: string;
  fees: FeeBreakdown;
  currency?: string;
  hirerStripeCustomerId?: string | null;
}) {
  const { contractId, milestoneId, fees, currency = "sgd", hirerStripeCustomerId } = params;
  const stripe = getStripeClient();
  let stripeReferenceId: string | null = null;

  if (stripe && hirerStripeCustomerId && fees.totalCharge > 0) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(fees.totalCharge * 100),
      currency,
      customer: hirerStripeCustomerId,
      confirm: true,
      off_session: true,
      metadata: { contract_id: contractId, milestone_id: milestoneId ?? "", purpose: "escrow_hold" },
    });
    // Stored as the source_transaction releaseEscrow needs later — a
    // confirmed PaymentIntent's latest_charge is a plain charge id
    // (string) unless explicitly expanded.
    stripeReferenceId = (paymentIntent.latest_charge as string | null) ?? paymentIntent.id;
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

// Transfers the talent's share out of the platform's balance for a
// milestone/period that was already charged in full by holdEscrow — it
// does not charge the hirer again. Requires a prior real escrow_hold
// payment_event for this contract/milestone to exist, since a Transfer's
// source_transaction has to point at the original charge; this throws
// rather than silently charging or silently doing nothing, because a
// missing hold here means holdEscrow was never wired into whatever
// creates milestones/periods yet — better to fail loudly during that
// gap than to quietly move money (or fail to) in a way nobody notices.
export async function releaseEscrow(params: {
  contractId: string;
  milestoneId?: string;
  fees: FeeBreakdown;
  currency?: string;
  hirerStripeCustomerId?: string | null;
  talentStripeAccountId?: string | null;
}) {
  const { contractId, milestoneId, fees, currency = "sgd", talentStripeAccountId } = params;
  const stripe = getStripeClient();
  let stripeReferenceId: string | null = null;

  if (stripe && talentStripeAccountId && fees.talentReceives > 0) {
    const admin = createAdminClient();
    let holdQuery = admin
      .from("payment_events")
      .select("stripe_reference_id")
      .eq("contract_id", contractId)
      .eq("event_type", "escrow_hold")
      .eq("is_simulated", false)
      .order("created_at", { ascending: false })
      .limit(1);
    holdQuery = milestoneId ? holdQuery.eq("milestone_id", milestoneId) : holdQuery.is("milestone_id", null);
    const { data: hold } = await holdQuery.maybeSingle();

    if (!hold?.stripe_reference_id) {
      throw new Error(
        `releaseEscrow: no prior escrow_hold payment found for contract ${contractId}` +
          (milestoneId ? `, milestone ${milestoneId}` : "") +
          " — holdEscrow must charge the hirer before a release can transfer funds out."
      );
    }

    const transfer = await stripe.transfers.create({
      amount: Math.round(fees.talentReceives * 100),
      currency,
      destination: talentStripeAccountId,
      source_transaction: hold.stripe_reference_id,
      metadata: { contract_id: contractId, milestone_id: milestoneId ?? "", purpose: "release" },
    });
    stripeReferenceId = transfer.id;
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

// Refunds a charge directly by PaymentIntent id — works the same way
// whether that charge already had its talent share transferred out or
// not. If it has, this doesn't claw that back; a refund covering an
// already-transferred amount needs a Transfer Reversal against the
// talent's connected account too, which isn't handled here yet. Revisit
// once holdEscrow/releaseEscrow are actually wired to a real trigger.
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
