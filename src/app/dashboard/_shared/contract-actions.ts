"use server";

// Shared by both hirer and talent contract-detail pages — the underlying
// tables are the same, RLS decides who's actually allowed to do what, so
// there's no reason to fork this into per-role copies. Lives under a
// "_shared" folder so Next.js's App Router treats it as non-routable.

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  milestoneCreateSchema,
  milestoneSubmitSchema,
  milestoneReviewSchema,
  checkinSubmitSchema,
} from "@/lib/validation/contracts";
import { initiateTerminationSchema, settleTerminationSchema } from "@/lib/validation/termination";
import { releaseEscrow, refundEscrow, issueCredit } from "@/lib/stripe/escrow";
import { computeGigMilestoneFee, computeRetainerPeriodFee, contractMonthNumber } from "@/lib/stripe/fees";
import {
  computeMilestoneRelease,
  computePeriodRelease,
  computeUnearnedSettlement,
  computePlacementFeeRefund,
} from "@/lib/contracts/termination";
import { runMilestoneAutoApprove } from "@/lib/milestones/auto-approve";
import { sendEmail } from "@/lib/notifications/send";
import { getAdminEmails } from "@/lib/notifications/admins";

export type ActionState = { error: string | null };
const ok: ActionState = { error: null };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user: user! };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";

// Shared by every trigger below that needs to email one or both contract
// parties (and optionally admins) — looked up via the admin client since
// a hirer's session can't read an arbitrary talent's email (or vice
// versa) without the specific RLS-gated relationship that visibility
// needs, and this needs to work regardless of which party triggered it.
async function notifyContractParties(
  contractId: string,
  email: { subject: string; heading: string; body: string; ctaLabel: string },
  options: { includeAdmin?: boolean; onlyRole?: "hirer" | "talent" } = {}
) {
  const admin = createAdminClient();
  const { data: contract } = await admin
    .from("contracts")
    .select("hirer_id, talent_id")
    .eq("id", contractId)
    .single();
  if (!contract) return;

  const [{ data: hirer }, { data: talent }] = await Promise.all([
    admin.from("users").select("email").eq("id", contract.hirer_id).single(),
    admin.from("users").select("email").eq("id", contract.talent_id).single(),
  ]);

  const targets: { email: string; ctaUrl: string }[] = [];
  if (hirer?.email && options.onlyRole !== "talent") {
    targets.push({ email: hirer.email, ctaUrl: `${SITE_URL}/dashboard/hirer/contracts/${contractId}` });
  }
  if (talent?.email && options.onlyRole !== "hirer") {
    targets.push({ email: talent.email, ctaUrl: `${SITE_URL}/dashboard/talent/contracts/${contractId}` });
  }
  if (options.includeAdmin) {
    for (const adminEmail of await getAdminEmails()) {
      targets.push({ email: adminEmail, ctaUrl: `${SITE_URL}/dashboard/admin/contracts/${contractId}` });
    }
  }

  for (const target of targets) {
    await sendEmail({
      to: target.email,
      subject: email.subject,
      heading: email.heading,
      body: email.body,
      ctaLabel: email.ctaLabel,
      ctaUrl: target.ctaUrl,
    });
  }
}

// ============================================================
// Milestones
// ============================================================

export async function createMilestone(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = milestoneCreateSchema.safeParse({
    contract_id: formData.get("contract_id"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    amount: formData.get("amount"),
    sequence_order: formData.get("sequence_order"),
    due_date: formData.get("due_date") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid details." };

  const { supabase } = await requireUser();
  const { error } = await supabase.from("milestones").insert({
    contract_id: parsed.data.contract_id,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    amount: parsed.data.amount,
    sequence_order: parsed.data.sequence_order,
    due_date: parsed.data.due_date || null,
    status: "pending",
  });
  if (error) return { error: error.message };

  revalidatePath(`/dashboard/hirer/contracts/${parsed.data.contract_id}`);
  return ok;
}

export async function submitMilestone(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = milestoneSubmitSchema.safeParse({
    milestone_id: formData.get("milestone_id"),
    submission_link: formData.get("submission_link"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid details." };

  const { supabase } = await requireUser();
  const { data: milestone, error } = await supabase
    .from("milestones")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      submission_link: parsed.data.submission_link,
    })
    .eq("id", parsed.data.milestone_id)
    .select("contract_id")
    .single();
  if (error) return { error: error.message };

  if (milestone) {
    await notifyContractParties(
      milestone.contract_id,
      {
        subject: "A milestone was submitted for review",
        heading: "Milestone submitted",
        body: "A talent partner just submitted a milestone for your review.",
        ctaLabel: "Review milestone",
      },
      { onlyRole: "hirer" }
    );
  }

  revalidatePath(`/dashboard/talent/contracts/${milestone?.contract_id}`);
  return ok;
}

export async function reviewMilestone(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = milestoneReviewSchema.safeParse({
    milestone_id: formData.get("milestone_id"),
    decision: formData.get("decision"),
    dispute_reason: formData.get("dispute_reason") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid details." };

  const { supabase, user } = await requireUser();
  const { data: milestone } = await supabase
    .from("milestones")
    .select("id, contract_id, amount")
    .eq("id", parsed.data.milestone_id)
    .single();
  if (!milestone) return { error: "Milestone not found." };

  if (parsed.data.decision === "dispute") {
    await supabase.from("milestones").update({ status: "disputed" }).eq("id", milestone.id);
    await supabase.from("disputes").insert({
      contract_id: milestone.contract_id,
      milestone_id: milestone.id,
      raised_by: user.id,
      reason: parsed.data.dispute_reason || "No reason provided.",
    });
    await notifyContractParties(
      milestone.contract_id,
      {
        subject: "A dispute was opened on WaeWork",
        heading: "Dispute opened",
        body: "A dispute has been raised on one of your contracts. Our team will review and reach out.",
        ctaLabel: "View contract",
      },
      { includeAdmin: true }
    );
  } else {
    await supabase
      .from("milestones")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("id", milestone.id);

    const admin = createAdminClient();
    const { data: contract } = await admin
      .from("contracts")
      .select("hirer_id, talent_id")
      .eq("id", milestone.contract_id)
      .single();
    const [{ data: talent }, { data: hirer }] = contract
      ? await Promise.all([
          admin.from("users").select("stripe_account_id").eq("id", contract.talent_id).single(),
          admin.from("users").select("stripe_customer_id").eq("id", contract.hirer_id).single(),
        ])
      : [{ data: null }, { data: null }];

    await releaseEscrow({
      contractId: milestone.contract_id,
      milestoneId: milestone.id,
      fees: computeGigMilestoneFee(milestone.amount),
      hirerStripeCustomerId: hirer?.stripe_customer_id,
      talentStripeAccountId: talent?.stripe_account_id,
    });
  }

  revalidatePath(`/dashboard/hirer/contracts/${milestone.contract_id}`);
  revalidatePath(`/dashboard/talent/contracts/${milestone.contract_id}`);
  return ok;
}

// Standalone dispute button available on any milestone or at the
// contract level (spec section 6) — distinct from reviewMilestone's
// approve/dispute decision, since either party (not just the hirer
// reviewing a submission) can raise one.
export async function raiseDispute(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const contractId = formData.get("contract_id");
  const milestoneId = formData.get("milestone_id");
  const reason = formData.get("reason");

  if (typeof contractId !== "string" || typeof reason !== "string" || !reason.trim()) {
    return { error: "Add a reason for the dispute." };
  }

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("disputes").insert({
    contract_id: contractId,
    milestone_id: typeof milestoneId === "string" && milestoneId ? milestoneId : null,
    raised_by: user.id,
    reason: reason.trim(),
  });
  if (error) return { error: error.message };

  if (typeof milestoneId === "string" && milestoneId) {
    await supabase.from("milestones").update({ status: "disputed" }).eq("id", milestoneId);
  }

  await notifyContractParties(
    contractId,
    {
      subject: "A dispute was opened on WaeWork",
      heading: "Dispute opened",
      body: "A dispute has been raised on one of your contracts. Our team will review and reach out.",
      ctaLabel: "View contract",
    },
    { includeAdmin: true }
  );

  revalidatePath(`/dashboard/hirer/contracts/${contractId}`);
  revalidatePath(`/dashboard/talent/contracts/${contractId}`);
  return ok;
}

// ============================================================
// Day-15 check-in (no payment)
// ============================================================

export async function submitCheckin(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = checkinSubmitSchema.safeParse({
    contract_id: formData.get("contract_id"),
    talent_note: formData.get("talent_note"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid details." };

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("checkins").insert({
    contract_id: parsed.data.contract_id,
    submitted_by: user.id,
    talent_note: parsed.data.talent_note,
  });
  if (error) return { error: error.message };

  await notifyContractParties(
    parsed.data.contract_id,
    {
      subject: "A day-15 check-in was submitted",
      heading: "Check-in submitted",
      body: "Your talent partner just submitted a day-15 progress note — no payment is tied to this, just a quick status update.",
      ctaLabel: "View check-in",
    },
    { onlyRole: "hirer" }
  );

  revalidatePath(`/dashboard/talent/contracts/${parsed.data.contract_id}`);
  revalidatePath(`/dashboard/hirer/contracts/${parsed.data.contract_id}`);
  return ok;
}

export async function acknowledgeCheckin(checkinId: string, contractId: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("checkins")
    .update({
      client_acknowledged: true,
      acknowledged_by: user.id,
      acknowledged_at: new Date().toISOString(),
    })
    .eq("id", checkinId);

  revalidatePath(`/dashboard/hirer/contracts/${contractId}`);
  revalidatePath(`/dashboard/talent/contracts/${contractId}`);
}

// Manual fallback for the daily cron (src/app/api/cron/auto-approve-
// milestones) in case Vercel Cron isn't available on the current plan —
// calls the exact same shared function, so there's no second
// implementation of the 5-business-day rule to drift out of sync.
export async function reviewOverdueMilestones(): Promise<void> {
  await requireUser();
  await runMilestoneAutoApprove();
  revalidatePath("/dashboard/hirer/contracts");
  revalidatePath("/dashboard/talent/contracts");
}

// ============================================================
// Termination + settlement
// ============================================================

export async function initiateTermination(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = initiateTerminationSchema.safeParse({
    contract_id: formData.get("contract_id"),
    cause: formData.get("cause"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid details." };

  const { supabase, user } = await requireUser();
  const { data: contract } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", parsed.data.contract_id)
    .single();
  if (!contract) return { error: "Contract not found." };

  const now = new Date();

  // What's earned releases to the talent regardless of cause.
  let released = 0;
  let unearned = 0;
  if (contract.type === "one_off") {
    const { data: milestones } = await supabase
      .from("milestones")
      .select("amount, status")
      .eq("contract_id", contract.id);
    const result = computeMilestoneRelease(milestones ?? []);
    released = result.released;
    unearned = result.unearned;
  } else {
    const result = computePeriodRelease({
      monthlyPay: contract.monthly_pay ?? contract.rate_amount,
      currentPeriodStart: contract.current_period_start
        ? new Date(contract.current_period_start)
        : new Date(contract.start_date),
      terminationDate: now,
    });
    released = result.released;
    unearned = result.unearned;
  }

  const placementFeeRefund = contract.placement_fee_amount
    ? computePlacementFeeRefund({
        originalPlacementDate: new Date(
          contract.original_placement_date ?? contract.start_date
        ),
        terminationDate: now,
        placementFeeAmount: contract.placement_fee_amount,
      })
    : 0;

  const settlement = computeUnearnedSettlement(parsed.data.cause, unearned);

  const admin = createAdminClient();
  const { data: termination, error } = await admin
    .from("terminations")
    .insert({
      contract_id: contract.id,
      initiated_by_user_id: user.id,
      cause: parsed.data.cause,
      released_amount: released,
      unearned_amount: unearned,
      placement_fee_refund_amount: placementFeeRefund,
      bench_activation_requested_at: now.toISOString(),
      settlement_type: settlement.requiresClientChoice ? null : "cash_refund",
      status: settlement.requiresClientChoice ? "pending_settlement" : "settled",
      settled_at: settlement.requiresClientChoice ? null : now.toISOString(),
    })
    .select()
    .single();
  if (error || !termination) return { error: error?.message ?? "Couldn't start termination." };

  await supabase.from("contracts").update({ status: "terminated" }).eq("id", contract.id);

  await notifyContractParties(
    contract.id,
    {
      subject: "A contract was terminated on WaeWork",
      heading: "Contract terminated",
      body: "One of your contracts has been ended early. Settlement details are on the contract page.",
      ctaLabel: "View settlement",
    },
    { includeAdmin: true }
  );

  // "Backup bench candidate activated" fires on every termination per
  // spec — no standalone bench-matching subsystem exists to actually
  // activate (see terminations.bench_activation_requested_at, set above),
  // so this just tells the hirer that's been flagged.
  const { data: hirerUser } = await createAdminClient()
    .from("users")
    .select("email")
    .eq("id", contract.hirer_id)
    .single();
  if (hirerUser?.email) {
    await sendEmail({
      to: hirerUser.email,
      subject: "Backup bench activated for your contract",
      heading: "Finding you a backup",
      body: "Since this contract ended early, we've flagged your account for backup bench candidates so you can get a replacement in place quickly.",
      ctaLabel: "View contract",
      ctaUrl: `${SITE_URL}/dashboard/hirer/contracts/${contract.id}`,
    });
  }

  if (parsed.data.cause === "talent_mia") {
    for (const adminEmail of await getAdminEmails()) {
      await sendEmail({
        to: adminEmail,
        subject: "MIA reported on WaeWork",
        heading: "Talent reported MIA",
        body: "A hirer has reported a talent partner as missing-in-action on an active contract.",
        ctaLabel: "Review contract",
        ctaUrl: `${SITE_URL}/dashboard/admin/contracts/${contract.id}`,
      });
    }
  }

  // Release what's earned to the talent, immediately, regardless of cause.
  // For one_off contracts this is informational only — every approved
  // milestone already triggered its own releaseEscrow call in
  // reviewMilestone at approval time, so re-releasing `released` here
  // would double-pay the talent. Only retainer contracts need a release
  // here, since there's no per-period billing cycle elsewhere that would
  // already have paid out the completed-days portion.
  if (released > 0 && contract.type !== "one_off") {
    const [{ data: talent }, { data: hirer }] = await Promise.all([
      admin.from("users").select("stripe_account_id").eq("id", contract.talent_id).single(),
      admin.from("users").select("stripe_customer_id").eq("id", contract.hirer_id).single(),
    ]);
    const monthNumber = contractMonthNumber(
      new Date(contract.original_placement_date ?? contract.start_date),
      now
    );
    await releaseEscrow({
      contractId: contract.id,
      fees: computeRetainerPeriodFee(released, monthNumber),
      hirerStripeCustomerId: hirer?.stripe_customer_id,
      talentStripeAccountId: talent?.stripe_account_id,
    });
  }

  // Non-client_no_cause: settle the unearned balance immediately, off-cycle.
  if (!settlement.requiresClientChoice && unearned > 0) {
    await refundEscrow({
      contractId: contract.id,
      terminationId: termination.id,
      amount: unearned,
    });
  }

  if (placementFeeRefund > 0) {
    await refundEscrow({
      contractId: contract.id,
      terminationId: termination.id,
      amount: placementFeeRefund,
    });
  }

  revalidatePath(`/dashboard/hirer/contracts/${contract.id}`);
  revalidatePath(`/dashboard/talent/contracts/${contract.id}`);
  return ok;
}

export async function settleTermination(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = settleTerminationSchema.safeParse({
    termination_id: formData.get("termination_id"),
    settlement_type: formData.get("settlement_type"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid details." };

  await requireUser();
  const admin = createAdminClient();
  const { data: termination } = await admin
    .from("terminations")
    .select("*")
    .eq("id", parsed.data.termination_id)
    .single();
  if (!termination) return { error: "Termination not found." };
  if (termination.status === "settled") return ok;

  const unearned = termination.unearned_amount ?? 0;

  if (parsed.data.settlement_type === "credit") {
    await issueCredit({
      contractId: termination.contract_id,
      terminationId: termination.id,
      amount: Math.round(unearned * 1.1 * 100) / 100,
    });
  } else if (unearned > 0) {
    await refundEscrow({
      contractId: termination.contract_id,
      terminationId: termination.id,
      amount: unearned,
    });
  }

  await admin
    .from("terminations")
    .update({
      settlement_type: parsed.data.settlement_type,
      status: "settled",
      settled_at: new Date().toISOString(),
    })
    .eq("id", termination.id);

  revalidatePath(`/dashboard/hirer/contracts/${termination.contract_id}`);
  revalidatePath(`/dashboard/talent/contracts/${termination.contract_id}`);
  return ok;
}
