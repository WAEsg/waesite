"use client";

import { useActionState } from "react";
import { updatePassword, type UpdatePasswordActionState } from "./actions";
import { FormField, FormError, SubmitButton } from "@/components/ui/form-field";

const initialState: UpdatePasswordActionState = { error: null };

export default function UpdatePasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <>
      <h1 className="text-center text-2xl font-bold text-ink-navy">Set a new password</h1>
      <p className="mt-1 text-center text-sm text-ink-navy/70">
        Choose a new password for your WaeWork account.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <FormField
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
        />
        <FormError message={state.error} />
        <SubmitButton pending={pending}>Update password</SubmitButton>
      </form>
    </>
  );
}
