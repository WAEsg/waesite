"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { startStripeIdentityVerification } from "@/lib/verification/stripe-identity";

export type StartVerificationState = { error: string | null };

// useActionState always calls (prevState, formData); this action needs
// neither, since starting verification just needs the signed-in user.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function startVerification(_prevState: StartVerificationState, _formData: FormData): Promise<StartVerificationState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (await headers()).get("origin") ||
    "";

  const result = await startStripeIdentityVerification({
    userId: user.id,
    returnUrl: `${origin}/onboarding/verify`,
  });

  if (!result.configured) {
    return { error: "not_configured" };
  }

  if (!result.url) {
    return { error: "Couldn't start verification. Please try again." };
  }

  redirect(result.url);
}
