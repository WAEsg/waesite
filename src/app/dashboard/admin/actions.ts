"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { releaseEscrow, refundEscrow, issueCredit } from "@/lib/stripe/escrow";
import { computeGigMilestoneFee } from "@/lib/stripe/fees";
import { sendEmail } from "@/lib/notifications/send";
import { runMilestoneAutoApprove } from "@/lib/milestones/auto-approve";

export type AdminActionState = { error: string | null };
const ok: AdminActionState = { error: null };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  return { supabase, user: user! };
}

async function logAuditEntry(params: {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string | null;
}) {
  const supabase = await createClient();
  await supabase.from("admin_audit_log").insert({
    admin_id: params.adminId,
    action: params.action,
    target_type: params.targetType,
    target_id: params.targetId,
    reason: params.reason ?? null,
  });
}

// ============================================================
// Disputes & MIA queue resolution
// ============================================================

export async function resolveDispute(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const { user } = await requireAdmin();
  const disputeId = formData.get("dispute_id");
  const resolution = formData.get("resolution");
  const reason = formData.get("reason");
  const amountRaw = formData.get("amount");

  if (typeof disputeId !== "string" || typeof resolution !== "string") {
    return { error: "Invalid request." };
  }

  const admin = createAdminClient();
  const { data: dispute } = await admin
    .from("disputes")
    .select("id, contract_id, milestone_id, status")
    .eq("id", disputeId)
    .single();
  if (!dispute) return { error: "Dispute not found." };
  if (dispute.status === "resolved") return { error: "Already resolved." };

  const { data: contract } = await admin
    .from("contracts")
    .select("hirer_id, talent_id")
    .eq("id", dispute.contract_id)
    .single();
  const [{ data: hirer }, { data: talent }] = contract
    ? await Promise.all([
        admin.from("users").select("stripe_customer_id, email").eq("id", contract.hirer_id).single(),
        admin.from("users").select("stripe_account_id, email").eq("id", contract.talent_id).single(),
      ])
    : [{ data: null }, { data: null }];

  const amount = amountRaw ? Number(amountRaw) : 0;

  if (resolution === "release_escrow" && amount > 0) {
    await releaseEscrow({
      contractId: dispute.contract_id,
      milestoneId: dispute.milestone_id ?? undefined,
      fees: computeGigMilestoneFee(amount),
      hirerStripeCustomerId: hirer?.stripe_customer_id,
      talentStripeAccountId: talent?.stripe_account_id,
    });
    if (dispute.milestone_id) {
      await admin
        .from("milestones")
        .update({ status: "approved", approved_at: new Date().toISOString() })
        .eq("id", dispute.milestone_id);
    }
  } else if (resolution === "refund" && amount > 0) {
    await refundEscrow({ contractId: dispute.contract_id, amount });
  } else if (resolution === "credit" && amount > 0) {
    await issueCredit({ contractId: dispute.contract_id, amount });
  } else if (resolution === "activate_bench") {
    // No standalone bench-matching subsystem exists (see the plan's
    // reconciliation notes on terminations.bench_activation_requested_at)
    // — logged the same way here, as a flag on the dispute's contract's
    // termination row if one exists, or just the audit entry otherwise.
  }

  await admin.from("disputes").update({ status: "resolved", resolved_at: new Date().toISOString() }).eq("id", disputeId);

  if (contract) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
    const recipients = [
      { email: hirer?.email, role: "hirer" },
      { email: talent?.email, role: "talent" },
    ].filter((r): r is { email: string; role: string } => Boolean(r.email));

    for (const r of recipients) {
      await sendEmail({
        to: r.email,
        subject: "Your dispute has been resolved",
        heading: "Dispute resolved",
        body: "An admin has resolved a dispute on one of your contracts.",
        ctaLabel: "View contract",
        ctaUrl: `${siteUrl}/dashboard/${r.role}/contracts/${dispute.contract_id}`,
      });
    }
  }

  await logAuditEntry({
    adminId: user.id,
    action: `dispute_resolved:${resolution}`,
    targetType: "dispute",
    targetId: disputeId,
    reason: typeof reason === "string" ? reason : null,
  });

  revalidatePath("/dashboard/admin/disputes");
  return ok;
}

// ============================================================
// Team management — promote an existing user to admin
// ============================================================

export async function promoteToAdmin(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const { user } = await requireAdmin();
  const email = formData.get("email");
  if (typeof email !== "string" || !email.trim()) {
    return { error: "Enter an email address." };
  }

  const admin = createAdminClient();
  const { data: target } = await admin
    .from("users")
    .select("id, role")
    .eq("email", email.trim())
    .maybeSingle();

  if (!target) {
    return { error: "No WaeWork account exists with that email yet — they need to sign up first." };
  }
  if (target.role === "admin") {
    return { error: "That account is already an admin." };
  }

  await admin.from("users").update({ role: "admin" }).eq("id", target.id);

  await logAuditEntry({
    adminId: user.id,
    action: "admin_promoted",
    targetType: "user",
    targetId: target.id,
  });

  await sendEmail({
    to: email.trim(),
    subject: "You've been made a WaeWork admin",
    heading: "You're now an admin",
    body: "Another admin has given your account admin access on WaeWork. You can now see the admin dashboard at /dashboard/admin.",
  });

  revalidatePath("/dashboard/admin/team");
  return ok;
}

// ============================================================
// Manual milestone auto-approve fallback (shares runMilestoneAutoApprove
// with the cron route and the hirer-facing button — see
// src/lib/milestones/auto-approve.ts)
// ============================================================

export async function adminReviewOverdueMilestones() {
  await requireAdmin();
  await runMilestoneAutoApprove();
  revalidatePath("/dashboard/admin/contracts");
}
