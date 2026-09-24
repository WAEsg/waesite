"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { waitlistSignupSchema } from "@/lib/validation/waitlist";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendEmail } from "@/lib/notifications/send";

export type WaitlistActionState = {
  status: "idle" | "error" | "sent" | "duplicate";
  message: string | null;
};

// Runs before the visitor has any account or session, so this has to use
// the admin client (same reasoning as the terms_acceptances insert in
// signUp() — there's no auth.uid() yet for RLS to scope to). The insert
// policy itself is public, but the admin client sidesteps RLS evaluation
// entirely, which is fine here since every field is already
// Zod-validated server-side above it.
export async function submitWaitlistSignup(
  _prevState: WaitlistActionState,
  formData: FormData
): Promise<WaitlistActionState> {
  const turnstileOk = await verifyTurnstile(formData.get("cf-turnstile-response"));
  if (!turnstileOk) {
    return { status: "error", message: "Verification failed — please try again." };
  }

  const parsed = waitlistSignupSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    skill_category: formData.get("skill_category") || undefined,
    portfolio_link: formData.get("portfolio_link") || undefined,
    availability: formData.get("availability") || undefined,
    expected_rate: formData.get("expected_rate") || undefined,
    intro_text: formData.get("intro_text") || undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("waitlist_signups").insert(parsed.data);

  if (error) {
    if (error.code === "23505") {
      return {
        status: "duplicate",
        message: "That email is already on the Founding Talent waitlist — we'll be in touch.",
      };
    }
    console.error("[waitlist] insert failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  // Best-effort — a failed confirmation email shouldn't fail the signup
  // itself, since the row is already saved. Same reasoning as the other
  // sendEmail() call sites in this codebase.
  await sendEmail({
    to: parsed.data.email,
    subject: "You're on the WaeWork Founding Talent waitlist",
    heading: "You're on the list",
    body: `Hi ${parsed.data.full_name}, thanks for joining the WaeWork Founding Talent waitlist. We'll email you as soon as invites go out — Founding Talent get first access to matching and a locked-in fee discount for being early.`,
  }).catch((error) => {
    console.error("[waitlist] confirmation email failed", error);
  });

  return {
    status: "sent",
    message: "You're on the Founding Talent waitlist — we'll email you when invites go out.",
  };
}

// Called from the signup page when it's loaded via a waitlist invite
// link (?invite=<token>), to pre-fill the email field. Only returns a
// match while the invite is still unclaimed (status = 'invited') — once
// someone's converted, the token shouldn't silently pre-fill a new
// signup attempt as if it were still open.
export async function lookupWaitlistInvite(token: string): Promise<{ email: string; full_name: string } | null> {
  if (!token) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("waitlist_signups")
    .select("email, full_name")
    .eq("invite_token", token)
    .eq("status", "invited")
    .maybeSingle();

  return data ?? null;
}
