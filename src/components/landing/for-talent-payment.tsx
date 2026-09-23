import { Calendar, Check, Lock, RefreshCw, Wallet } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkArrow } from "@/components/ui/link-arrow";
import { Reveal } from "@/components/ui/reveal";
import { ReleaseTimeline, type ReleaseStage } from "@/components/ui/release-timeline";

const STAGES: ReleaseStage[] = [
  { icon: <Lock className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Day 0", what: "Funds held", note: "Your hirer's payment is held via Stripe Connect." },
  { icon: <Wallet className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Day 15", what: "Partial release", note: "Part of your pay reaches you halfway through." },
  { icon: <Check className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Day 30", what: "Remainder released", note: "So you're never working a full month unpaid." },
];

const MILESTONES = ["Milestone 1", "Milestone 2", "Final delivery"];

export function ForTalentPayment() {
  return (
    <div className="px-4 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
        <Reveal variant="left">
          <div className="flex flex-col gap-5">
            <div>
              <EyebrowLabel>Getting paid, protected</EyebrowLabel>
              <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
                You&apos;re never working a full month unpaid
              </h2>
              <p className="mt-2 text-lede leading-[1.55] text-slate">
                Your hirer&apos;s funds are held via Stripe Connect, then released to you on a schedule that matches
                how the work actually happens.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex gap-4">
                <span className="badge-ico flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
                  <RefreshCw className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink-navy">Ongoing Team Extension</h3>
                  <p className="mt-1 text-slate">Payment releases every 15 days: partial at day 15, the rest at day 30.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="badge-ico flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
                  <Calendar className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink-navy">Project-based work</h3>
                  <p className="mt-1 text-slate">Release is tied to milestones agreed upfront with your hirer.</p>
                </div>
              </div>
            </div>
            <p>
              <LinkArrow href="/how-it-works#how-it-works-protect">See every protection in detail</LinkArrow>
            </p>
          </div>
        </Reveal>

        <Reveal variant="right">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-1 sm:p-8">
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-slate uppercase">
              Ongoing Team Extension · one month of work
            </p>
            <div className="mt-5">
              <ReleaseTimeline stages={STAGES} />
            </div>
            <div className="mt-6 flex flex-col gap-3 border-t-2 border-dashed border-mist pt-5">
              <p className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-slate uppercase">
                Project-based work · example milestones
              </p>
              <ol className="flex flex-wrap gap-2">
                {MILESTONES.map((m) => (
                  <li
                    key={m}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-frost px-3 py-2 font-bold text-ink-navy"
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3] text-success" aria-hidden />
                    {m}
                  </li>
                ))}
              </ol>
              <p className="text-sm text-slate">Example only. You and your hirer agree the milestones upfront.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
