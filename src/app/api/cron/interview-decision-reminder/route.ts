import { NextResponse, type NextRequest } from "next/server";
import { runInterviewDecisionReminder } from "@/lib/contracts/interview-decision-reminder";

export const runtime = "nodejs";

// Vercel Cron hits this daily (see vercel.json) — mirrors the other cron
// routes' CRON_SECRET auth pattern.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runInterviewDecisionReminder();
  return NextResponse.json(result);
}
