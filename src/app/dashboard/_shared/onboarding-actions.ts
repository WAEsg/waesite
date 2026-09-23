"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function dismissOnboardingChecklist() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("users")
    .update({ onboarding_dismissed_at: new Date().toISOString() })
    .eq("id", user!.id);

  revalidatePath("/dashboard/hirer");
  revalidatePath("/dashboard/talent");
}
