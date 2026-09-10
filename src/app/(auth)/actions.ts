"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { logInSchema, signUpSchema } from "@/lib/validation/auth";

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

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? (await headers()).get("origin") ?? "";

  const intendedRole = formData.get("role");
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
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
