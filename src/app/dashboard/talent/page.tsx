import Link from "next/link";
import { Search, ClipboardList, FileSignature } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { glassCardLight } from "@/components/ui/glass";
import { buttonPrimarySm } from "@/components/ui/button-classes";

export default async function TalentDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [
    { count: openGigs },
    { count: myApplications },
    { count: activeContracts },
    { data: talentProfile },
    { data: userRow },
  ] = await Promise.all([
    supabase.from("gigs").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("talent_id", user.id),
    supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("talent_id", user.id)
      .eq("status", "active"),
    supabase
      .from("talent_profiles")
      .select("portfolio_links")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase.from("users").select("onboarding_dismissed_at").eq("id", user.id).single(),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-navy">Talent dashboard</h1>
          <p className="mt-1 text-sm text-slate">Here&apos;s what&apos;s happening with your work.</p>
        </div>
        <Link href="/dashboard/talent/jobs" className={buttonPrimarySm}>
          Browse jobs
        </Link>
      </div>

      <OnboardingChecklist
        dismissed={Boolean(userRow?.onboarding_dismissed_at)}
        items={[
          {
            label: "Complete profile",
            href: "/dashboard/talent/profile",
            completed: Boolean(talentProfile),
          },
          {
            label: "Add portfolio",
            href: "/dashboard/talent/profile",
            completed: Boolean(talentProfile?.portfolio_links?.length),
          },
          {
            label: "Browse available jobs",
            href: "/dashboard/talent/jobs",
            completed: (myApplications ?? 0) > 0,
          },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open jobs" value={openGigs ?? 0} icon={Search} />
        <StatCard label="My applications" value={myApplications ?? 0} icon={ClipboardList} />
        <StatCard label="Active contracts" value={activeContracts ?? 0} icon={FileSignature} />
      </div>

      <div className={`p-6 ${glassCardLight}`}>
        <h2 className="font-display text-lg font-bold text-ink-navy">Quick links</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/dashboard/talent/applications" className="font-bold text-voyage-blue hover:underline">
            My applications
          </Link>
          <Link href="/dashboard/talent/contracts" className="font-bold text-voyage-blue hover:underline">
            Current jobs
          </Link>
          <Link href="/dashboard/talent/profile" className="font-bold text-voyage-blue hover:underline">
            Edit profile
          </Link>
        </div>
      </div>
    </div>
  );
}
