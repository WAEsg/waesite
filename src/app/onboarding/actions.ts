"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const { role, full_name, country, business_name } = parsed.data;

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
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect(role === "hirer" ? "/dashboard/hirer" : "/dashboard/talent");
}
