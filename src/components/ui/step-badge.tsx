import type { LucideIcon } from "lucide-react";

// Step marker used in "how it works"/"vetting" style sections. With an
// `icon`, matches the prototype's exact pattern: a themed icon-in-square
// badge, then a small "STEP 01" label beneath it. Without one, falls
// back to a plain numbered circle (used where no themed icon applies).
export function StepBadge({ number, icon: Icon }: { number: number; icon?: LucideIcon }) {
  const padded = String(number).padStart(2, "0");

  if (Icon) {
    return (
      <div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-voyage-blue/[0.06]">
          <Icon className="h-5 w-5 text-voyage-blue" aria-hidden />
        </span>
        <span className="mt-3 block text-xs font-bold tracking-[0.14em] text-voyage-blue uppercase">
          Step {padded}
        </span>
      </div>
    );
  }

  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-voyage-blue/20 bg-voyage-blue/10 text-sm font-bold tracking-tight text-voyage-blue">
      {padded}
    </span>
  );
}
