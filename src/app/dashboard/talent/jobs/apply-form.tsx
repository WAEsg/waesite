"use client";

import { useActionState, useState } from "react";
import { applyToGig, type ApplyActionState } from "./actions";
import { buttonPrimarySm, buttonSecondary } from "@/components/ui/button-classes";

const initial: ApplyActionState = { error: null };

export function ApplyForm({ gigId }: { gigId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(applyToGig, initial);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={`text-sm ${buttonPrimarySm}`}>
        Apply
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-3 space-y-2">
      <input type="hidden" name="gig_id" value={gigId} />
      <textarea
        name="cover_letter"
        rows={3}
        placeholder="Why you're a good fit (optional)"
        className="w-full rounded-lg border border-line bg-paper-white px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
      />
      <input
        name="proposed_rate"
        type="number"
        placeholder="Your proposed rate (optional)"
        className="w-full min-h-9 rounded-lg border border-line bg-paper-white px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
      />
      <div className="flex items-center gap-2">
        <button type="submit" disabled={pending} className={`text-sm ${buttonPrimarySm}`}>
          {pending ? "Applying…" : "Submit application"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className={`text-sm ${buttonSecondary}`}>
          Cancel
        </button>
      </div>
      {state.error && <p className="text-xs text-error">{state.error}</p>}
    </form>
  );
}
