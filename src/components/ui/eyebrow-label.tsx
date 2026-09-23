// Small uppercase, letter-spaced label used above section headings and on
// illustrative mockup cards (e.g. "VERIFIED REMOTE TALENT · WORLDWIDE",
// "EXAMPLE MATCH", "STEP 01") — the prototype's recurring eyebrow style.
export function EyebrowLabel({
  children,
  dash = false,
  dark = false,
  className = "",
}: {
  children: React.ReactNode;
  /** Prefix with a short horizontal dash, as used above page headlines. */
  dash?: boolean;
  /** On a dark band (e.g. the "Where to next?" close) — matches `.band--deep .eyebrow{color:#9CC2FF}`. */
  dark?: boolean;
  className?: string;
}) {
  const tone = dark ? "text-[#9CC2FF]" : "text-voyage-blue";
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.14em] uppercase ${tone} ${className}`}>
      {dash && <span aria-hidden className={`h-px w-4 ${dark ? "bg-[#9CC2FF]/50" : "bg-voyage-blue/50"}`} />}
      {children}
    </span>
  );
}
