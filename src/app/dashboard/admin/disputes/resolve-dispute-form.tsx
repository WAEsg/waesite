"use client";

import { useActionState } from "react";
import { resolveDispute, type AdminActionState } from "../actions";
import { buttonPrimarySm } from "@/components/ui/button-classes";

const initial: AdminActionState = { error: null };

const resolutionOptions: { value: string; label: string }[] = [
  { value: "release_escrow", label: "Release escrow to talent" },
  { value: "refund", label: "Refund to client" },
  { value: "credit", label: "Issue platform credit" },
  { value: "activate_bench", label: "Activate backup bench" },
];

export function ResolveDisputeForm({
  disputeId,
  defaultAmount,
}: {
  disputeId: string;
  defaultAmount: number | null;
}) {
  const [state, formAction, pending] = useActionState(resolveDispute, initial);

  return (
    <form action={formAction} className="mt-4 space-y-3 border-t border-line pt-4">
      <input type="hidden" name="dispute_id" value={disputeId} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
            Resolution
          </span>
          <select
            name="resolution"
            required
            defaultValue="release_escrow"
            className="mt-1 w-full rounded-xl border border-line bg-paper-white px-3 py-2 text-sm text-ink-navy outline-none focus:border-voyage-blue"
          >
            {resolutionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
            Amount (SGD)
          </span>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0"
            defaultValue={defaultAmount ?? undefined}
            className="mt-1 w-full rounded-xl border border-line bg-paper-white px-3 py-2 text-sm text-ink-navy outline-none focus:border-voyage-blue"
          />
        </label>
      </div>

      <label className="block">
        <span className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
          Reason / notes
        </span>
        <textarea
          name="reason"
          rows={2}
          required
          placeholder="Explain the resolution decision for the audit log…"
          className="mt-1 w-full rounded-xl border border-line bg-paper-white px-3 py-2 text-sm text-ink-navy outline-none focus:border-voyage-blue"
        />
      </label>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={`text-sm ${buttonPrimarySm}`}>
          {pending ? "Resolving…" : "Resolve dispute"}
        </button>
        {state.error && <p className="text-xs text-error">{state.error}</p>}
      </div>
    </form>
  );
}
