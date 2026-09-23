import { Globe2 } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { Reveal } from "@/components/ui/reveal";

export function AboutHero() {
  return (
    <div className="px-4 pt-16 pb-16 sm:pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <EyebrowLabel dash>About WaeWork</EyebrowLabel>
          <h1 className="mt-3 text-balance font-display text-display leading-[1.02] font-extrabold tracking-[-0.03em] text-ink-navy">
            Great talent isn&apos;t confined to one postcode —{" "}
            <em className="text-voyage-blue not-italic">and neither is a great opportunity.</em>
          </h1>
          <p className="mt-3 max-w-xl text-lede leading-[1.55] text-slate">
            WaeWork is a marketplace connecting hirers with identity-verified remote talent. Both sides can be
            located anywhere in the world.
          </p>
        </div>

        <div className="relative flex flex-col items-center gap-8 py-6">
          <Reveal variant="right" delayMs={260}>
            <div className="inline-flex max-w-full items-stretch overflow-hidden rounded-[14px] border border-line bg-white font-mono shadow-2">
              <div className="flex min-w-0 flex-col gap-1 px-3.5 py-2.5">
                <span className="flex items-center gap-2 text-[0.8125rem] font-bold tracking-[0.06em] text-ink-navy">
                  ANYWHERE
                  <i className="inline-block h-0 w-[18px] border-t-2 border-dotted border-passport-sky" aria-hidden />
                  ANYWHERE
                </span>
                <span className="text-[0.6875rem] tracking-[0.03em] text-slate">Hirers and talent, worldwide</span>
              </div>
              <div className="flex shrink-0 items-center justify-center border-l-2 border-dashed border-mist bg-success-bg px-3 text-success">
                <Globe2 className="h-4 w-4 stroke-[2.6]" aria-hidden />
              </div>
            </div>
          </Reveal>
          <Reveal variant="scale" delayMs={520}>
            <span
              className="inline-flex flex-col items-center gap-0.5 rounded-[10px] border-[2.5px] px-3.5 py-2 font-mono text-xs font-bold tracking-[0.16em] text-voyage-blue uppercase [border-style:double] [mix-blend-mode:multiply]"
              style={{ borderColor: "var(--color-voyage-blue)", transform: "rotate(-7deg)", background: "rgba(255,255,255,.6)" }}
            >
              We are everywhere
              <span className="text-[0.625rem] tracking-[0.12em]">WAE Pte. Ltd. · SIN</span>
            </span>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
