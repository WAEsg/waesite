import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassPanelLight } from "@/components/ui/glass";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { BadgeTone } from "@/lib/labels";

const statusLabel: Record<string, string> = {
  pending: "Pending",
  active: "Active",
  cancelled: "Cancelled",
  past_due: "Past due",
};

const statusTone: Record<string, BadgeTone> = {
  pending: "warning",
  active: "success",
  cancelled: "neutral",
  past_due: "error",
};

const tierLabel: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
  custom: "Custom",
};

export default async function AdminAiStaffingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: subscriptions } = await supabase
    .from("ai_staffing_subscriptions")
    .select("id, hirer_id, tier, status, created_at")
    .order("created_at", { ascending: false });

  const activeCount = (subscriptions ?? []).filter((s) => s.status === "active").length;
  const starterCount = (subscriptions ?? []).filter((s) => s.tier === "starter").length;
  const growthCount = (subscriptions ?? []).filter((s) => s.tier === "growth").length;
  const customCount = (subscriptions ?? []).filter((s) => s.tier === "custom").length;

  const hirerIds = Array.from(new Set((subscriptions ?? []).map((s) => s.hirer_id)));
  const { data: hirers } = hirerIds.length
    ? await supabase.from("users").select("id, full_name, email").in("id", hirerIds)
    : { data: [] };
  const nameById = new Map((hirers ?? []).map((h) => [h.id, h.full_name ?? h.email]));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">AI Staffing</h1>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Active subscriptions" value={activeCount} icon={Sparkles} />
        <StatCard label="Starter tier" value={starterCount} />
        <StatCard label="Growth tier" value={growthCount} />
        <StatCard label="Custom tier" value={customCount} />
      </div>

      {!subscriptions?.length ? (
        <EmptyState
          icon={Sparkles}
          title="No AI Staffing subscriptions yet"
          description="This launches once the AI agent backend and Stripe Billing checkout are live."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className={`w-full text-left text-sm ${glassPanelLight}`}>
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate">
                <th className="px-4 py-3">Hirer</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="px-4 py-3 text-ink-navy">{nameById.get(s.hirer_id) ?? "Hirer"}</td>
                  <td className="px-4 py-3 text-ink-navy">{tierLabel[s.tier] ?? s.tier}</td>
                  <td className="px-4 py-3">
                    <StatusBadge label={statusLabel[s.status] ?? s.status} tone={statusTone[s.status] ?? "neutral"} />
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
