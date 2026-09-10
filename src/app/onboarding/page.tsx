import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RouteLine } from "@/components/route-line";
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
  const defaultRole =
    intendedRole === "hirer" || intendedRole === "talent" ? intendedRole : null;

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-cloud-blue px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-paper-white p-8 shadow-sm">
        <RouteLine className="mx-auto h-8 w-40" />
        <h1 className="mt-4 text-center text-2xl font-bold text-ink-navy">
          Tell us a bit about you
        </h1>
        <p className="mt-1 text-center text-sm text-ink-navy/70">
          This sets up the right dashboard for you.
        </p>
        <OnboardingForm defaultRole={defaultRole} />
      </div>
    </div>
  );
}
