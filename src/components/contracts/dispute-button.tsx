"use client";

import { useActionState, useState } from "react";
import { raiseDispute, type ActionState } from "@/app/dashboard/_shared/contract-actions";
import { buttonSecondary } from "@/components/ui/button-classes";

const initial: ActionState = { error: null };

export function DisputeButton({
  contractId,
  milestoneId,
}: {
  contractId: string;
  milestoneId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(raiseDispute, initial);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-error hover:underline"
      >
        Raise a dispute
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="contract_id" value={contractId} />
      {milestoneId && <input type="hidden" name="milestone_id" value={milestoneId} />}
      <textarea
        name="reason"
        required
        rows={2}
        placeholder="What's wrong? Our support team will step in with this context."
        className="w-full rounded-lg border border-error/30 bg-error/5 px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-error"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-error px-3 py-1.5 text-xs font-semibold text-paper-white"
        >
          {pending ? "Submitting…" : "Submit dispute"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className={`text-xs ${buttonSecondary}`}
        >
          Cancel
        </button>
      </div>
      {state.error && <p className="text-xs text-error">{state.error}</p>}
    </form>
  );
}
