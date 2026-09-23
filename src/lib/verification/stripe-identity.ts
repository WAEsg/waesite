import "server-only";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

// Universal verification path at launch (SG included) — see the plan's
// reconciliation notes on why MyInfo isn't switched on yet. Returns
// configured: false when STRIPE_SECRET_KEY isn't set, so /onboarding/verify
// can show an honest "verification isn't available yet" state instead of a
// broken redirect.
export async function startStripeIdentityVerification(params: {
  userId: string;
  returnUrl: string;
}): Promise<{ configured: boolean; url?: string }> {
  const stripe = getStripeClient();
  if (!stripe || !isStripeConfigured()) {
    return { configured: false };
  }

  const session = await stripe.identity.verificationSessions.create({
    type: "document",
    metadata: { user_id: params.userId },
    return_url: params.returnUrl,
  });

  const admin = createAdminClient();
  await admin.from("verification_records").insert({
    user_id: params.userId,
    provider: "stripe_identity",
    provider_reference_id: session.id,
    status: "pending",
  });
  await admin
    .from("users")
    .update({ verification_status: "pending" })
    .eq("id", params.userId);

  return { configured: true, url: session.url ?? undefined };
}
