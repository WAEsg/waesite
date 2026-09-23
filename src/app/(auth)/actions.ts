"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logInSchema, signUpSchema } from "@/lib/validation/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { LEGAL_VERSIONS } from "@/lib/legal";
import { trackEvent } from "@/lib/analytics";

export type AuthActionState = { error: string | null };

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const withinLimit = await checkRateLimit("signup", parsed.data.email);
  if (!withinLimit) {
    return { error: "Too many signup attempts. Try again in a few minutes." };
  }

  const turnstileOk = await verifyTurnstile(formData.get("cf-turnstile-response"));
  if (!turnstileOk) {
    return { error: "Verification failed. Please try again." };
  }

  if (formData.get("terms_accepted") !== "on") {
    return { error: "You need to agree to the Terms of Service and Privacy Policy." };
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (await headers()).get("origin") ||
    "";

  const intendedRole = formData.get("role");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
      ...((intendedRole === "hirer" || intendedRole === "talent") && {
        data: { intended_role: intendedRole },
      }),
    },
  });

  if (error) {
    return { error: error.message };
  }

  // No session exists yet (email confirmation is required before one
  // does), so this can't go through the user's own RLS-scoped client —
  // the admin client records the acceptance as a fact about the account
  // that was just created, same as handle_new_user() does for the base
  // profile row.
  if (data.user) {
    const admin = createAdminClient();
    await admin.from("terms_acceptances").insert([
      { user_id: data.user.id, document_type: "tos", version: LEGAL_VERSIONS.tos },
      { user_id: data.user.id, document_type: "privacy", version: LEGAL_VERSIONS.privacy },
    ]);
    await trackEvent("signup_completed", data.user.id, { role: intendedRole ?? null });
  }

  redirect("/signup/check-email");
}

export async function logIn(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = logInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const withinLimit = await checkRateLimit("login", parsed.data.email);
  if (!withinLimit) {
    return { error: "Too many login attempts. Try again in a few minutes." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Incorrect email or password." };
  }

  redirect("/onboarding");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
