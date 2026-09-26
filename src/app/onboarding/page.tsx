import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignupWizardShell } from "@/components/auth/signup-wizard-shell";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role) {
    redirect(profile.role === "hirer" ? "/dashboard/hirer" : "/dashboard/talent");
  }

  const intendedRole = user.user_metadata?.intended_role;
  const defaultRole = intendedRole === "hirer" || intendedRole === "talent" ? intendedRole : null;

  return (
    <SignupWizardShell
      step={2}
      role={defaultRole}
      stepLabel="Step 2 of 3"
      title="Tell us a bit about you"
      lede="This sets up the right dashboard for you."
    >
      <OnboardingForm defaultRole={defaultRole} userId={user.id} />
    </SignupWizardShell>
  );
}
