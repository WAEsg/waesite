"use client";

import { useActionState } from "react";
import { startVerification, type StartVerificationState } from "./actions";
import { SubmitButton, FormError } from "@/components/ui/form-field";

const initialState: StartVerificationState = { error: null };

export function StartVerificationForm({ label = "Start verification" }: { label?: string }) {
  const [state, formAction, pending] = useActionState(startVerification, initialState);

  if (state.error === "not_configured") {
    return (
      <p className="rounded-lg bg-alert-bg px-4 py-3 text-alert shadow-[inset_0_0_0_1px_#F5C56B]">
        Identity verification isn&apos;t configured on this environment yet. Check back
        shortly, or reach out at hello@waework.com if this persists.
      </p>
    );
  }

  return (
    <form action={formAction}>
      <FormError message={state.error} />
      <SubmitButton pending={pending}>{label}</SubmitButton>
    </form>
  );
}
