"use client";

// Hand-drawn squiggle underline beneath a headline's accent phrase —
// exact path/color/animation lifted from the prototype's `.hm-underline`
// (viewBox 0 0 270 10, amber stroke #F5C56B, pathLength-normalized
// stroke-dashoffset "draw on" animation).
export function AccentUnderline({
  delayMs = 300,
  viewBox = "0 0 270 10",
  path = "M3 7C52 3 118 9 176 5s64-2 91 1",
}: {
  delayMs?: number;
  viewBox?: string;
  path?: string;
}) {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-full -mt-[0.1em] w-full overflow-visible"
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={path}
        fill="none"
        stroke="#F5C56B"
        strokeWidth="3.2"
        strokeLinecap="round"
        pathLength={1}
        className="waework-draw-underline"
        style={{ animationDelay: `${delayMs}ms` }}
      />
    </svg>
  );
}
