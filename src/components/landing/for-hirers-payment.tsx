import { Briefcase, Check, Lock, Wallet } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkArrow } from "@/components/ui/link-arrow";
import { Reveal } from "@/components/ui/reveal";
import { ReleaseTimeline, type ReleaseStage } from "@/components/ui/release-timeline";

const STAGES: ReleaseStage[] = [
  { icon: <Lock className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Day 0", what: "Funds held", note: "Held via Stripe Connect, not paid out upfront." },
  { icon: <Wallet className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Day 15", what: "Partial release", note: "Part of the payment goes to your Talent Partner." },
  { icon: <Check className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Day 30", what: "Remainder released", note: "The rest goes out. Neither side carries a full month of risk." },
];

const TICKS = [
  "If a Talent Partner goes unresponsive, a defined response window kicks in automatically.",
  "If it doesn't work out early on, we'll help place a replacement.",
  "If you disagree on delivered work, our support team mediates fairly for both sides. It's a service everyone is covered by, not a deduction.",
];

export function ForHirersPayment() {
  return (
    <div id="hirers-payment" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-5">
          <div>
            <EyebrowLabel>Payment protection</EyebrowLabel>
            <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
              Never pay a full month for work you haven&apos;t seen
            </h2>
            <p className="mt-2 text-lede leading-[1.55] text-slate">
              Funds are held via Stripe Connect rather than paid to your Talent Partner upfront. For an ongoing Team
              Extension, release happens every 15 days: partial at day 15, the rest at day 30.
            </p>
          </div>
          <ul className="flex flex-col gap-3">
            {TICKS.map((tick) => (
              <li key={tick} className="flex items-start gap-2.5 text-slate">
                <Check className="mt-0.5 h-4 w-4 shrink-0 stroke-[2.4] text-success" aria-hidden />
                {tick}
              </li>
            ))}
          </ul>
          <p>
            <LinkArrow href="/how-it-works#how-it-works-protect">See every protection in detail</LinkArrow>
          </p>
        </div>

        <Reveal variant="right">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-1 sm:p-8">
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-slate uppercase">
              Ongoing Team Extension · how payment is released
            </p>
            <div className="mt-5">
              <ReleaseTimeline stages={STAGES} />
            </div>
            <div className="mt-5 flex items-start gap-3.5 border-t border-dashed border-mist pt-5 text-slate">
              <span className="badge-ico flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cloud-blue text-voyage-blue">
                <Briefcase className="h-5 w-5" aria-hidden />
              </span>
              <p>
                <strong className="text-ink-navy">Project-based work:</strong> release is tied to milestones you agree
                on, so you can start small and scale up once it&apos;s working.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
