import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/notifications/send";
import { businessDaysElapsed } from "@/lib/milestones/auto-approve";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";

// Shared by the daily cron route — reminds a hirer who hasn't recorded a
// Confirm/Decline decision within 2 business days of an interview
// completing. Reuses businessDaysElapsed from the milestone auto-approve
// job rather than re-deriving the same "business day" math twice.
export async function runInterviewDecisionReminder(): Promise<{ reminded: string[] }> {
  const admin = createAdminClient();
  const now = new Date();

  const { data: interviews, error } = await admin
    .from("interviews")
    .select("id, application_id, gig_id, hirer_id, completed_at")
    .eq("status", "completed")
    .is("hirer_decision", null);

  if (error) throw new Error(`interview-decision-reminder: failed to load interviews: ${error.message}`);
  if (!interviews?.length) return { reminded: [] };

  const reminded: string[] = [];
  for (const interview of interviews) {
    if (!interview.completed_at) continue;
    if (businessDaysElapsed(new Date(interview.completed_at), now) < 2) continue;

    const { data: hirer } = await admin.from("users").select("email").eq("id", interview.hirer_id).single();
    if (!hirer?.email) continue;

    await sendEmail({
      to: hirer.email,
      subject: "An interview decision is waiting on WaeWork",
      heading: "Interview decision reminder",
      body: "You completed an interview a couple of days ago — confirm or decline the candidate to keep the process moving.",
      ctaLabel: "Review interview",
      ctaUrl: `${SITE_URL}/dashboard/hirer/applicants/${interview.gig_id}/interview/${interview.application_id}`,
    });
    reminded.push(interview.id);
  }

  return { reminded };
}
