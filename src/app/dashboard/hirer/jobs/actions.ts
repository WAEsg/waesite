"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { jobPostSchema } from "@/lib/validation/contracts";
import { trackEvent } from "@/lib/analytics";

export type JobPostActionState = { error: string | null };

export async function createJobPost(
  _prevState: JobPostActionState,
  formData: FormData
): Promise<JobPostActionState> {
  const parsed = jobPostSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category") || undefined,
    engagement_type: formData.get("engagement_type"),
    budget_type: formData.get("budget_type"),
    budget_amount: formData.get("budget_amount"),
    urgent: formData.get("urgent") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: gig, error } = await supabase
    .from("gigs")
    .insert({
      hirer_id: user!.id,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category ?? null,
      engagement_type: parsed.data.engagement_type,
      budget_type: parsed.data.budget_type,
      budget_amount: parsed.data.budget_amount,
      urgent: parsed.data.urgent ?? false,
      status: "open",
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  await trackEvent("job_posted", user!.id, {
    gig_id: gig?.id,
    engagement_type: parsed.data.engagement_type,
  });

  revalidatePath("/dashboard/hirer/jobs");
  redirect("/dashboard/hirer/jobs");
}

export async function closeJobPost(gigId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("gigs")
    .update({ status: "cancelled" })
    .eq("id", gigId)
    .eq("hirer_id", user!.id);

  revalidatePath("/dashboard/hirer/jobs");
  revalidatePath(`/dashboard/hirer/jobs/${gigId}`);
}
