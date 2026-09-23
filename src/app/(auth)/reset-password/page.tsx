"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type ResetPasswordActionState } from "./actions";
import { FormField, FormError, SubmitButton } from "@/components/ui/form-field";

const initialState: ResetPasswordActionState = { error: null };

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  return (
    <>
      <h1 className="text-center text-2xl font-bold text-ink-navy">Reset your password</h1>
      <p className="mt-1 text-center text-sm text-ink-navy/70">
        We&apos;ll email you a link to set a new one.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <FormField label="Email" name="email" type="email" autoComplete="email" />
        <FormError message={state.error} />
        <SubmitButton pending={pending}>Send reset link</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink-navy/70">
        <Link href="/login" className="font-semibold text-voyage-blue hover:text-ink-navy">
          Back to login
        </Link>
      </p>
    </>
  );
}
