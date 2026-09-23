import { NextResponse, type NextRequest } from "next/server";
import { getStripeClient } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/notifications/send";

// Server-to-server callback from Stripe, not a browser redirect — see
// src/app/auth/myinfo/callback/route.ts for the OAuth-style counterpart.
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_IDENTITY_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe Identity not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type === "identity.verification_session.verified" ||
    event.type === "identity.verification_session.requires_input"
  ) {
    const session = event.data.object as { id: string; metadata?: { user_id?: string } };
    const userId = session.metadata?.user_id;
    const status = event.type === "identity.verification_session.verified" ? "passed" : "failed";

    if (userId) {
      const admin = createAdminClient();
      await admin
        .from("verification_records")
        .update({
          status,
          raw_payload: event.data.object as unknown as Record<string, unknown>,
        })
        .eq("provider_reference_id", session.id);
      await admin.from("users").update({ verification_status: status }).eq("id", userId);

      const { data: verifiedUser } = await admin.from("users").select("email, role").eq("id", userId).single();
      if (verifiedUser?.email) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
        const dashboardRole = verifiedUser.role === "hirer" ? "hirer" : "talent";
        await sendEmail({
          to: verifiedUser.email,
          subject: status === "passed" ? "You're verified on WaeWork" : "Verification needs another look",
          heading: status === "passed" ? "Verification passed" : "Verification unsuccessful",
          body:
            status === "passed"
              ? "Your identity has been verified — you now have full access to WaeWork."
              : "We couldn't verify your identity with the information provided. You can try again from your dashboard.",
          ctaLabel: status === "passed" ? "Go to dashboard" : "Try again",
          ctaUrl:
            status === "passed"
              ? `${siteUrl}/dashboard/${dashboardRole}`
              : `${siteUrl}/onboarding/verify`,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
