import { redirect } from "next/navigation";
import { FileSignature, AlertTriangle, BadgeCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";
import { glassPanelLight } from "@/components/ui/glass";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { count: activeContractsCount },
    { count: openDisputesCount },
    { count: pendingVerificationsCount },
    { data: monthlyReleases },
  ] = await Promise.all([
    supabase.from("contracts").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("disputes").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("verification_status", "pending"),
    supabase
      .from("payment_events")
      .select("amount, fee_amount")
      .eq("event_type", "release")
      .gte("created_at", startOfMonth),
  ]);

  const grossVolume = (monthlyReleases ?? []).reduce((sum, e) => sum + Number(e.amount ?? 0), 0);
  const netRevenue = (monthlyReleases ?? []).reduce((sum, e) => sum + Number(e.fee_amount ?? 0), 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">Admin overview</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active contracts" value={activeContractsCount ?? 0} icon={FileSignature} />
        <StatCard label="Open disputes" value={openDisputesCount ?? 0} icon={AlertTriangle} />
        <StatCard
          label="Pending verifications"
          value={pendingVerificationsCount ?? 0}
          icon={BadgeCheck}
        />
      </div>

      <div className={`p-6 ${glassPanelLight}`}>
        <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
          This month
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
              Gross volume
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-ink-navy">
              SGD {grossVolume.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate">Total released from escrow</p>
          </div>
          <div>
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
              Net platform revenue
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-ink-navy">
              SGD {netRevenue.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate">Platform fees earned</p>
          </div>
        </div>
      </div>
    </div>
  );
}
