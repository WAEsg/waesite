import Link from "next/link";

// Shown on every /demo/* page so it's never mistaken for real account data.
export function DemoBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-ink-navy px-4 py-2 text-center text-xs font-semibold text-paper-white">
      <span>Demo mode — sample data, no account needed.</span>
      <Link href="/" className="underline underline-offset-2">
        Exit demo
      </Link>
    </div>
  );
}
