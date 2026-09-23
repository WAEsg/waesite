"use client";

import { useActionState } from "react";
import {
  createMilestone,
  submitMilestone,
  reviewMilestone,
  type ActionState,
} from "@/app/dashboard/_shared/contract-actions";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { milestoneStatusLabel, milestoneStatusTone } from "@/lib/labels";
import { glassCardLight, glassPanelLight } from "@/components/ui/glass";
import { buttonPrimarySm, buttonSecondary } from "@/components/ui/button-classes";
import { DisputeButton } from "./dispute-button";

const initial: ActionState = { error: null };

export type MilestoneRow = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  status: string;
  sequence_order: number | null;
  submission_link: string | null;
  due_date: string | null;
};

export function MilestoneTracker({
  contractId,
  milestones,
  role,
}: {
  contractId: string;
  milestones: MilestoneRow[];
  role: "hirer" | "talent";
}) {
  const sorted = [...milestones].sort(
    (a, b) => (a.sequence_order ?? 0) - (b.sequence_order ?? 0)
  );

  return (
    <div className="space-y-4">
      {sorted.length === 0 && (
        <p className={`p-5 text-sm text-ink-navy/70 ${glassPanelLight}`}>
          No milestones set up yet{role === "hirer" ? " — add one below." : "."}
        </p>
      )}

      {sorted.map((milestone) => (
        <div key={milestone.id} className={`p-5 ${glassCardLight}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-navy/70">
                Milestone {milestone.sequence_order ?? "—"}
              </p>
              <p className="font-semibold text-ink-navy">{milestone.title}</p>
              {milestone.description && (
                <p className="mt-1 text-sm text-ink-navy/70">{milestone.description}</p>
              )}
              <p className="mt-1 text-sm text-passport-sky">SGD {milestone.amount}</p>
              {milestone.submission_link && (
                <a
                  href={milestone.submission_link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-xs text-passport-sky underline"
                >
                  View submission
                </a>
              )}
            </div>
            <StatusBadge
              label={milestoneStatusLabel[milestone.status]}
              tone={milestoneStatusTone[milestone.status]}
            />
          </div>

          {role === "talent" && milestone.status === "pending" && (
            <SubmitMilestoneForm milestoneId={milestone.id} />
          )}

          {role === "hirer" && milestone.status === "submitted" && (
            <ReviewMilestoneForm milestoneId={milestone.id} />
          )}

          {milestone.status !== "approved" && milestone.status !== "paid" && (
            <div className="mt-3">
              <DisputeButton contractId={contractId} milestoneId={milestone.id} />
            </div>
          )}
        </div>
      ))}

      {role === "hirer" && <CreateMilestoneForm contractId={contractId} />}
    </div>
  );
}

function SubmitMilestoneForm({ milestoneId }: { milestoneId: string }) {
  const [state, formAction, pending] = useActionState(submitMilestone, initial);
  return (
    <form action={formAction} className="mt-4 flex flex-wrap items-end gap-2">
      <input type="hidden" name="milestone_id" value={milestoneId} />
      <label className="flex-1 text-xs font-semibold text-ink-navy">
        Link to deliverable
        <input
          name="submission_link"
          required
          placeholder="https://…"
          className="mt-1 w-full min-h-9 rounded-lg border border-ink-navy/15 bg-paper-white px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
        />
      </label>
      <button type="submit" disabled={pending} className={`text-sm ${buttonPrimarySm}`}>
        {pending ? "Submitting…" : "Submit"}
      </button>
      {state.error && <p className="w-full text-xs text-error">{state.error}</p>}
    </form>
  );
}

function ReviewMilestoneForm({ milestoneId }: { milestoneId: string }) {
  const [state, formAction, pending] = useActionState(reviewMilestone, initial);
  return (
    <form action={formAction} className="mt-4 flex flex-wrap items-center gap-2">
      <input type="hidden" name="milestone_id" value={milestoneId} />
      <button
        type="submit"
        name="decision"
        value="approve"
        disabled={pending}
        className={`text-sm ${buttonPrimarySm}`}
      >
        Approve & release payment
      </button>
      <button
        type="submit"
        name="decision"
        value="dispute"
        disabled={pending}
        className={`text-sm ${buttonSecondary}`}
      >
        Dispute
      </button>
      {state.error && <p className="w-full text-xs text-error">{state.error}</p>}
    </form>
  );
}

function CreateMilestoneForm({ contractId }: { contractId: string }) {
  const [state, formAction, pending] = useActionState(createMilestone, initial);
  return (
    <form action={formAction} className={`space-y-3 p-5 ${glassPanelLight}`}>
      <input type="hidden" name="contract_id" value={contractId} />
      <p className="text-sm font-semibold text-ink-navy">Add a milestone</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="title"
          required
          placeholder="Title"
          className="min-h-9 rounded-lg border border-ink-navy/15 bg-paper-white px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
        />
        <input
          name="amount"
          type="number"
          required
          placeholder="Amount (SGD)"
          className="min-h-9 rounded-lg border border-ink-navy/15 bg-paper-white px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
        />
        <input
          name="sequence_order"
          type="number"
          required
          placeholder="Order (1, 2, 3…)"
          className="min-h-9 rounded-lg border border-ink-navy/15 bg-paper-white px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
        />
        <input
          name="due_date"
          type="date"
          className="min-h-9 rounded-lg border border-ink-navy/15 bg-paper-white px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
        />
      </div>
      <textarea
        name="description"
        placeholder="Description (optional)"
        rows={2}
        className="w-full rounded-lg border border-ink-navy/15 bg-paper-white px-3 py-1.5 text-sm text-ink-navy outline-none focus:border-voyage-blue"
      />
      <button type="submit" disabled={pending} className={`text-sm ${buttonSecondary}`}>
        {pending ? "Adding…" : "Add milestone"}
      </button>
      {state.error && <p className="text-xs text-error">{state.error}</p>}
    </form>
  );
}
