"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { hirerProfileSchema } from "@/lib/validation/profile";

export type ProfileActionState = { error: string | null };

export async function saveHirerProfile(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const parsed = hirerProfileSchema.safeParse({
    company_name: formData.get("company_name"),
    uen: formData.get("uen") || undefined,
    company_size: formData.get("company_size") || undefined,
    industry: formData.get("industry") || undefined,
    website: formData.get("website") || undefined,
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("hirer_profiles").upsert({
    user_id: user!.id,
    ...parsed.data,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/hirer/company-profile");
  return { error: null };
}
