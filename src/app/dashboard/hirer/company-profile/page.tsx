import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CompanyProfileForm } from "./company-profile-form";

export default async function CompanyProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("hirer_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">Company profile</h1>
      <CompanyProfileForm profile={profile} />
    </div>
  );
}
