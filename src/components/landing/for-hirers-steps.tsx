import { PenLine, RefreshCw, ShieldCheck } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkArrow } from "@/components/ui/link-arrow";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  { icon: PenLine, chip: "You", title: "Post what you need", description: "Describe the role or project: scope, budget, and whether it's project-based work or an ongoing Team Extension." },
  { icon: ShieldCheck, chip: "WaeWork", title: "We vet and match", description: "Every applicant completes identity verification through Stripe Identity before they can apply. We surface the best-fit Talent Partners from a global pool." },
  { icon: RefreshCw, chip: "Together", title: "Start small, scale once it's working", description: "Funds are held via Stripe Connect, not paid out upfront, and released on a schedule tied to how the engagement actually works." },
];

export function ForHirersSteps() {
  return (
    <div id="hirers-steps" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <EyebrowLabel>How hiring works</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            Post it, get matched, start small
          </h2>
          <p className="mt-2 text-lede leading-[1.55] text-slate">
            You describe the work, we handle verification and matching, and payment is held rather than paid upfront.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} variant="up" delayMs={i * 90}>
                <div className="flex h-full flex-col gap-2.5">
                  <span className="badge-ico flex h-12 w-12 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold tracking-[0.14em] text-voyage-blue uppercase">
                      STEP {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-slate uppercase shadow-[inset_0_0_0_1px_#DCE7F7]">
                      {step.chip}
                    </span>
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink-navy">{step.title}</h3>
                  <p className="text-slate">{step.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-14">
          <p className="font-mono text-xs font-bold tracking-[0.14em] text-slate uppercase">Two ways to work together</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2.5 rounded-2xl bg-frost p-6">
              <div className="flex items-center gap-3.5">
                <span className="badge-ico flex h-11 w-11 items-center justify-center rounded-xl bg-white text-voyage-blue shadow-[inset_0_0_0_1px_#DCE7F7]">
                  <RefreshCw className="h-[22px] w-[22px]" aria-hidden />
                </span>
                <h3 className="font-display text-xl font-bold text-ink-navy">Ongoing Team Extension</h3>
              </div>
              <p className="text-slate">An ongoing role on your team. Payment is released every 15 days.</p>
              <div className="mt-auto pt-1">
                <LinkArrow href="/pricing">See ongoing pricing</LinkArrow>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 rounded-2xl bg-frost p-6">
              <div className="flex items-center gap-3.5">
                <span className="badge-ico flex h-11 w-11 items-center justify-center rounded-xl bg-white text-voyage-blue shadow-[inset_0_0_0_1px_#DCE7F7]">
                  <PenLine className="h-[22px] w-[22px]" aria-hidden />
                </span>
                <h3 className="font-display text-xl font-bold text-ink-navy">Project-based work</h3>
              </div>
              <p className="text-slate">A one-off project. Payment is released at milestones you agree on, with no placement fee.</p>
              <div className="mt-auto pt-1">
                <LinkArrow href="/pricing">See project pricing</LinkArrow>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8">
          <LinkArrow href="/how-it-works">See how it works, step by step</LinkArrow>
        </p>
      </div>
    </div>
  );
}
