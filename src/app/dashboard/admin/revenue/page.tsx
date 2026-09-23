import { redirect } from "next/navigation";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassPanelLight } from "@/components/ui/glass";
import { EmptyState } from "@/components/dashboard/empty-state";

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export default async function AdminRevenuePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const { data: events } = await supabase
    .from("payment_events")
    .select("amount, fee_amount, event_type, created_at")
    .eq("event_type", "release")
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: true });

  const byMonth = new Map<string, { gross: number; net: number; count: number }>();
  for (const e of events ?? []) {
    const key = monthKey(e.created_at);
    const entry = byMonth.get(key) ?? { gross: 0, net: 0, count: 0 };
    entry.gross += Number(e.amount ?? 0);
    entry.net += Number(e.fee_amount ?? 0);
    entry.count += 1;
    byMonth.set(key, entry);
  }

  const rows = Array.from(byMonth.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, v]) => ({ key, ...v }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-navy">Revenue</h1>
        <a
          href="/api/admin/revenue-export"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-paper-white px-4 py-2 text-sm font-semibold text-ink-navy transition duration-200 hover:-translate-y-0.5 hover:border-voyage-blue hover:text-voyage-blue hover:shadow-md"
        >
          <Download className="h-4 w-4" /> Download CSV
        </a>
      </div>

      {!rows.length ? (
        <EmptyState
          icon={Download}
          title="No revenue data yet"
          description="No escrow releases have happened in the last 6 months."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className={`w-full text-left text-sm ${glassPanelLight}`}>
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate">
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Gross volume</th>
                <th className="px-4 py-3">Platform fee revenue</th>
                <th className="px-4 py-3">Events</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-t border-line">
                  <td className="px-4 py-3 text-ink-navy">{monthLabel(r.key)}</td>
                  <td className="px-4 py-3 text-ink-navy">SGD {r.gross.toLocaleString()}</td>
                  <td className="px-4 py-3 text-ink-navy">SGD {r.net.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate">{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
