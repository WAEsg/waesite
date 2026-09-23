import { NextResponse, type NextRequest } from "next/server";
import { runDay15CheckinReminder } from "@/lib/contracts/day15-reminder";

export const runtime = "nodejs";

// Vercel Cron hits this daily (see vercel.json) — mirrors the
// auto-approve-milestones cron route's CRON_SECRET auth pattern.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDay15CheckinReminder();
  return NextResponse.json(result);
}
