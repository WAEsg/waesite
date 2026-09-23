"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { applicationDecisionSchema } from "@/lib/validation/contracts";
import { chargePlacementFee } from "@/lib/stripe/escrow";
import { computePlacementFee } from "@/lib/stripe/fees";
import { sendEmail } from "@/lib/notifications/send";

export type ApplicantActionState = { error: string | null };

export async function decideApplication(
  _prevState: ApplicantActionState,
  formData: FormData
): Promise<ApplicantActionState> {
  const parsed = applicationDecisionSchema.safeParse({
    application_id: formData.get("application_id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS (applications_update_involved) already restricts this to
  // applications on gigs this hirer owns — no extra ownership check
  // needed here, the update will simply affect 0 rows otherwise.
  const { data: application, error } = await supabase
    .from("applications")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.application_id)
    .select("gig_id, talent_id")
    .single();

  if (error) {
    return { error: error.message };
  }

  if (application) {
    const admin = createAdminClient();
    const { data: talent } = await admin.from("users").select("email").eq("id", application.talent_id).single();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";

    if (talent?.email && (parsed.data.status === "shortlisted" || parsed.data.status === "rejected")) {
      await sendEmail({
        to: talent.email,
        subject:
          parsed.data.status === "shortlisted"
            ? "You've been shortlisted on WaeWork"
            : "Update on your WaeWork application",
        heading: parsed.data.status === "shortlisted" ? "You're shortlisted" : "Application update",
        body:
          parsed.data.status === "shortlisted"
            ? "A hirer has shortlisted your application and may reach out soon."
            : "A hirer has decided not to move forward with your application this time.",
        ctaLabel: "View applications",
        ctaUrl: `${siteUrl}/dashboard/talent/applications`,
      });
    }
  }

  // Accepting an application creates the contract — that's the moment a
  // gig turns into real work, and the milestone tracker / check-ins need
  // a contract row to attach to.
  if (parsed.data.status === "accepted" && application) {
    const { data: gig } = await supabase
      .from("gigs")
      .select("hirer_id, engagement_type, budget_type, budget_amount")
      .eq("id", application.gig_id)
      .single();

    if (gig) {
      const isRetainer = gig.engagement_type === "ongoing";
      // Retainer contracts carry a one-time placement fee (one month's
      // pay); gig/project contracts don't — they pay the 15% gig fee out
      // of milestone releases instead (see computeGigMilestoneFee).
      const placementFeeAmount = isRetainer ? gig.budget_amount : null;

      const { data: contract } = await supabase
        .from("contracts")
        .insert({
          gig_id: application.gig_id,
          hirer_id: gig.hirer_id,
          talent_id: application.talent_id,
          type: isRetainer ? "retainer" : "one_off",
          rate_amount: gig.budget_amount,
          rate_type: gig.budget_type === "hourly" ? "hourly" : "fixed",
          status: "active",
          start_date: new Date().toISOString().slice(0, 10),
          original_placement_date: new Date().toISOString().slice(0, 10),
          current_period_start: isRetainer ? new Date().toISOString().slice(0, 10) : null,
          monthly_pay: isRetainer ? gig.budget_amount : null,
          placement_fee_amount: placementFeeAmount,
        })
        .select("id")
        .single();

      await supabase.from("gigs").update({ status: "in_progress" }).eq("id", application.gig_id);

      if (contract) {
        const admin = createAdminClient();
        const [{ data: hirerUser }, { data: talentUser }] = await Promise.all([
          admin.from("users").select("email").eq("id", gig.hirer_id).single(),
          admin.from("users").select("email").eq("id", application.talent_id).single(),
        ]);
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
        const recipients = [hirerUser?.email, talentUser?.email].filter(
          (e): e is string => Boolean(e)
        );
        for (const to of recipients) {
          await sendEmail({
            to,
            subject: "You've been matched on WaeWork",
            heading: "Match confirmed",
            body: "A contract has been created — you can now track milestones and payments from your dashboard.",
            ctaLabel: "View contract",
            ctaUrl: `${siteUrl}/dashboard/hirer/contracts/${contract.id}`,
          });
        }
      }

      if (contract && placementFeeAmount) {
        const admin = createAdminClient();
        const { data: hirer } = await admin
          .from("users")
          .select("stripe_customer_id")
          .eq("id", gig.hirer_id)
          .single();
        // computePlacementFee is a passthrough today, but keeps the fee
        // schedule single-sourced if the placement-fee rule ever changes.
        await chargePlacementFee({
          contractId: contract.id,
          amount: computePlacementFee(placementFeeAmount).totalCharge,
          hirerStripeCustomerId: hirer?.stripe_customer_id,
        });
      }
    }
  }

  revalidatePath(`/dashboard/hirer/applicants/${application?.gig_id}`);
  revalidatePath("/dashboard/hirer/contracts");
  return { error: null };
}

// Plain-form variant (no useActionState) for the inline shortlist/match/
// decline buttons on the applicants list — same logic, void return.
export async function decideApplicationForm(formData: FormData): Promise<void> {
  await decideApplication({ error: null }, formData);
}
