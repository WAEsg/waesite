import { glassPanelLight } from "@/components/ui/glass";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col items-center gap-3 p-10 text-center ${glassPanelLight}`}>
      <span className="badge-ico flex h-12 w-12 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="font-display text-lg font-bold text-ink-navy">{title}</h3>
      <p className="max-w-sm text-sm text-slate">{description}</p>
      {action}
    </div>
  );
}

// A tab that's fully designed but not yet built — used instead of faking
// data for Messages/Earnings/Portfolio/Reviews/Notifications/Help/AI
// Staffing subscription management. See the plan's scope cut.
export function ComingSoon({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <EmptyState
      icon={Icon}
      title={`${title} is coming soon`}
      description="This tab isn't built yet — it's on the list for a follow-up pass. Everything else in your dashboard is fully live."
    />
  );
}
