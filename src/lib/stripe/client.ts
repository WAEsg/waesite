import "server-only";
import Stripe from "stripe";

let cached: Stripe | null | undefined;

// Returns null when STRIPE_SECRET_KEY isn't set, same graceful-degrade
// idiom as verifyTurnstile()/Resend elsewhere in this codebase — callers
// branch on null rather than this throwing, so the app keeps working
// with an honest "payments not configured yet" state until a real Stripe
// account exists.
export function getStripeClient(): Stripe | null {
  if (cached !== undefined) return cached;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  cached = secretKey ? new Stripe(secretKey) : null;
  return cached;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
