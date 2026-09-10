export function EarlyAccessBadge({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border border-passport-sky/30 bg-passport-sky/10 font-semibold text-passport-sky ${
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      } ${className}`}
    >
      Early Access
    </span>
  );
}
