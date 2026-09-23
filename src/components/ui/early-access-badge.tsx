// Matches the prototype's `.chip.chip--early` exactly — amber, not blue:
// font-mono, bold, uppercase, an inset amber-line ring instead of a solid
// border, on the amber-bg fill.
export function EarlyAccessBadge({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-alert-bg font-mono font-bold tracking-[0.08em] text-alert uppercase shadow-[inset_0_0_0_1px_#F5C56B] ${
        compact ? "px-2 py-0.5 text-[0.625rem]" : "px-[11px] py-[5px] text-[0.6875rem]"
      } ${className}`}
    >
      Early Access
    </span>
  );
}
