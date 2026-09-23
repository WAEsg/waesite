import Link from "next/link";
import { Briefcase, Users, FileSignature } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { glassCardLight } from "@/components/ui/glass";
import { buttonPrimarySm } from "@/components/ui/button-classes";

export default async function HirerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [
    { count: openGigs },
    { count: activeContracts },
    { data: myGigs },
    { data: hirerProfile },
    { data: userRow },
  ] = await Promise.all([
    supabase
      .from("gigs")
      .select("id", { count: "exact", head: true })
      .eq("hirer_id", user.id)
      .eq("status", "open"),
    supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("hirer_id", user.id)
      .eq("status", "active"),
    supabase.from("gigs").select("id").eq("hirer_id", user.id),
    supabase.from("hirer_profiles").select("user_id").eq("user_id", user.id).maybeSingle(),
    supabase.from("users").select("onboarding_dismissed_at").eq("id", user.id).single(),
  ]);

  const gigIds = (myGigs ?? []).map((g) => g.id);
  const [{ count: pendingApplicants }, { count: reviewedApplicants }] = gigIds.length
    ? await Promise.all([
        supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .in("gig_id", gigIds)
          .in("status", ["pending", "shortlisted"]),
        supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .in("gig_id", gigIds)
          .neq("status", "pending"),
      ])
    : [{ count: 0 }, { count: 0 }];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-navy">Hirer dashboard</h1>
          <p className="mt-1 text-sm text-slate">Here&apos;s what&apos;s happening across your team.</p>
        </div>
        <Link href="/dashboard/hirer/jobs/new" className={buttonPrimarySm}>
          Post a job
        </Link>
      </div>

      <OnboardingChecklist
        dismissed={Boolean(userRow?.onboarding_dismissed_at)}
        items={[
          {
            label: "Complete company profile",
            href: "/dashboard/hirer/company-profile",
            completed: Boolean(hirerProfile),
          },
          {
            label: "Post your first job",
            href: "/dashboard/hirer/jobs/new",
            completed: gigIds.length > 0,
          },
          {
            label: "Review applicants",
            href: "/dashboard/hirer/applicants",
            completed: (reviewedApplicants ?? 0) > 0,
          },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open job posts" value={openGigs ?? 0} icon={Briefcase} />
        <StatCard label="Applicants to review" value={pendingApplicants ?? 0} icon={Users} />
        <StatCard label="Active contracts" value={activeContracts ?? 0} icon={FileSignature} />
      </div>

      <div className={`p-6 ${glassCardLight}`}>
        <h2 className="font-display text-lg font-bold text-ink-navy">Quick links</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/dashboard/hirer/jobs" className="font-bold text-voyage-blue hover:underline">
            My job posts
          </Link>
          <Link href="/dashboard/hirer/applicants" className="font-bold text-voyage-blue hover:underline">
            Review applicants
          </Link>
          <Link href="/dashboard/hirer/contracts" className="font-bold text-voyage-blue hover:underline">
            Active contracts
          </Link>
        </div>
      </div>
    </div>
  );
}
