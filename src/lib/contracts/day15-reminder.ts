import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/notifications/send";

// Shared by the daily cron route — finds active contracts that hit their
// day-15 mark today and have no checkin row yet, then nudges the talent.
// Fires once per contract: once a checkin exists (any day value — the
// column defaults to 15, but this only needs "has the talent ever
// checked in"), the contract no longer matches.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";

function daysAgoDateString(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export async function runDay15CheckinReminder(): Promise<{ reminded: string[] }> {
  const admin = createAdminClient();
  const cutoff = daysAgoDateString(15);

  const { data: contracts, error } = await admin
    .from("contracts")
    .select("id, talent_id")
    .eq("status", "active")
    .eq("start_date", cutoff);

  if (error) throw new Error(`day15-checkin-reminder: failed to load contracts: ${error.message}`);
  if (!contracts?.length) return { reminded: [] };

  const { data: existingCheckins } = await admin
    .from("checkins")
    .select("contract_id")
    .in("contract_id", contracts.map((c) => c.id));
  const alreadyCheckedIn = new Set((existingCheckins ?? []).map((c) => c.contract_id));

  const reminded: string[] = [];
  for (const contract of contracts) {
    if (alreadyCheckedIn.has(contract.id)) continue;

    const { data: talent } = await admin.from("users").select("email").eq("id", contract.talent_id).single();
    if (!talent?.email) continue;

    await sendEmail({
      to: talent.email,
      subject: "Time for your day-15 check-in",
      heading: "Day-15 check-in",
      body: "You're 15 days into a contract on WaeWork — submit a quick progress note to keep your hirer in the loop. No payment is tied to this.",
      ctaLabel: "Submit check-in",
      ctaUrl: `${SITE_URL}/dashboard/talent/contracts/${contract.id}`,
    });
    reminded.push(contract.id);
  }

  return { reminded };
}
