"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { requestPasswordResetSchema } from "@/lib/validation/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export type ResetPasswordActionState = { error: string | null };

export async function requestPasswordReset(
  _prevState: ResetPasswordActionState,
  formData: FormData
): Promise<ResetPasswordActionState> {
  const parsed = requestPasswordResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const withinLimit = await checkRateLimit("login", `reset:${parsed.data.email}`);
  if (!withinLimit) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (await headers()).get("origin") ||
    "";

  const supabase = await createClient();
  // Errors are intentionally not surfaced — same "always show the sent
  // screen" pattern as most auth flows, so this can't be used to check
  // which emails have accounts.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/confirm?next=/update-password`,
  });

  redirect("/reset-password/sent");
}
