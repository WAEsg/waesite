import Link from "next/link";
import { PenLine, ShieldCheck, TrendingUp } from "lucide-react";
import { howItWorksSteps } from "@/lib/landing-data";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { StepBadge } from "@/components/ui/step-badge";
import { Reveal } from "@/components/ui/reveal";

const STEP_ICONS = [PenLine, ShieldCheck, TrendingUp];

// Compact 3-step summary for the home page — the full scroll-animated
// version lives on /how-it-works (flight-path-section.tsx); this is the
// lightweight teaser the prototype shows between the hero and the trust
// section on the home page.
export function HowItWorksTeaser() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <EyebrowLabel dash className="justify-center">
          How it works
        </EyebrowLabel>
        <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
          From brief to working together, in three steps
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-slate">
          You describe the work. We do the vetting and the matching. Payment stays protected while you find out if it&apos;s a fit.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {howItWorksSteps.map((step, i) => (
          <Reveal key={step.number} variant="fade" delayMs={i * 140}>
            <div className="relative pt-5">
              <div className="step-divider">
                <div className="step-divider__fill" style={{ "--d": `${i * 140}ms` } as React.CSSProperties} />
              </div>
              <StepBadge number={step.number} icon={STEP_ICONS[i]} />
              <h3 className="mt-3 font-bold text-ink-navy">{step.title}</h3>
              <p className="mt-1 text-sm text-slate">{step.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/how-it-works" className="font-semibold text-passport-sky transition hover:text-ink-navy">
          See every protection in detail →
        </Link>
      </div>
    </section>
  );
}
