import type { LucideIcon } from "lucide-react";
import { glassCardLight } from "@/components/ui/glass";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className={`p-5 ${glassCardLight}`}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">{label}</p>
        {Icon && (
          <span className="badge-ico flex h-9 w-9 items-center justify-center rounded-lg bg-cloud-blue text-voyage-blue">
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-ink-navy">{value}</p>
      {hint && <p className="mt-1 text-sm text-slate">{hint}</p>}
    </div>
  );
}
