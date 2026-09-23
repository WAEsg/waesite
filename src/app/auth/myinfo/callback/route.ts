import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { isMyInfoConfigured } from "@/lib/verification/myinfo";

// Browser-redirect target for the MyInfo authorization-code flow, mirroring
// src/app/auth/confirm/route.ts's shape. Scaffolded but not wired to a real
// token/attribute exchange yet — see the plan's reconciliation notes on why
// (a real Singpass relying-party registration is a separate, external
// process). Stripe Identity is the universal verification path until
// MYINFO_CLIENT_ID/SECRET are actually set.
export async function GET(request: NextRequest) {
  if (!isMyInfoConfigured()) {
    redirect("/onboarding/verify?error=myinfo_not_configured");
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    redirect("/onboarding/verify?error=myinfo_failed");
  }

  // TODO once MyInfo credentials exist: exchange `code` for the person's
  // verified attributes, write a verification_records row + update
  // users.verification_status, same shape as the Stripe Identity webhook.
  redirect("/onboarding/verify?error=myinfo_not_implemented");
}
