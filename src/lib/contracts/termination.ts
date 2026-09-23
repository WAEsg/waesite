// Pure settlement-math functions for early termination — see spec section
// 7. Kept free of any DB/Stripe calls so the math is easy to unit-test and
// to reason about independently of how it gets persisted.

export type TerminationCause =
  | "talent_mia"
  | "talent_quit"
  | "client_no_cause"
  | "performance"
  | "mutual"
  | "other";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / MS_PER_DAY);
}

// Gig/project (milestone-tracker) contracts: whatever is approved or paid
// is earned regardless of cause; everything else on the contract is
// unearned and does not go to the talent.
export function computeMilestoneRelease(
  milestones: { amount: number; status: string }[]
) {
  const released = milestones
    .filter((m) => m.status === "approved" || m.status === "paid")
    .reduce((sum, m) => sum + m.amount, 0);
  const total = milestones.reduce((sum, m) => sum + m.amount, 0);
  return { released, unearned: Math.max(total - released, 0) };
}

// Retainer (ongoing) contracts: earned = completed days of the current
// 30-day period, released at the monthly_pay day-rate. No partial release
// at day 15 — this is purely the termination-time pro-ration, distinct
// from the day-15 check-in (which never touches payment).
export function computePeriodRelease(params: {
  monthlyPay: number;
  currentPeriodStart: Date;
  terminationDate: Date;
}) {
  const daysCompleted = Math.min(
    Math.max(daysBetween(params.currentPeriodStart, params.terminationDate), 0),
    30
  );
  const released = Math.round(((params.monthlyPay * daysCompleted) / 30) * 100) / 100;
  return { released, unearned: Math.max(params.monthlyPay - released, 0) };
}

export type SettlementOption = { type: "cash_refund" | "credit"; amount: number };

export type SettlementDecision =
  | { requiresClientChoice: false; settlementType: "cash_refund"; amount: number }
  | { requiresClientChoice: true; options: [SettlementOption, SettlementOption] };

// Who caused the termination decides how the unearned balance is settled.
// talent_mia/talent_quit/performance are all talent-caused (spec names
// talent_mia + performance explicitly; talent_quit is grouped in since
// it's the same "talent is the reason this ended early" bucket). "other"
// has no spec guidance, so it defaults to the same pro-rated cash refund
// as "mutual" — the conservative option that protects the client — and
// should get a human/admin look via the disputes flow if the cause is
// genuinely ambiguous.
export function computeUnearnedSettlement(
  cause: TerminationCause,
  unearnedAmount: number
): SettlementDecision {
  if (cause === "client_no_cause") {
    return {
      requiresClientChoice: true,
      options: [
        { type: "cash_refund", amount: unearnedAmount },
        { type: "credit", amount: Math.round(unearnedAmount * 1.1 * 100) / 100 },
      ],
    };
  }

  return { requiresClientChoice: false, settlementType: "cash_refund", amount: unearnedAmount };
}

// Placement fee is only refundable within 30 days of the ORIGINAL
// placement date, pro-rated by days remaining in that window — not the
// current billing period, which could be a later renewal.
export function computePlacementFeeRefund(params: {
  originalPlacementDate: Date;
  terminationDate: Date;
  placementFeeAmount: number;
}): number {
  const daysElapsed = daysBetween(params.originalPlacementDate, params.terminationDate);
  if (daysElapsed > 30 || daysElapsed < 0) return 0;

  const daysRemaining = 30 - daysElapsed;
  return Math.round(((params.placementFeeAmount * daysRemaining) / 30) * 100) / 100;
}
