"use client";

import { useActionState, useState } from "react";
import { acknowledgeNonCircumvention, type InterviewActionState } from "@/app/dashboard/_shared/interview-actions";
import { buttonPrimary } from "@/components/ui/button-classes";
import { FormError } from "@/components/ui/form-field";

const initialState: InterviewActionState = { error: null };

export function AcknowledgmentForm({ applicationId }: { applicationId: string }) {
  const [state, formAction, pending] = useActionState(acknowledgeNonCircumvention, initialState);
  const [checked, setChecked] = useState(false);

  return (
    <form action={formAction} className="mt-5 space-y-4">
      <input type="hidden" name="application_id" value={applicationId} />
      <label className="flex items-start gap-2 text-sm text-ink-navy">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-line"
        />
        I understand and agree
      </label>
      <FormError message={state.error} />
      <button
        type="submit"
        disabled={!checked || pending}
        className={`${buttonPrimary} w-full disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {pending ? "Please wait…" : "Continue to Scheduling"}
      </button>
    </form>
  );
}
