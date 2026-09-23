import type { BadgeTone } from "@/lib/labels";

// Matches the marketing site's `.chip` system exactly — mono, bold,
// tracked, uppercase pill — instead of the dashboard's previous
// sentence-case badge, so status pills read the same everywhere in the
// product (e.g. "Verified", "ID verified" on the marketing pages).
const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-white text-slate shadow-[inset_0_0_0_1px_#DCE7F7]",
  success: "bg-success-bg text-success",
  warning: "bg-alert-bg text-alert shadow-[inset_0_0_0_1px_#F5C56B]",
  error: "bg-error-bg text-error",
  info: "bg-cloud-blue text-voyage-blue",
};

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: BadgeTone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.06em] uppercase ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
