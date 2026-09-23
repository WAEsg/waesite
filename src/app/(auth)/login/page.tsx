"use client";

import Link from "next/link";
import { useActionState } from "react";
import { logIn, type AuthActionState } from "../actions";
import { FormField, FormError, SubmitButton } from "@/components/ui/form-field";

const initialState: AuthActionState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(logIn, initialState);

  return (
    <>
      <h1 className="text-center text-2xl font-bold text-ink-navy">
        Welcome back
      </h1>
      <p className="mt-1 text-center text-sm text-ink-navy/70">
        Log in to your WaeWork account.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <FormField label="Email" name="email" type="email" autoComplete="email" />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
        />
        <FormError message={state.error} />
        <SubmitButton pending={pending}>Log in</SubmitButton>
      </form>

      <p className="mt-3 text-center text-sm">
        <Link href="/reset-password" className="font-semibold text-voyage-blue hover:text-ink-navy">
          Forgot your password?
        </Link>
      </p>

      <p className="mt-6 text-center text-sm text-ink-navy/70">
        New to WaeWork?{" "}
        <Link href="/signup" className="font-semibold text-voyage-blue hover:text-ink-navy">
          Create an account
        </Link>
      </p>
    </>
  );
}
