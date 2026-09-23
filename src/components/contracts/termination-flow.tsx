"use client";

import { useActionState, useState } from "react";
import {
  initiateTermination,
  settleTermination,
  type ActionState,
} from "@/app/dashboard/_shared/contract-actions";
import { glassCardLight } from "@/components/ui/glass";
import { buttonPrimarySm, buttonSecondary } from "@/components/ui/button-classes";
import { StatusBadge } from "@/components/dashboard/status-badge";

const initial: ActionState = { error: null };

export type TerminationRow = {
  id: string;
  cause: string;
  settlement_type: string | null;
  released_amount: number | null;
  unearned_amount: number | null;
  placement_fee_refund_amount: number | null;
  status: string;
};

const causeLabels: Record<string, string> = {
  talent_mia: "Talent went unresponsive (MIA)",
  talent_quit: "Talent quit",
  client_no_cause: "Ending without cause",
  performance: "Performance issue",
  mutual: "Mutual agreement",
  other: "Other",
};

export function TerminationFlow({
  contractId,
  role,
  termination,
}: {
  contractId: string;
  role: "hirer" | "talent";
  termination: TerminationRow | null;
}) {
  if (termination?.status === "pending_settlement") {
    return (
      <SettlementChoiceScreen
        termination={termination}
        canChoose={role === "hirer"}
      />
    );
  }

  if (termination) {
    return (
      <div className={`space-y-2 p-5 ${glassCardLight}`}>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-ink-navy">Contract terminated</p>
          <StatusBadge label="Settled" tone="neutral" />
        </div>
        <p className="text-sm text-ink-navy/70">Reason: {causeLabels[termination.cause]}</p>
        <p className="text-sm text-ink-navy/70">
          Released to talent: SGD {termination.released_amount ?? 0}
        </p>
        {(termination.unearned_amount ?? 0) > 0 && (
          <p className="text-sm text-ink-navy/70">
            Unearned balance settled as{" "}
            {termination.settlement_type === "credit" ? "platform credit" : "cash refund"}.
          </p>
        )}
        {(termination.placement_fee_refund_amount ?? 0) > 0 && (
          <p className="text-sm text-ink-navy/70">
            Placement fee refunded: SGD {termination.placement_fee_refund_amount}
          </p>
        )}
      </div>
    );
  }

  return <InitiateTerminationForm contractId={contractId} />;
}

function InitiateTerminationForm({ contractId }: { contractId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(initiateTermination, initial);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={`text-sm ${buttonSecondary}`}>
        Terminate contract
      </button>
    );
  }

  return (
    <form action={formAction} className={`space-y-3 p-5 ${glassCardLight}`}>
      <input type="hidden" name="contract_id" value={contractId} />
      <p className="font-semibold text-ink-navy">End this contract early</p>
      <p className="text-sm text-ink-navy/70">
        Whatever&apos;s already been approved or completed still goes to the talent.
        The rest is settled based on why this ended.
      </p>
      <label className="block text-sm font-semibold text-ink-navy">
        Reason
        <select
          name="cause"
          required
          className="mt-1 w-full min-h-10 rounded-lg border border-ink-navy/15 bg-paper-white px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
        >
          {Object.entries(causeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <textarea
        name="notes"
        rows={2}
        placeholder="Additional notes (optional)"
        className="w-full rounded-lg border border-ink-navy/15 bg-paper-white px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
      />
      <div className="flex items-center gap-2">
        <button type="submit" disabled={pending} className={`text-sm ${buttonPrimarySm}`}>
          {pending ? "Processing…" : "Confirm termination"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className={`text-sm ${buttonSecondary}`}>
          Cancel
        </button>
      </div>
      {state.error && <p className="text-xs text-error">{state.error}</p>}
    </form>
  );
}

function SettlementChoiceScreen({
  termination,
  canChoose,
}: {
  termination: TerminationRow;
  canChoose: boolean;
}) {
  const [state, formAction, pending] = useActionState(settleTermination, initial);
  const unearned = termination.unearned_amount ?? 0;
  const creditAmount = Math.round(unearned * 1.1 * 100) / 100;

  return (
    <div className={`space-y-4 p-6 ${glassCardLight}`}>
      <div>
        <p className="font-display text-lg font-semibold text-ink-navy">
          Choose how you&apos;d like the remaining balance settled
        </p>
        <p className="mt-1 text-sm text-ink-navy/70">
          This contract ended without cause. SGD {unearned.toFixed(2)} was never delivered
          — pick how you want it back.
        </p>
      </div>

      {canChoose ? (
        <form action={formAction} className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="termination_id" value={termination.id} />
          <button
            type="submit"
            name="settlement_type"
            value="cash_refund"
            disabled={pending}
            className={`p-5 text-left ${buttonSecondary}`}
          >
            <span className="block font-display text-base font-semibold text-ink-navy">
              100% cash refund
            </span>
            <span className="mt-1 block text-sm text-ink-navy/70">SGD {unearned.toFixed(2)} back to you.</span>
          </button>
          <button
            type="submit"
            name="settlement_type"
            value="credit"
            disabled={pending}
            className={`p-5 text-left ${buttonPrimarySm}`}
          >
            <span className="block font-display text-base font-semibold text-paper-white">
              110% platform credit
            </span>
            <span className="mt-1 block text-sm text-paper-white/90">
              SGD {creditAmount.toFixed(2)} toward your next hire.
            </span>
          </button>
          {state.error && <p className="text-xs text-error sm:col-span-2">{state.error}</p>}
        </form>
      ) : (
        <p className="text-sm text-ink-navy/70">Waiting on the client to choose a settlement option.</p>
      )}
    </div>
  );
}
