"use client";

import { useActionState, useEffect, useState } from "react";
import {
  proposeInterviewSlots,
  confirmInterviewSlot,
  recordCallJoin,
  markInterviewComplete,
  recordHirerDecision,
  type InterviewActionState,
} from "@/app/dashboard/_shared/interview-actions";
import { glassCardLight } from "@/components/ui/glass";
import { buttonPrimary, buttonSecondary } from "@/components/ui/button-classes";
import { FormError } from "@/components/ui/form-field";

type InterviewRow = {
  id: string;
  status: "awaiting_talent" | "awaiting_hirer" | "confirmed" | "completed" | "cancelled";
  proposed_by: "hirer" | "talent";
  proposed_slots: string[];
  confirmed_slot: string | null;
  video_room_url: string | null;
  hirer_decision: "confirm" | "decline" | null;
};

const initialState: InterviewActionState = { error: null };
const DECISION_REASONS = [
  { value: "fit", label: "Not the right fit" },
  { value: "availability", label: "Availability didn't line up" },
  { value: "communication", label: "Communication concerns" },
  { value: "changed_requirements", label: "Requirements changed" },
  { value: "other", label: "Other" },
];

function fmt(iso: string): string {
  return new Date(iso).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" });
}

function ProposeSlotsForm({ applicationId }: { applicationId: string }) {
  const [state, formAction, pending] = useActionState(proposeInterviewSlots, initialState);
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="application_id" value={applicationId} />
      <p className="text-sm font-semibold text-ink-navy">Propose 2–3 times (your local time)</p>
      {[0, 1, 2].map((i) => (
        <input
          key={i}
          type="datetime-local"
          name="slot"
          required={i < 2}
          className="w-full rounded-xl border border-line bg-paper-white px-4 py-2.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
        />
      ))}
      <FormError message={state.error} />
      <button type="submit" disabled={pending} className={`${buttonPrimary} w-full disabled:opacity-60`}>
        {pending ? "Sending…" : "Send times"}
      </button>
    </form>
  );
}

function SlotChoiceForm({ applicationId, slots }: { applicationId: string; slots: string[] }) {
  const [state, formAction, pending] = useActionState(confirmInterviewSlot, initialState);
  const [showAlternatives, setShowAlternatives] = useState(false);

  if (showAlternatives) return <ProposeSlotsForm applicationId={applicationId} />;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-ink-navy">Pick a time that works</p>
      {slots.map((slot) => (
        <form key={slot} action={formAction}>
          <input type="hidden" name="application_id" value={applicationId} />
          <input type="hidden" name="slot" value={slot} />
          <button
            type="submit"
            disabled={pending}
            className={`w-full rounded-xl border border-line px-4 py-2.5 text-left text-sm text-ink-navy transition hover:border-voyage-blue disabled:opacity-60`}
          >
            {fmt(slot)}
          </button>
        </form>
      ))}
      <FormError message={state.error} />
      <button
        type="button"
        onClick={() => setShowAlternatives(true)}
        className="text-xs font-semibold text-voyage-blue hover:text-ink-navy"
      >
        None of these work — propose other times
      </button>
    </div>
  );
}

function CallScreen({ applicationId, roomUrl, isHirer }: { applicationId: string; roomUrl: string | null; isHirer: boolean }) {
  const [completeState, completeAction, completePending] = useActionState(markInterviewComplete, initialState);

  useEffect(() => {
    void recordCallJoin(applicationId);
  }, [applicationId]);

  return (
    <div className="space-y-4">
      {roomUrl ? (
        <iframe
          src={roomUrl}
          allow="camera; microphone; fullscreen; display-capture"
          className="h-[420px] w-full rounded-xl border border-line"
        />
      ) : (
        <div className={`p-6 text-center ${glassCardLight}`}>
          <p className="font-semibold text-ink-navy">Video calling isn&apos;t configured yet</p>
          <p className="mt-1 text-sm text-slate">
            Coordinate the call yourselves for now, then mark it complete here when you&apos;re done.
          </p>
        </div>
      )}
      <p className="text-xs text-slate">
        ~15–20 minutes, focused on fit and working style.
      </p>
      {isHirer && (
        <form action={completeAction}>
          <input type="hidden" name="application_id" value={applicationId} />
          <FormError message={completeState.error} />
          <button type="submit" disabled={completePending} className={`${buttonSecondary} mt-2`}>
            {completePending ? "Marking…" : "Mark call complete"}
          </button>
        </form>
      )}
    </div>
  );
}

function DecisionForm({ applicationId }: { applicationId: string }) {
  const [state, formAction, pending] = useActionState(recordHirerDecision, initialState);
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="application_id" value={applicationId} />
      <p className="text-sm font-semibold text-ink-navy">How did it go?</p>
      <div className="flex gap-2">
        <button
          type="submit"
          name="decision"
          value="confirm"
          disabled={pending}
          className={`${buttonPrimary} disabled:opacity-60`}
        >
          Confirm
        </button>
        <select
          name="reason"
          defaultValue=""
          className="rounded-xl border border-line bg-paper-white px-3 py-2 text-sm text-ink-navy"
        >
          <option value="">Reason (for a decline)</option>
          {DECISION_REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          name="decision"
          value="decline"
          disabled={pending}
          className={`${buttonSecondary} disabled:opacity-60`}
        >
          Decline
        </button>
      </div>
      <textarea
        name="notes"
        placeholder="Notes (optional)"
        rows={2}
        className="w-full rounded-xl border border-line bg-paper-white px-4 py-2.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
      />
      <FormError message={state.error} />
    </form>
  );
}

export function InterviewScheduler({
  applicationId,
  role,
  interview,
}: {
  applicationId: string;
  role: "hirer" | "talent";
  interview: InterviewRow | null;
}) {
  const isHirer = role === "hirer";

  if (!interview) {
    return isHirer ? (
      <ProposeSlotsForm applicationId={applicationId} />
    ) : (
      <p className="text-sm text-slate">Waiting for the hirer to propose interview times.</p>
    );
  }

  if (interview.status === "awaiting_talent" || interview.status === "awaiting_hirer") {
    const myTurn = (interview.status === "awaiting_talent" && !isHirer) || (interview.status === "awaiting_hirer" && isHirer);
    return myTurn ? (
      <SlotChoiceForm applicationId={applicationId} slots={interview.proposed_slots} />
    ) : (
      <p className="text-sm text-slate">
        Waiting for {isHirer ? "the talent partner" : "the hirer"} to respond to the proposed times.
      </p>
    );
  }

  if (interview.status === "confirmed") {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink-navy">Confirmed for {interview.confirmed_slot && fmt(interview.confirmed_slot)}</p>
        <CallScreen applicationId={applicationId} roomUrl={interview.video_room_url} isHirer={isHirer} />
      </div>
    );
  }

  if (interview.status === "completed") {
    if (interview.hirer_decision) {
      return (
        <p className="text-sm text-slate">
          {interview.hirer_decision === "confirm"
            ? isHirer
              ? "You confirmed this candidate — head back to Applicants to match & create the contract."
              : "Good news — the hirer wants to move forward."
            : isHirer
              ? "You declined to move forward with this candidate."
              : "The hirer has decided not to move forward this time."}
        </p>
      );
    }
    return isHirer ? (
      <DecisionForm applicationId={applicationId} />
    ) : (
      <p className="text-sm text-slate">Interview complete — waiting on the hirer&apos;s decision.</p>
    );
  }

  return null;
}
