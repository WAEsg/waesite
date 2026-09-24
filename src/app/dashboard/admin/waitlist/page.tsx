import { redirect } from "next/navigation";
import { ListChecks, Send, UserCheck, BadgeCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight } from "@/components/ui/glass";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { BadgeTone } from "@/lib/labels";
import { SendInvitesButton } from "./send-invites-button";

const statusLabel: Record<string, string> = {
  waitlisted: "Waitlisted",
  invited: "Invited",
  signed_up: "Signed up",
  verified: "Verified",
};

const statusTone: Record<string, BadgeTone> = {
  waitlisted: "neutral",
  invited: "info",
  signed_up: "warning",
  verified: "success",
};

export default async function AdminWaitlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: signups } = await supabase
    .from("waitlist_signups")
    .select("id, full_name, email, skill_category, status, created_at, invite_sent_at, converted_at")
    .order("created_at", { ascending: false });

  const rows = signups ?? [];
  const counts = {
    waitlisted: rows.filter((r) => r.status === "waitlisted").length,
    invited: rows.filter((r) => r.status === "invited").length,
    signed_up: rows.filter((r) => r.status === "signed_up").length,
    verified: rows.filter((r) => r.status === "verified").length,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-navy">Founding Talent waitlist</h1>
          <p className="mt-1 text-slate">{rows.length} total signups since launch.</p>
        </div>
        <SendInvitesButton pendingCount={counts.waitlisted} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Waitlisted" value={counts.waitlisted} icon={ListChecks} />
        <StatCard label="Invited" value={counts.invited} icon={Send} />
        <StatCard label="Signed up" value={counts.signed_up} icon={UserCheck} />
        <StatCard label="Verified" value={counts.verified} icon={BadgeCheck} />
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={ListChecks} title="No signups yet" description="Nobody has joined the Founding Talent waitlist yet." />
      ) : (
        <div className={`overflow-hidden ${glassCardLight}`}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-slate uppercase">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Skill</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-bold text-ink-navy">{r.full_name}</td>
                  <td className="px-4 py-3 text-slate">{r.email}</td>
                  <td className="px-4 py-3 text-slate">{r.skill_category ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge label={statusLabel[r.status] ?? r.status} tone={statusTone[r.status] ?? "neutral"} />
                  </td>
                  <td className="px-4 py-3 text-slate">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
