import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { Reveal } from "@/components/ui/reveal";

export function AboutStory() {
  return (
    <div className="bg-frost px-4 py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <EyebrowLabel>The story</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            Why we started WaeWork
          </h2>
        </div>
        <div className="flex max-w-[68ch] flex-col gap-6">
          <Reveal variant="up">
            <p className="text-lede leading-[1.55] text-ink-navy">
              We started WaeWork after watching good hires fall apart over things that had nothing to do with skill:
              a payment that never arrived on time, a hire nobody could verify, a dispute with no neutral party to
              call.
            </p>
          </Reveal>
          <Reveal variant="up" delayMs={80}>
            <blockquote className="border-l-[3px] border-voyage-blue pl-5 font-display text-xl font-bold text-ink-navy">
              It felt like a solvable problem.
            </blockquote>
          </Reveal>
          <Reveal variant="up" delayMs={160}>
            <p className="text-slate">
              So we built the protections we wished existed: identity verification on both sides, payment held and
              released on a schedule that matches how the work actually happens, and a support team that mediates
              fairly when something goes wrong.
            </p>
          </Reveal>
          <Reveal variant="up" delayMs={220}>
            <p className="text-slate">
              WaeWork is built by WAE (We Are Everywhere), a company focused on making it easy and safe to hire and
              work across borders. A marketplace that&apos;s genuinely worldwide, not restricted to any single
              region on either side.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
