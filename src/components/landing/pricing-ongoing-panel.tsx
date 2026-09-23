"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Briefcase, Check, Minus, Plus, Users, Wallet } from "lucide-react";
import { computeRetainerPeriodFee, RETAINER_FEE_FLOOR_COMBINED, RETAINER_TIERS } from "@/lib/stripe/fees";
import { useRolePreference } from "@/lib/use-role-preference";
import { Reveal } from "@/components/ui/reveal";

function fmt(n: number): string {
  return `S$${Math.round(n).toLocaleString("en-SG")}`;
}

type TierKey = "m1" | "t1" | "t2" | "t3";

function tierFor(month: number): TierKey {
  if (month === 1) return "m1";
  if (month <= 6) return "t1";
  if (month <= 12) return "t2";
  return "t3";
}

const TIER_META: Record<Exclude<TierKey, "m1">, { when: string; client: number; talent: number }> = {
  t1: { when: "Months 2–6", client: RETAINER_TIERS[0].clientRate, talent: RETAINER_TIERS[0].talentRate },
  t2: { when: "Months 7–12", client: RETAINER_TIERS[1].clientRate, talent: RETAINER_TIERS[1].talentRate },
  t3: { when: "Month 13+", client: RETAINER_TIERS[2].clientRate, talent: RETAINER_TIERS[2].talentRate },
};

function Stepper({ onStep }: { onStep: (dir: 1 | -1) => void }) {
  return (
    <span className="flex shrink-0 gap-2">
      {([-1, 1] as const).map((dir) => (
        <button
          key={dir}
          type="button"
          onClick={() => onStep(dir)}
          aria-label={dir === -1 ? "Decrease" : "Increase"}
          className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-line bg-white text-ink-navy transition hover:border-passport-sky hover:text-voyage-blue"
        >
          {dir === -1 ? <Minus className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
        </button>
      ))}
    </span>
  );
}

export function PricingOngoingPanel() {
  const [pay, setPay] = useState(2000);
  const [month, setMonth] = useState(3);
  const [role, setRole] = useRolePreference();

  const tier = tierFor(month);
  const breakdown = useMemo(() => computeRetainerPeriodFee(pay, month), [pay, month]);
  const rawCombined = tier === "m1" ? 0 : pay * (TIER_META[tier].client + TIER_META[tier].talent);
  const isFloor = tier !== "m1" && rawCombined < RETAINER_FEE_FLOOR_COMBINED;
  const state: "normal" | "month1" | "floor" = tier === "m1" ? "month1" : isFloor ? "floor" : "normal";

  const clientPct = tier === "m1" ? 0 : Math.round(TIER_META[tier].client * 1000) / 10;
  const talentPct = tier === "m1" ? 0 : Math.round(TIER_META[tier].talent * 1000) / 10;
  const totalPct = clientPct + talentPct;
  const clientShareOfFee = breakdown.applicationFeeAmount > 0 ? (breakdown.clientFeeShare / breakdown.applicationFeeAmount) * 100 : 66.7;
  const talentShareOfFee = 100 - clientShareOfFee;

  const clientHighlight = role === "hirer";
  const talentHighlight = role === "talent";

  return (
    <div className="flex flex-col gap-14">
      <div id="pricing-calc" className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        {/* Controls */}
        <div className="flex flex-col gap-7">
          <div>
            <h3 className="font-display text-2xl font-bold text-ink-navy">Ongoing Team Extension calculator</h3>
            <p className="mt-1.5 max-w-md text-slate">Set the pay and the month. The breakdown updates as you move.</p>
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="pricing-pay" className="font-extrabold text-ink-navy">
              Monthly pay you agree with your Talent Partner
            </label>
            <div className="flex items-end justify-between gap-3">
              <span className="flex flex-col gap-1.5">
                <span className="font-display text-[clamp(2.1rem,2.6vw+1.1rem,3rem)] leading-none font-extrabold tracking-[-0.035em] text-ink-navy tabular-nums">
                  {fmt(pay)}
                </span>
                <small className="font-bold text-slate">a month</small>
              </span>
              <Stepper onStep={(dir) => setPay((p) => Math.min(8000, Math.max(500, p + dir * 100)))} />
            </div>
            <input
              id="pricing-pay"
              type="range"
              min={500}
              max={8000}
              step={100}
              value={pay}
              onChange={(e) => setPay(Number(e.target.value))}
              className="my-1.5 w-full accent-voyage-blue"
            />
            <div className="flex justify-between font-bold text-slate">
              <span>S$500</span>
              <span>S$8,000</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-line pt-7">
            <label htmlFor="pricing-month" className="font-extrabold text-ink-navy">
              Month of the engagement
            </label>
            <div className="flex items-end justify-between gap-3">
              <span className="flex flex-col gap-1.5">
                <span className="font-display text-[clamp(2.1rem,2.6vw+1.1rem,3rem)] leading-none font-extrabold tracking-[-0.035em] text-ink-navy tabular-nums">
                  Month {month}
                </span>
                <small className="font-bold text-slate">
                  {tier === "m1" ? "Month 1 · placement fee only" : `${TIER_META[tier].when} · ${totalPct}% total`}
                </small>
              </span>
              <Stepper onStep={(dir) => setMonth((m) => Math.min(18, Math.max(1, m + dir)))} />
            </div>
            <input
              id="pricing-month"
              type="range"
              min={1}
              max={18}
              step={1}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="my-1.5 w-full accent-voyage-blue"
            />
            <div className="flex justify-between font-bold text-slate">
              <span>1</span>
              <span>2–6 · 12%</span>
              <span>7–12 · 8%</span>
              <span>13+ · 6%</span>
            </div>
          </div>
        </div>

        {/* Receipt */}
        <Reveal variant="scale" delayMs={100}>
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-2">
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line px-6 py-4">
              <span className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.1em] text-ink-navy uppercase">
                Month {String(month).padStart(2, "0")}
                <i className="inline-block h-0 w-[22px] border-t-2 border-dotted border-passport-sky" aria-hidden />
                {tier === "m1" ? "Placement" : `${TIER_META[tier].when} rate`}
              </span>
              <span className="rounded-full bg-cloud-blue px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.06em] text-voyage-blue">
                {tier === "m1" ? "Placement fee" : `${totalPct}% total fee`}
              </span>
            </div>

            <div className="flex flex-col gap-4.5 p-6">
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`flex flex-col gap-1.5 rounded-xl border p-4 ${
                    clientHighlight ? "border-voyage-blue bg-voyage-blue shadow-2" : "border-line bg-frost"
                  }`}
                >
                  <span className={`font-mono text-[0.6875rem] font-bold tracking-[0.1em] uppercase ${clientHighlight ? "text-cloud-blue" : "text-slate"}`}>
                    {role === "hirer" ? "You pay in total" : "Client pays in total"}
                  </span>
                  <span className={`font-display text-[clamp(1.6rem,1.6vw+1.1rem,2.2rem)] leading-[1.05] font-extrabold tracking-[-0.03em] ${clientHighlight ? "text-white" : "text-ink-navy"}`}>
                    {state === "month1" ? fmt(pay) : fmt(breakdown.totalCharge)}
                  </span>
                  <span className={`text-[0.8125rem] leading-[1.4] ${clientHighlight ? "text-cloud-blue" : "text-slate"}`}>
                    {state === "month1"
                      ? "One-time placement fee"
                      : `${fmt(pay)} pay + ${fmt(breakdown.clientFeeShare)} fee`}
                  </span>
                </div>
                <div
                  className={`flex flex-col gap-1.5 rounded-xl border p-4 ${
                    talentHighlight ? "border-voyage-blue bg-voyage-blue shadow-2" : "border-line bg-frost"
                  }`}
                >
                  <span className={`font-mono text-[0.6875rem] font-bold tracking-[0.1em] uppercase ${talentHighlight ? "text-cloud-blue" : "text-slate"}`}>
                    {role === "talent" ? "You take home" : "Talent takes home"}
                  </span>
                  <span className={`font-display text-[clamp(1.6rem,1.6vw+1.1rem,2.2rem)] leading-[1.05] font-extrabold tracking-[-0.03em] ${talentHighlight ? "text-white" : "text-ink-navy"}`}>
                    {state === "month1" ? fmt(pay) : fmt(breakdown.talentReceives)}
                  </span>
                  <span className={`text-[0.8125rem] leading-[1.4] ${talentHighlight ? "text-cloud-blue" : "text-slate"}`}>
                    {state === "month1" ? "Talent pays nothing" : `${fmt(pay)} pay − ${fmt(breakdown.talentFeeShare)} fee`}
                  </span>
                </div>
              </div>

              <dl className="flex flex-col">
                <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                  <dt className="text-slate">Monthly pay</dt>
                  <dd className="font-extrabold text-ink-navy tabular-nums">{fmt(pay)}</dd>
                </div>
                {state === "month1" ? (
                  <>
                    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                      <dt className="flex items-center gap-2 text-ink-navy">
                        One-time placement fee
                        <span className="rounded-md bg-cloud-blue px-[7px] py-1 font-mono text-xs text-voyage-blue">client only</span>
                      </dt>
                      <dd className="font-extrabold text-ink-navy tabular-nums">{fmt(pay)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                      <dt className="text-slate">Ongoing platform fee</dt>
                      <dd className="font-bold text-ink-navy">None in month 1</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-slate">Talent pays</dt>
                      <dd className="font-extrabold text-ink-navy tabular-nums">S$0</dd>
                    </div>
                  </>
                ) : state === "floor" ? (
                  <>
                    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                      <dt className="text-slate">Tier percentage ({totalPct}%) would be</dt>
                      <dd className="font-extrabold text-ink-navy tabular-nums">{fmt(rawCombined)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 text-alert">
                      <dt className="font-extrabold">Platform fee, combined minimum</dt>
                      <dd className="font-extrabold tabular-nums">S${RETAINER_FEE_FLOOR_COMBINED}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="pl-4.5 text-slate">Client and talent split</dt>
                      <dd className="font-bold text-ink-navy">To be confirmed</dd>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                      <dt className="text-slate">
                        Platform fee, total{" "}
                        <span className="rounded-md bg-cloud-blue px-[7px] py-1 font-mono text-xs text-voyage-blue">{totalPct}%</span>
                      </dt>
                      <dd className="font-extrabold text-ink-navy tabular-nums">{fmt(breakdown.applicationFeeAmount)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 pl-4.5">
                      <dt className={`flex items-center gap-2 ${clientHighlight ? "font-extrabold text-ink-navy" : "text-slate"}`}>
                        Client share{" "}
                        <span className="rounded-md bg-cloud-blue px-[7px] py-1 font-mono text-xs text-voyage-blue">{clientPct}%</span>
                        {clientHighlight && <span className="rounded-md bg-cloud-blue px-[7px] py-1 font-mono text-xs text-voyage-blue">You</span>}
                      </dt>
                      <dd className={`tabular-nums ${clientHighlight ? "font-extrabold text-ink-navy" : "font-bold text-slate"}`}>
                        {fmt(breakdown.clientFeeShare)}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-2.5 pl-4.5">
                      <dt className={`flex items-center gap-2 ${talentHighlight ? "font-extrabold text-ink-navy" : "text-slate"}`}>
                        Talent share{" "}
                        <span className="rounded-md bg-cloud-blue px-[7px] py-1 font-mono text-xs text-voyage-blue">{talentPct}%</span>
                        {talentHighlight && <span className="rounded-md bg-cloud-blue px-[7px] py-1 font-mono text-xs text-voyage-blue">You</span>}
                      </dt>
                      <dd className={`tabular-nums ${talentHighlight ? "font-extrabold text-ink-navy" : "font-bold text-slate"}`}>
                        {fmt(breakdown.talentFeeShare)}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>

            <div className="mx-6 border-t-2 border-dashed border-mist" aria-hidden />

            <div className="flex flex-col gap-4 p-6">
              {state === "normal" && (
                <div className="flex flex-col gap-2">
                  <div className="flex h-3 overflow-hidden rounded-full bg-line" aria-hidden>
                    <span className="bg-voyage-blue" style={{ width: `${clientShareOfFee}%` }} />
                    <span className="bg-passport-sky" style={{ width: `${talentShareOfFee}%` }} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate">
                    <span className="flex items-center gap-1.5">
                      <i className="inline-block h-2.5 w-2.5 rounded-full bg-voyage-blue" aria-hidden />
                      Client {clientPct}%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="inline-block h-2.5 w-2.5 rounded-full bg-passport-sky" aria-hidden />
                      Talent {talentPct}%
                    </span>
                  </div>
                </div>
              )}

              {state === "month1" && (
                <p className="flex items-start gap-2.5 rounded-lg bg-frost p-3.5 text-slate">
                  <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-voyage-blue" aria-hidden />
                  <span>
                    <strong className="text-ink-navy">Month 1 has no ongoing platform fee.</strong> The one-time
                    placement fee is one month&apos;s pay, charged to the client only on a successful match. Talent
                    pays nothing.
                  </span>
                </p>
              )}
              {state === "floor" && (
                <p className="flex items-start gap-2.5 rounded-lg bg-alert-bg p-3.5 text-ink-navy shadow-[inset_0_0_0_1px_#F5C56B]">
                  <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-alert" aria-hidden />
                  <span>
                    <strong>Combined minimum of S$45/month applies.</strong> The percentage fee would be lower than
                    S$45, so the minimum is charged instead. It is one combined figure. We haven&apos;t set how
                    it&apos;s split yet.
                  </span>
                </p>
              )}
              {month > 12 && state !== "month1" && (
                <p className="flex items-start gap-2.5 rounded-lg bg-success-bg p-3.5 text-ink-navy">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                  <span>
                    <strong>Buy-out option available</strong> — go fully direct, no ongoing platform fee.{" "}
                    <Link href="/contact?topic=hiring" className="font-extrabold text-voyage-blue">
                      Ask us about a buy-out
                    </Link>
                  </span>
                </p>
              )}

              <div className="flex flex-col gap-2.5">
                {role !== "talent" && (
                  <Link
                    href="/signup?role=hirer"
                    onClick={() => setRole("hirer")}
                    className="flex min-h-12 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-voyage-blue bg-voyage-blue px-[22px] py-3 text-center font-extrabold text-white shadow-[0_6px_18px_rgba(30,79,163,0.26)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    Post a role
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                )}
                {role === null && (
                  <Link
                    href="/signup?role=talent"
                    onClick={() => setRole("talent")}
                    className="flex min-h-12 items-center justify-center rounded-full border-[1.5px] border-mist bg-white px-[22px] py-3 text-center font-extrabold text-ink-navy transition hover:border-passport-sky"
                  >
                    Become a Talent Partner
                  </Link>
                )}
                {role === "talent" && (
                  <Link
                    href="/signup?role=talent"
                    onClick={() => setRole("talent")}
                    className="flex min-h-12 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-voyage-blue bg-voyage-blue px-[22px] py-3 text-center font-extrabold text-white shadow-[0_6px_18px_rgba(30,79,163,0.26)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    Become a Talent Partner
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Taper visual */}
      <div className="flex flex-col gap-7">
        <div>
          <h3 className="font-display text-2xl font-bold text-ink-navy">The fee tapers the longer you work together</h3>
          <p className="mt-1.5 max-w-2xl text-slate">
            The ongoing platform fee is split between client and talent, and steps down twice. The highlighted stage
            follows the month in the calculator.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              { key: "m1" as const, when: "Month 1" },
              { key: "t1" as const, when: "Months 2–6" },
              { key: "t2" as const, when: "Months 7–12" },
              { key: "t3" as const, when: "Month 13+" },
            ]
          ).map((cell, i) => {
            const active = tier === cell.key;
            const meta = cell.key === "m1" ? null : TIER_META[cell.key];
            const cPct = meta ? Math.round(meta.client * 1000) / 10 : 0;
            const tPct = meta ? Math.round(meta.talent * 1000) / 10 : 0;
            return (
              <Reveal key={cell.key} variant="up" delayMs={i * 90}>
                <button
                  type="button"
                  onClick={() => setMonth(cell.key === "m1" ? 1 : cell.key === "t1" ? 2 : cell.key === "t2" ? 7 : 13)}
                  className={`flex w-full flex-col gap-3.5 rounded-2xl border p-5 pb-4 text-left transition-[transform,box-shadow,border-color,background-color] duration-300 ${
                    active ? "-translate-y-1.5 border-mist bg-white shadow-2" : "border-transparent bg-frost hover:bg-cloud-blue/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">{cell.when}</span>
                    {active && (
                      <span className="rounded-full bg-cloud-blue px-2.5 py-1 font-mono text-[0.625rem] font-bold tracking-[0.06em] text-voyage-blue uppercase">
                        {tier === "m1" ? "Now" : `Month ${month}`}
                      </span>
                    )}
                  </div>
                  {cell.key === "m1" ? (
                    role === "talent" ? (
                      <p>
                        <b className="font-display text-2xl font-extrabold text-ink-navy">S$0</b>
                        <small className="block text-sm text-slate">you pay nothing in month 1</small>
                      </p>
                    ) : (
                      <p>
                        <b className="font-display text-xl font-extrabold text-ink-navy">One month&apos;s pay</b>
                        <small className="block text-sm text-slate">one-time placement fee, client only</small>
                      </p>
                    )
                  ) : (
                    <>
                      <p>
                        <b className="font-display text-2xl font-extrabold text-ink-navy">
                          {role === "hirer" ? cPct : role === "talent" ? tPct : cPct + tPct}%
                        </b>
                        <small className="block text-sm text-slate">
                          {role ? `your share of ${cPct + tPct}% total` : "total, split two ways"}
                        </small>
                      </p>
                      <div className="flex h-2 overflow-hidden rounded-full bg-line" aria-hidden>
                        <span className="bg-voyage-blue" style={{ width: `${(cPct / (cPct + tPct)) * 100}%` }} />
                        <span className="bg-passport-sky" style={{ width: `${(tPct / (cPct + tPct)) * 100}%` }} />
                      </div>
                      <div className="flex gap-3 text-xs text-slate">
                        <span className="flex items-center gap-1">
                          <i className="inline-block h-2 w-2 rounded-full bg-voyage-blue" aria-hidden />
                          Client {cPct}%
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="inline-block h-2 w-2 rounded-full bg-passport-sky" aria-hidden />
                          Talent {tPct}%
                        </span>
                      </div>
                    </>
                  )}
                  {cell.key !== "m1" && <p className="text-sm text-slate">Charged on a successful match. No ongoing platform fee in month 1. Talent pays nothing.</p>}
                </button>
              </Reveal>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Briefcase, title: "Placement fee: one month's pay", note: "Charged once, to the client only, on a successful match. Talent pays nothing." },
            { icon: Wallet, title: "Fee floor: S$45 a month, combined", note: "The ongoing fee is the percentage above or S$45/month combined, whichever is greater." },
            { icon: Users, title: "Buy-out after month 12", note: "Go to a fully direct relationship with your Talent Partner, with no ongoing platform fee." },
          ].map((r) => (
            <div key={r.title} className="flex gap-4">
              <span className="badge-ico flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cloud-blue text-voyage-blue">
                <r.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h4 className="font-display font-bold text-ink-navy">{r.title}</h4>
                <p className="mt-1 text-sm text-slate">{r.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hiring plans (hirer-facing) */}
      {role !== "talent" && (
        <div className="flex flex-col gap-6">
          <div>
            <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-slate uppercase shadow-[inset_0_0_0_1px_#DCE7F7]">
              Hiring plans · optional
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold text-ink-navy">Hiring often?</h3>
            <p className="mt-1.5 max-w-2xl text-slate">
              Pay per placement as above, or subscribe if you hire frequently. These are for repeat and high-volume
              hirers.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: "Starter", price: "S$79", perks: ["Limited postings", "Standard matching"] },
              { name: "Growth", price: "S$149", perks: ["Unlimited postings", "Priority matching", "Dedicated support"] },
            ].map((plan) => (
              <article key={plan.name} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-7">
                <h4 className="font-display text-lg font-bold text-ink-navy">{plan.name}</h4>
                <p className="font-display text-[clamp(2rem,3vw,2.6rem)] leading-none font-extrabold tracking-[-0.03em] text-ink-navy tabular-nums">
                  {plan.price}
                  <small className="ml-1 text-base font-bold text-slate">/month</small>
                </p>
                <ul className="flex flex-col gap-2">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2.5 text-slate">
                      <Check className="h-4 w-4 shrink-0 stroke-[2.4] text-success" aria-hidden />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup?role=hirer"
                  onClick={() => setRole("hirer")}
                  className="mt-auto flex min-h-11 items-center justify-center rounded-full border-[1.5px] border-mist px-4 font-extrabold text-ink-navy transition hover:border-passport-sky"
                >
                  Create a hirer account
                </Link>
              </article>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-5 rounded-2xl bg-frost p-6">
            <span className="badge-ico flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cloud-blue text-voyage-blue">
              <ArrowRight className="h-5 w-5 -rotate-45" aria-hidden />
            </span>
            <div className="min-w-[240px] flex-1">
              <h4 className="flex items-center gap-2 font-display font-bold text-ink-navy">
                Urgent priority
                <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.06em] text-slate uppercase shadow-[inset_0_0_0_1px_#DCE7F7]">
                  Add-on
                </span>
              </h4>
              <p className="mt-1 text-sm text-slate">
                Expedited matching in 24–48 hours. Subject to available talent. If we&apos;re unable to find a
                suitable match, we&apos;ll let you know.
              </p>
            </div>
            <p>
              <b className="font-display text-xl font-extrabold text-ink-navy">S$50–100</b>
              <small className="block text-sm text-slate">flat rush fee</small>
            </p>
          </div>
        </div>
      )}
      {role === "talent" && (
        <div className="flex flex-wrap items-center gap-5 rounded-2xl bg-frost p-6">
          <span className="badge-ico flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cloud-blue text-voyage-blue">
            <Check className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-[240px] flex-1">
            <h4 className="font-display font-bold text-ink-navy">Nothing else for you to pay</h4>
            <p className="mt-1 text-sm text-slate">
              Hiring plans and the Urgent priority add-on are optional extras for hirers, so they are tucked away
              while you view the Talent Partner side.
            </p>
          </div>
          <button type="button" onClick={() => setRole(null)} className="font-extrabold text-voyage-blue">
            Show both sides
          </button>
        </div>
      )}
    </div>
  );
}
