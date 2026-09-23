import { NextResponse, type NextRequest } from "next/server";
import { getStripeClient } from "@/lib/stripe/client";

// General Stripe webhook (payments/Connect account events) — separate from
// the Identity verification webhook, since they're different Stripe
// products with different signing secrets. escrow.ts writes payment_events
// synchronously when a hold/release/refund is initiated; this endpoint is
// for async reconciliation once real Stripe usage exists (failed captures,
// disputes, Connect account status changes).
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // No live Stripe account exists yet, so there's nothing to reconcile
  // against in practice. Acknowledging signed events now (rather than
  // leaving this route absent) means the endpoint is ready to register
  // with Stripe the moment a real account/webhook secret exists.
  return NextResponse.json({ received: true });
}
