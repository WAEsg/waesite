"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import { computeGigMilestoneFee } from "@/lib/stripe/fees";
import { useRolePreference } from "@/lib/use-role-preference";
import { Reveal } from "@/components/ui/reveal";

function fmt(n: number): string {
  return `S$${Math.round(n).toLocaleString("en-SG")}`;
}

export function PricingProjectPanel() {
  const [value, setValue] = useState(3000);
  const [role, setRole] = useRolePreference();
  const breakdown = useMemo(() => computeGigMilestoneFee(value), [value]);
  const clientHighlight = role === "hirer";
  const talentHighlight = role === "talent";

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="flex flex-col gap-7">
        <div>
          <h3 className="font-display text-2xl font-bold text-ink-navy">One-off project calculator</h3>
          <p className="mt-1.5 max-w-md text-slate">
            Project and gig work costs 15% of the total project value, split 10% client and 5% talent.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="pricing-value" className="font-extrabold text-ink-navy">
            Total project value
          </label>
          <div className="flex items-end justify-between gap-3">
            <span className="flex flex-col gap-1.5">
              <span className="font-display text-[clamp(2.1rem,2.6vw+1.1rem,3rem)] leading-none font-extrabold tracking-[-0.035em] text-ink-navy tabular-nums">
                {fmt(value)}
              </span>
              <small className="font-bold text-slate">for the whole project</small>
            </span>
            <span className="flex shrink-0 gap-2">
              {([-1, 1] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setValue((v) => Math.min(20000, Math.max(200, v + dir * 100)))}
                  aria-label={dir === -1 ? "Decrease" : "Increase"}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-line bg-white text-ink-navy transition hover:border-passport-sky hover:text-voyage-blue"
                >
                  {dir === -1 ? <Minus className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                </button>
              ))}
            </span>
          </div>
          <input
            id="pricing-value"
            type="range"
            min={200}
            max={20000}
            step={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="my-1.5 w-full accent-voyage-blue"
          />
          <div className="flex justify-between font-bold text-slate">
            <span>S$200</span>
            <span>S$20,000</span>
          </div>
        </div>

        <ul className="flex flex-col gap-2.5">
          {[
            <>
              <strong className="text-ink-navy">No separate placement fee</strong> for project-based work.
            </>,
            <>
              The 15% is <strong className="text-ink-navy">taken from milestone releases</strong>.
            </>,
            "Funds are held via Stripe Connect and released against milestones you agree.",
          ].map((line, i) => (
            <li key={i} className="flex items-start gap-2.5 text-slate">
              <Check className="mt-0.5 h-4 w-4 shrink-0 stroke-[2.4] text-success" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <Reveal variant="scale" delayMs={100}>
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-2">
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line px-6 py-4">
            <span className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.1em] text-ink-navy uppercase">
              Project
              <i className="inline-block h-0 w-[22px] border-t-2 border-dotted border-passport-sky" aria-hidden />
              Milestones
            </span>
            <span className="rounded-full bg-cloud-blue px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.06em] text-voyage-blue">
              15% total fee
            </span>
          </div>

          <div className="flex flex-col gap-[18px] p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className={`flex flex-col gap-1.5 rounded-xl border p-4 ${clientHighlight ? "border-voyage-blue bg-voyage-blue shadow-2" : "border-line bg-frost"}`}>
                <span className={`font-mono text-[0.6875rem] font-bold tracking-[0.1em] uppercase ${clientHighlight ? "text-cloud-blue" : "text-slate"}`}>
                  {role === "hirer" ? "You pay in total" : "Client pays in total"}
                </span>
                <span className={`font-display text-[clamp(1.6rem,1.6vw+1.1rem,2.2rem)] leading-[1.05] font-extrabold tracking-[-0.03em] ${clientHighlight ? "text-white" : "text-ink-navy"}`}>
                  {fmt(breakdown.totalCharge)}
                </span>
                <span className={`text-[0.8125rem] leading-[1.4] ${clientHighlight ? "text-cloud-blue" : "text-slate"}`}>
                  {fmt(value)} project + {fmt(breakdown.clientFeeShare)} fee
                </span>
              </div>
              <div className={`flex flex-col gap-1.5 rounded-xl border p-4 ${talentHighlight ? "border-voyage-blue bg-voyage-blue shadow-2" : "border-line bg-frost"}`}>
                <span className={`font-mono text-[0.6875rem] font-bold tracking-[0.1em] uppercase ${talentHighlight ? "text-cloud-blue" : "text-slate"}`}>
                  {role === "talent" ? "You receive" : "Talent receives"}
                </span>
                <span className={`font-display text-[clamp(1.6rem,1.6vw+1.1rem,2.2rem)] leading-[1.05] font-extrabold tracking-[-0.03em] ${talentHighlight ? "text-white" : "text-ink-navy"}`}>
                  {fmt(breakdown.talentReceives)}
                </span>
                <span className={`text-[0.8125rem] leading-[1.4] ${talentHighlight ? "text-cloud-blue" : "text-slate"}`}>
                  {fmt(value)} project − {fmt(breakdown.talentFeeShare)} fee
                </span>
              </div>
            </div>

            <dl className="flex flex-col">
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                <dt className="text-slate">Total project value</dt>
                <dd className="font-extrabold text-ink-navy tabular-nums">{fmt(value)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                <dt className="text-slate">
                  Platform fee, total <span className="rounded-md bg-cloud-blue px-[7px] py-1 font-mono text-xs text-voyage-blue">15%</span>
                </dt>
                <dd className="font-extrabold text-ink-navy tabular-nums">{fmt(breakdown.applicationFeeAmount)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 pl-[18px]">
                <dt className={`flex items-center gap-2 ${clientHighlight ? "font-extrabold text-ink-navy" : "text-slate"}`}>
                  Client share <span className="rounded-md bg-cloud-blue px-[7px] py-1 font-mono text-xs text-voyage-blue">10%</span>
                  {clientHighlight && <span className="rounded-md bg-cloud-blue px-[7px] py-1 font-mono text-xs text-voyage-blue">You</span>}
                </dt>
                <dd className={`tabular-nums ${clientHighlight ? "font-extrabold text-ink-navy" : "font-bold text-slate"}`}>{fmt(breakdown.clientFeeShare)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 pl-[18px]">
                <dt className={`flex items-center gap-2 ${talentHighlight ? "font-extrabold text-ink-navy" : "text-slate"}`}>
                  Talent share <span className="rounded-md bg-cloud-blue px-[7px] py-1 font-mono text-xs text-voyage-blue">5%</span>
                  {talentHighlight && <span className="rounded-md bg-cloud-blue px-[7px] py-1 font-mono text-xs text-voyage-blue">You</span>}
                </dt>
                <dd className={`tabular-nums ${talentHighlight ? "font-extrabold text-ink-navy" : "font-bold text-slate"}`}>{fmt(breakdown.talentFeeShare)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-slate">Placement fee</dt>
                <dd className="font-bold text-ink-navy">None for projects</dd>
              </div>
            </dl>
          </div>

          <div className="mx-6 border-t-2 border-dashed border-mist" aria-hidden />

          <div className="flex flex-col gap-4 p-6">
            <div className="flex flex-col gap-2">
              <div className="flex h-3 overflow-hidden rounded-full bg-line" aria-hidden>
                <span className="bg-voyage-blue" style={{ width: "66.7%" }} />
                <span className="bg-passport-sky" style={{ width: "33.3%" }} />
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate">
                <span className="flex items-center gap-1.5">
                  <i className="inline-block h-2.5 w-2.5 rounded-full bg-voyage-blue" aria-hidden />
                  Client 10%
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="inline-block h-2.5 w-2.5 rounded-full bg-passport-sky" aria-hidden />
                  Talent 5%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {role !== "talent" && (
                <Link
                  href="/signup?role=hirer"
                  onClick={() => setRole("hirer")}
                  className="flex min-h-12 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-voyage-blue bg-voyage-blue px-[22px] py-3 text-center font-extrabold text-white shadow-[0_6px_18px_rgba(30,79,163,0.26)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Post a project
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
  );
}
