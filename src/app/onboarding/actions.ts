"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { onboardingSchema } from "@/lib/validation/auth";

export type OnboardingActionState = { error: string | null };

export async function completeOnboarding(
  _prevState: OnboardingActionState,
  formData: FormData
): Promise<OnboardingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = onboardingSchema.safeParse({
    role: formData.get("role"),
    full_name: formData.get("full_name"),
    country: formData.get("country"),
    business_name: formData.get("business_name") || undefined,
    avatar_url: formData.get("avatar_url") || undefined,
    bio: formData.get("bio") || undefined,
    portfolio_link: formData.get("portfolio_link") || undefined,
    resume_url: formData.get("resume_url") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const { role, full_name, country, business_name, avatar_url, bio, portfolio_link, resume_url } = parsed.data;

  if (role === "hirer" && !business_name) {
    return { error: "Enter your business name." };
  }

  const { error } = await supabase
    .from("users")
    .update({
      role,
      full_name,
      country,
      business_name: role === "hirer" ? business_name : null,
      avatar_url: avatar_url || null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  // Bio/portfolio/resume are talent-only and all optional — only touch
  // talent_profiles when there's actually something to save, so this
  // doesn't create an empty row for someone who left every field blank.
  // Uses the admin client deliberately: talent_profiles_insert_own_verified
  // only allows a talent to write their own profile once
  // verification_status = 'passed' (step 3, which hasn't happened yet at
  // this point in the wizard) — same reasoning as the terms_acceptances
  // insert in signUp(), writing the user's own just-submitted data in a
  // trusted server context ahead of when their own session could.
  if (role === "talent" && (bio || portfolio_link || resume_url)) {
    const admin = createAdminClient();
    const { error: profileError } = await admin.from("talent_profiles").upsert({
      user_id: user.id,
      bio: bio || null,
      resume_url: resume_url || null,
      portfolio_links: portfolio_link ? [portfolio_link] : [],
    });
    if (profileError) {
      console.error("[onboarding] talent_profiles upsert failed", profileError);
    }
  }

  redirect(role === "hirer" ? "/dashboard/hirer" : "/dashboard/talent");
}
