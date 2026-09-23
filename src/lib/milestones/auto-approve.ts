import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { releaseEscrow } from "@/lib/stripe/escrow";
import { computeGigMilestoneFee } from "@/lib/stripe/fees";
import { sendEmail } from "@/lib/notifications/send";

// Shared by the daily cron route (src/app/api/cron/auto-approve-milestones)
// and the hirer-facing "review overdue milestones" manual fallback action,
// so there's exactly one implementation of the 5-business-day rule instead
// of two that could drift apart.

function isWeekend(date: Date): boolean {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

export function businessDaysElapsed(from: Date, to: Date): number {
  let count = 0;
  const cursor = new Date(from);
  cursor.setUTCHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setUTCHours(0, 0, 0, 0);

  while (cursor < end) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    if (!isWeekend(cursor)) count += 1;
  }
  return count;
}

export type AutoApproveResult = {
  approved: string[];
  remindersSent: string[];
};

export async function runMilestoneAutoApprove(): Promise<AutoApproveResult> {
  const admin = createAdminClient();
  const now = new Date();

  const { data: milestones, error } = await admin
    .from("milestones")
    .select("id, contract_id, amount, submitted_at, status")
    .eq("status", "submitted");

  if (error) throw new Error(`auto-approve: failed to load milestones: ${error.message}`);

  const result: AutoApproveResult = { approved: [], remindersSent: [] };
  if (!milestones?.length) return result;

  // Milestones under an open dispute never auto-approve.
  const { data: openDisputes } = await admin
    .from("disputes")
    .select("milestone_id")
    .eq("status", "open")
    .not("milestone_id", "is", null);
  const disputedMilestoneIds = new Set((openDisputes ?? []).map((d) => d.milestone_id));

  for (const milestone of milestones) {
    if (!milestone.submitted_at || disputedMilestoneIds.has(milestone.id)) continue;

    const elapsed = businessDaysElapsed(new Date(milestone.submitted_at), now);

    if (elapsed >= 5) {
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

      await admin
        .from("milestones")
        .update({ status: "approved", approved_at: now.toISOString() })
        .eq("id", milestone.id);

      await releaseEscrow({
        contractId: milestone.contract_id,
        milestoneId: milestone.id,
        fees: computeGigMilestoneFee(milestone.amount),
        hirerStripeCustomerId: hirer?.stripe_customer_id,
        talentStripeAccountId: talent?.stripe_account_id,
      });

      result.approved.push(milestone.id);
    } else if (elapsed === 4) {
      await sendAutoApproveReminder(admin, milestone.contract_id);
      result.remindersSent.push(milestone.id);
    }
  }

  return result;
}

async function sendAutoApproveReminder(
  admin: ReturnType<typeof createAdminClient>,
  contractId: string
) {
  const { data: contract } = await admin
    .from("contracts")
    .select("hirer_id")
    .eq("id", contractId)
    .single();
  if (!contract) return;
  const { data: hirer } = await admin
    .from("users")
    .select("email")
    .eq("id", contract.hirer_id)
    .single();
  const hirerEmail = hirer?.email;
  if (!hirerEmail) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
  await sendEmail({
    to: hirerEmail,
    subject: "A milestone auto-approves tomorrow",
    heading: "Milestone auto-approving soon",
    body: "A submitted milestone on one of your contracts will auto-approve and release payment in 1 business day unless you review it first.",
    ctaLabel: "Review milestone",
    ctaUrl: `${siteUrl}/dashboard/hirer/contracts/${contractId}`,
  });
}
