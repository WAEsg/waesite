"use client";

import { useActionState, useState } from "react";
import { submitCheckin, acknowledgeCheckin, type ActionState } from "@/app/dashboard/_shared/contract-actions";
import { submitReview, type ReviewActionState } from "@/app/dashboard/_shared/review-actions";
import { MilestoneTracker, type MilestoneRow } from "./milestone-tracker";
import { TerminationFlow, type TerminationRow } from "./termination-flow";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { contractStatusLabel, contractStatusTone } from "@/lib/labels";
import { glassCardLight, glassPanelLight } from "@/components/ui/glass";
import { buttonPrimarySm } from "@/components/ui/button-classes";
import { Star } from "lucide-react";

const initial: ActionState = { error: null };
const reviewInitial: ReviewActionState = { error: null };

export type ContractRow = {
  id: string;
  hirer_id: string;
  talent_id: string;
  type: string;
  rate_amount: number;
  rate_type: string;
  monthly_pay: number | null;
  current_period_start: string | null;
  status: string;
};

export type CheckinRow = {
  id: string;
  day: number;
  talent_note: string;
  client_acknowledged: boolean;
  submitted_at: string;
};

export function ContractDetail({
  contract,
  counterpartName,
  role,
  milestones,
  checkins,
  termination,
  myReview,
}: {
  contract: ContractRow;
  counterpartName: string;
  role: "hirer" | "talent";
  milestones: MilestoneRow[];
  checkins: CheckinRow[];
  termination: TerminationRow | null;
  myReview: { score: number; comment: string | null } | null;
}) {
  const ratedComplete = contract.status === "completed" || contract.status === "terminated";
  const rateeId = role === "hirer" ? contract.talent_id : contract.hirer_id;
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-navy">{counterpartName}</h1>
          <p className="mt-1 text-xs text-ink-navy/70">
            {contract.type === "retainer" ? "Retainer" : "One-off"} · SGD {contract.rate_amount}
            {contract.rate_type === "hourly" ? "/hr" : contract.rate_type === "monthly" ? "/mo" : ""}
          </p>
        </div>
        <StatusBadge label={contractStatusLabel[contract.status]} tone={contractStatusTone[contract.status]} />
      </div>

      {contract.type === "one_off" ? (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-ink-navy">Milestone Tracker</h2>
          <MilestoneTracker contractId={contract.id} milestones={milestones} role={role} />
        </section>
      ) : (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-ink-navy">Day-15 check-in</h2>
          <CheckinPanel contractId={contract.id} checkins={checkins} role={role} />
        </section>
      )}

      {contract.status === "active" && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-ink-navy">Early termination</h2>
          <TerminationFlow contractId={contract.id} role={role} termination={termination} />
        </section>
      )}

      {contract.status === "terminated" && termination && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-ink-navy">Termination settlement</h2>
          <TerminationFlow contractId={contract.id} role={role} termination={termination} />
        </section>
      )}

      {ratedComplete && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-ink-navy">
            Rate {counterpartName}
          </h2>
          <ReviewPanel contractId={contract.id} rateeId={rateeId} myReview={myReview} />
        </section>
      )}
    </div>
  );
}

function ReviewPanel({
  contractId,
  rateeId,
  myReview,
}: {
  contractId: string;
  rateeId: string;
  myReview: { score: number; comment: string | null } | null;
}) {
  const [state, formAction, pending] = useActionState(submitReview, reviewInitial);
  const [hoverScore, setHoverScore] = useState(0);
  const [score, setScore] = useState(0);

  if (myReview) {
    return (
      <div className={`p-5 ${glassCardLight}`}>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`h-5 w-5 ${n <= myReview.score ? "fill-passport-sky text-passport-sky" : "text-ink-navy/20"}`}
            />
          ))}
        </div>
        {myReview.comment && <p className="mt-2 text-sm text-ink-navy/70">{myReview.comment}</p>}
        <p className="mt-2 text-xs text-ink-navy/50">You&apos;ve already submitted this review.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className={`space-y-3 p-5 ${glassPanelLight}`}>
      <input type="hidden" name="contract_id" value={contractId} />
      <input type="hidden" name="ratee_id" value={rateeId} />
      <input type="hidden" name="score" value={score} />
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setScore(n)}
            onMouseEnter={() => setHoverScore(n)}
            onMouseLeave={() => setHoverScore(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star
              className={`h-6 w-6 ${
                n <= (hoverScore || score) ? "fill-passport-sky text-passport-sky" : "text-ink-navy/20"
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        name="comment"
        rows={2}
        placeholder="Optional comment"
        className="w-full rounded-lg border border-ink-navy/15 bg-paper-white px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
      />
      <button type="submit" disabled={pending || score === 0} className={`text-sm ${buttonPrimarySm}`}>
        {pending ? "Submitting…" : "Submit review"}
      </button>
      {state.error && <p className="text-xs text-error">{state.error}</p>}
    </form>
  );
}

function CheckinPanel({
  contractId,
  checkins,
  role,
}: {
  contractId: string;
  checkins: CheckinRow[];
  role: "hirer" | "talent";
}) {
  const [state, formAction, pending] = useActionState(submitCheckin, initial);

  return (
    <div className="space-y-4">
      <p className={`p-4 text-sm text-ink-navy/70 ${glassPanelLight}`}>
        A quick, no-payment progress note at the day-15 mark — surfaces early warning
        signs without tying anything to a payout.
      </p>

      {checkins.length === 0 && (
        <p className="text-sm text-ink-navy/70">No check-in submitted yet.</p>
      )}

      {checkins.map((c) => (
        <div key={c.id} className={`p-5 ${glassCardLight}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-navy/70">Day {c.day}</p>
          <p className="mt-1 text-sm text-ink-navy/70">{c.talent_note}</p>
          <div className="mt-3 flex items-center gap-2">
            <StatusBadge
              label={c.client_acknowledged ? "Acknowledged" : "Awaiting acknowledgement"}
              tone={c.client_acknowledged ? "success" : "warning"}
            />
            {role === "hirer" && !c.client_acknowledged && (
              <form action={acknowledgeCheckin.bind(null, c.id, contractId)}>
                <button type="submit" className={`text-xs ${buttonPrimarySm}`}>
                  Acknowledge
                </button>
              </form>
            )}
          </div>
        </div>
      ))}

      {role === "talent" && (
        <form action={formAction} className={`space-y-2 p-5 ${glassPanelLight}`}>
          <input type="hidden" name="contract_id" value={contractId} />
          <label className="block text-sm font-semibold text-ink-navy">
            Submit a check-in note
            <textarea
              name="talent_note"
              required
              rows={3}
              className="mt-1 w-full rounded-lg border border-ink-navy/15 bg-paper-white px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
            />
          </label>
          <button type="submit" disabled={pending} className={`text-sm ${buttonPrimarySm}`}>
            {pending ? "Submitting…" : "Submit"}
          </button>
          {state.error && <p className="text-xs text-error">{state.error}</p>}
        </form>
      )}
    </div>
  );
}
