"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { talentProfileSchema } from "@/lib/validation/profile";

export type ProfileActionState = { error: string | null };

export async function saveTalentProfile(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const parsed = talentProfileSchema.safeParse({
    headline: formData.get("headline"),
    bio: formData.get("bio") || undefined,
    skills: formData.get("skills"),
    rate_amount: formData.get("rate_amount") || undefined,
    rate_unit: formData.get("rate_unit") || undefined,
    years_experience: formData.get("years_experience") || undefined,
    availability: formData.get("availability") || undefined,
    resume_url: formData.get("resume_url") || undefined,
    portfolio_links: formData.get("portfolio_links") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const skills = parsed.data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const portfolioLinks = (parsed.data.portfolio_links ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase.from("talent_profiles").upsert({
    user_id: user!.id,
    headline: parsed.data.headline,
    bio: parsed.data.bio ?? null,
    skills,
    rate_amount: parsed.data.rate_amount ?? null,
    rate_unit: parsed.data.rate_unit ?? null,
    years_experience: parsed.data.years_experience ?? null,
    availability: parsed.data.availability ?? null,
    resume_url: parsed.data.resume_url ?? null,
    portfolio_links: portfolioLinks,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/talent/profile");
  return { error: null };
}
