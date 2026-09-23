"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { trackEvent } from "@/lib/analytics";
import { sendEmail } from "@/lib/notifications/send";

export type ApplyActionState = { error: string | null };

export async function applyToGig(
  _prevState: ApplyActionState,
  formData: FormData
): Promise<ApplyActionState> {
  const gigId = formData.get("gig_id");
  const coverLetter = formData.get("cover_letter");
  const proposedRate = formData.get("proposed_rate");

  if (typeof gigId !== "string" || !gigId) {
    return { error: "Invalid job post." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("applications").insert({
    gig_id: gigId,
    talent_id: user!.id,
    cover_letter: typeof coverLetter === "string" && coverLetter ? coverLetter : null,
    proposed_rate:
      typeof proposedRate === "string" && proposedRate ? Number(proposedRate) : null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You've already applied to this job." };
    }
    return { error: error.message };
  }

  await trackEvent("application_submitted", user!.id, { gig_id: gigId });

  const { data: gig } = await supabase.from("gigs").select("hirer_id, title").eq("id", gigId).single();
  if (gig) {
    // The talent's own RLS-scoped session can't read an arbitrary
    // hirer's `users` row (only hirer->talent visibility exists, once
    // an application exists) — the admin client is the trusted
    // server-side path for this notification lookup.
    const admin = createAdminClient();
    const { data: hirer } = await admin.from("users").select("email").eq("id", gig.hirer_id).single();
    if (hirer?.email) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
      await sendEmail({
        to: hirer.email,
        subject: "New application on WaeWork",
        heading: "You've got a new applicant",
        body: `Someone just applied to your job post "${gig.title}".`,
        ctaLabel: "Review applicant",
        ctaUrl: `${siteUrl}/dashboard/hirer/applicants/${gigId}`,
      });
    }
  }

  revalidatePath("/dashboard/talent/jobs");
  revalidatePath("/dashboard/talent/applications");
  return { error: null };
}
