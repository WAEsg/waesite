import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function csvEscape(value: string | number) {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

// Streams a CSV of monthly gross volume / platform fee revenue, grouped
// over all history (not just the 6-month window shown on the revenue
// page). Does its own admin-role check since this is a Route Handler,
// not gated by the dashboard layout.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: events } = await supabase
    .from("payment_events")
    .select("amount, fee_amount, created_at")
    .eq("event_type", "release")
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

  const rows = Array.from(byMonth.entries()).sort(([a], [b]) => (a < b ? -1 : 1));

  const lines = ["month,gross_volume,platform_fee_revenue,event_count"];
  for (const [key, v] of rows) {
    lines.push(
      [csvEscape(key), csvEscape(v.gross), csvEscape(v.net), csvEscape(v.count)].join(",")
    );
  }
  const csv = lines.join("\n") + "\n";

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="waework-revenue.csv"',
    },
  });
}
