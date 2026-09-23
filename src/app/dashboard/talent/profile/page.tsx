import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TalentProfileForm } from "./profile-form";

export default async function TalentProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("talent_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">My profile</h1>
      <TalentProfileForm profile={profile} />
    </div>
  );
}
