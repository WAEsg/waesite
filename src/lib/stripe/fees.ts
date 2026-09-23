// Canonical fee schedule for Stripe Connect charges — mirrors the numbers
// on the public Pricing page (src/lib/landing-data.ts's pricingGigFee /
// pricingTiers / pricingPlacementFee). Kept as plain numbers here (not
// imported from the marketing copy) since this is the billing-critical
// source of truth; the marketing strings are the ones that must stay in
// sync with these, not the other way round.
//
// Every function returns a breakdown, not just a single number, because
// every Stripe Connect charge this app makes needs BOTH the platform's
// cut (application_fee_amount) and the connected account's payout
// (transfer amount) computed together, at charge-creation time — that's
// the whole point of using application_fee_amount instead of computing
// a fee after the fact.

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export type FeeBreakdown = {
  /** What the talent's work/deliverable is actually worth. */
  baseAmount: number;
  /** The client's share of the platform fee, added on top of baseAmount. */
  clientFeeShare: number;
  /** The talent's share of the platform fee, deducted from baseAmount. */
  talentFeeShare: number;
  /** Total charged to the client's payment method: baseAmount + clientFeeShare. */
  totalCharge: number;
  /** Stripe's application_fee_amount: clientFeeShare + talentFeeShare. */
  applicationFeeAmount: number;
  /** What actually routes to the talent's connected account: baseAmount - talentFeeShare. */
  talentReceives: number;
};

function buildBreakdown(baseAmount: number, clientFeeShare: number, talentFeeShare: number): FeeBreakdown {
  clientFeeShare = round2(clientFeeShare);
  talentFeeShare = round2(talentFeeShare);
  return {
    baseAmount,
    clientFeeShare,
    talentFeeShare,
    totalCharge: round2(baseAmount + clientFeeShare),
    applicationFeeAmount: round2(clientFeeShare + talentFeeShare),
    talentReceives: round2(baseAmount - talentFeeShare),
  };
}

// Project/gig contracts: flat 15% of project value, 10% client / 5% talent,
// taken from each milestone release. No separate placement fee.
export const GIG_CLIENT_RATE = 0.1;
export const GIG_TALENT_RATE = 0.05;

export function computeGigMilestoneFee(milestoneAmount: number): FeeBreakdown {
  return buildBreakdown(
    milestoneAmount,
    milestoneAmount * GIG_CLIENT_RATE,
    milestoneAmount * GIG_TALENT_RATE
  );
}

// Ongoing/retainer contracts: tapered platform fee by contract month,
// split client/talent, with a combined-fee floor.
export const RETAINER_TIERS = [
  { minMonth: 2, maxMonth: 6, clientRate: 0.08, talentRate: 0.04 },
  { minMonth: 7, maxMonth: 12, clientRate: 0.055, talentRate: 0.025 },
  { minMonth: 13, maxMonth: Infinity, clientRate: 0.04, talentRate: 0.02 },
] as const;

export const RETAINER_FEE_FLOOR_COMBINED = 45; // S$45/month combined, whichever is greater

// Month 1 has no ongoing platform fee — it's covered by the placement fee.
export function computeRetainerPeriodFee(periodAmount: number, contractMonthNumber: number): FeeBreakdown {
  if (contractMonthNumber < 2 || periodAmount <= 0) {
    return buildBreakdown(periodAmount, 0, 0);
  }

  const tier =
    RETAINER_TIERS.find((t) => contractMonthNumber >= t.minMonth && contractMonthNumber <= t.maxMonth) ??
    RETAINER_TIERS[RETAINER_TIERS.length - 1];

  let clientFeeShare = periodAmount * tier.clientRate;
  const talentFeeShare = periodAmount * tier.talentRate;

  // Floor applies to the combined fee. When a period is short (e.g. an
  // early termination pro-ration) the percentage-based fee can fall below
  // the floor — bump the client's share to cover the gap rather than
  // reducing what the talent is paid.
  if (round2(clientFeeShare + talentFeeShare) < RETAINER_FEE_FLOOR_COMBINED) {
    clientFeeShare = RETAINER_FEE_FLOOR_COMBINED - talentFeeShare;
  }

  return buildBreakdown(periodAmount, clientFeeShare, talentFeeShare);
}

// Ongoing/retainer contracts only: one-time placement fee equal to one
// month's pay, charged entirely to the client. Talent pays nothing and
// receives nothing from this charge — it's pure platform revenue, so
// there's no Connect destination/transfer involved at all.
export function computePlacementFee(monthlyPay: number): FeeBreakdown {
  return {
    baseAmount: 0,
    clientFeeShare: monthlyPay,
    talentFeeShare: 0,
    totalCharge: monthlyPay,
    applicationFeeAmount: monthlyPay,
    talentReceives: 0,
  };
}

// How many months into the contract a given date falls — used to pick the
// right retainer fee tier. Month 1 = the first ~30 days from the original
// placement date.
export function contractMonthNumber(originalPlacementDate: Date, asOf: Date): number {
  const days = Math.floor((asOf.getTime() - originalPlacementDate.getTime()) / (24 * 60 * 60 * 1000));
  return Math.max(1, Math.floor(days / 30) + 1);
}
