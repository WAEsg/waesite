// Shared brand mark — exact SVG (globe + amber dot) and "Wae**Work**"
// wordmark lifted from the prototype's header/footer logo. `variant`
// swaps the circle/stroke colors for use on a light vs. dark background.
// Font spec (.logo): 800 weight, 1.3125rem, font-display, -0.03em
// tracking. Mark rotates 180deg over 0.8s on hover (.logo:hover .logo__mark).
export function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  const onDark = variant === "dark";
  return (
    <span className="group inline-flex items-center gap-2.5">
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-[30px] w-[30px] shrink-0 transition-transform duration-[800ms] ease-out group-hover:rotate-180"
      >
        <circle cx="16" cy="16" r="14" fill={onDark ? "#FFFFFF" : "#1E4FA3"} />
        <path
          d="M2.5 16h27M16 2.5c4.2 3.8 6.3 8.3 6.3 13.5S20.2 25.7 16 29.5C11.8 25.7 9.7 21.2 9.7 16S11.8 6.3 16 2.5z"
          fill="none"
          stroke={onDark ? "#0F2A5C" : "#fff"}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="22.5" cy="10" r="3" fill="#F5A623" stroke={onDark ? "#fff" : "#1E4FA3"} strokeWidth="1.5" />
      </svg>
      <span
        className={`font-display text-[1.3125rem] leading-none font-extrabold tracking-[-0.03em] ${onDark ? "text-white" : "text-ink-navy"}`}
      >
        Wae<b className={onDark ? "text-[#9CC2FF]" : "text-voyage-blue"}>Work</b>
      </span>
    </span>
  );
}
