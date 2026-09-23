import "server-only";
import { getStripeClient, isStripeConfigured } from "./client";

// Builds (or reuses) a Stripe Connect Express account for a talent's
// payouts and returns an onboarding link. Returns null when Stripe isn't
// configured — callers show a "payouts aren't set up yet" state instead.
export async function getConnectOnboardingLink(params: {
  existingAccountId?: string | null;
  email: string;
  country: string;
  returnUrl: string;
  refreshUrl: string;
}): Promise<{ url: string; accountId: string } | null> {
  const stripe = getStripeClient();
  if (!stripe || !isStripeConfigured()) return null;

  const accountId =
    params.existingAccountId ??
    (
      await stripe.accounts.create({
        type: "express",
        email: params.email,
        country: params.country,
        capabilities: { transfers: { requested: true } },
      })
    ).id;

  const link = await stripe.accountLinks.create({
    account: accountId,
    type: "account_onboarding",
    return_url: params.returnUrl,
    refresh_url: params.refreshUrl,
  });

  return { url: link.url, accountId };
}
