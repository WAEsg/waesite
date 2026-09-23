import type { LucideIcon } from "lucide-react";

// The "boarding-pass" chip — the prototype's signature floating element
// (.pass/.pass__main/.pass__route/.pass__meta/.pass__stub). Base shape is
// exactly two lines — a bold route line (two endpoints joined by a short
// dotted rule) and a not-bold meta line underneath — both set in the mono
// font from the `.pass` container itself, plus a green icon stub with a
// dashed left border. `.float` drives the idle 7s bob.
//
// `live` renders the hero's one animated chip (.hm-live): an extra
// "● Example match" tag row above the route, and accepts `swapPhase`/
// `hit` so the caller (HeroGlobeStage) can replay the prototype's
// crossfade-and-pop when a new route arrives from the globe's ww:arc
// events — out (fade/slide up) -> pre (snap below, no transition) -> idle
// (settle in), plus a spring scale pop on the stub icon.
//
// `parallaxK` mirrors `.hm-chip .pass{transform:translate3d(var(--px)*
// var(--k)*1px, var(--py)*var(--k)*1px, 0)}`: the caller sets `--px`/`--py`
// (-1..1) on an ancestor as the pointer moves over the hero, and each chip
// drifts by its own factor (14 / -9 / 7 in the prototype) for a subtle
// parallax — separate from the `.float` bob, which lives on the wrapper.
export function MockupCard({
  from,
  to,
  meta,
  icon: Icon,
  floatDelay = "0s",
  live = false,
  swapPhase = "idle",
  hit = false,
  parallaxK,
  className = "",
}: {
  from: string;
  to: string;
  meta: string;
  icon: LucideIcon;
  floatDelay?: string;
  live?: boolean;
  swapPhase?: "idle" | "out" | "pre";
  hit?: boolean;
  parallaxK?: number;
  className?: string;
}) {
  const swapStyle =
    swapPhase === "out"
      ? { opacity: 0, transform: "translateY(-8px)", transition: "opacity .2s ease, transform .32s cubic-bezier(.16,1,.3,1)" }
      : swapPhase === "pre"
        ? { opacity: 0, transform: "translateY(8px)", transition: "none" }
        : { opacity: 1, transform: "translateY(0)", transition: "opacity .2s ease, transform .32s cubic-bezier(.16,1,.3,1)" };

  return (
    <div className={`waework-float ${className}`} style={{ animationDelay: floatDelay }}>
      <div
        className="inline-flex max-w-full items-stretch overflow-hidden rounded-[14px] border bg-white font-mono"
        style={{
          borderColor: "#DCE7F7",
          boxShadow: "0 2px 4px rgba(15,42,92,.06), 0 16px 40px rgba(15,42,92,.13)",
          ...(parallaxK !== undefined && {
            transform: `translate3d(calc(var(--px, 0) * ${parallaxK}px), calc(var(--py, 0) * ${parallaxK}px), 0)`,
            transition: "transform .8s cubic-bezier(.16,1,.3,1)",
          }),
        }}
      >
        <div className={`flex min-w-0 flex-col px-3.5 ${live ? "flex-1 gap-[7px] py-[11px]" : "gap-1 py-2.5"}`}>
          {live && (
            <span className="flex items-center gap-[7px] text-[0.6875rem] font-bold tracking-[0.12em] text-slate uppercase">
              <span className="ww-dot-live relative h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#17753F" }} />
              Example match
            </span>
          )}
          <span className="flex flex-col gap-1" style={swapStyle}>
            <span className="flex items-center gap-2 text-[0.8125rem] font-bold tracking-[0.06em] text-ink-navy">
              <span>{from}</span>
              <i className="inline-block h-0 w-[18px] border-t-2 border-dotted" style={{ borderColor: "#4A90E2" }} aria-hidden />
              <span>{to}</span>
            </span>
            <span className="text-[0.6875rem] tracking-[0.03em] leading-[1.35] text-slate">{meta}</span>
          </span>
        </div>
        <div
          className="flex shrink-0 items-center justify-center border-l-2 border-dashed px-3"
          style={{ borderColor: "#C9DDF7", color: "#17753F", backgroundColor: "#E5F6EC" }}
        >
          <Icon
            className="h-4 w-4 stroke-[2.6] transition-transform duration-500"
            style={{ transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)", transform: hit ? "scale(1.4)" : "scale(1)" }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
