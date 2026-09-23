import { NextResponse, type NextRequest } from "next/server";
import { runMilestoneAutoApprove } from "@/lib/milestones/auto-approve";

export const runtime = "nodejs";

// Vercel Cron hits this daily (see vercel.json). Next.js doesn't verify
// the caller is actually Vercel Cron, so CRON_SECRET guards it. If Vercel
// Cron isn't available on the current plan, the hirer-facing "review
// overdue milestones" action in the Active Contracts tab calls the same
// runMilestoneAutoApprove() function as a manual fallback.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runMilestoneAutoApprove();
  return NextResponse.json(result);
}
