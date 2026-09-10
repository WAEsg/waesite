import type { AiWorkforceRole } from "@/lib/landing-data";

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path d="M4 13a8 8 0 0 1 16 0" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" stroke="var(--color-passport-sky)" strokeWidth="1.8" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" stroke="var(--color-passport-sky)" strokeWidth="1.8" />
      <path d="M19 19v1a2 2 0 0 1-2 2h-3" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="var(--color-passport-sky)" strokeWidth="1.8" />
      <path d="M4 9.5h16M8 3v3M16 3v3" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 12.5v3l2 1.5" stroke="var(--color-passport-sky)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SalesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path d="M3 20l5-9 4 5 4-7 5 11" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17" cy="6.5" r="2.3" stroke="var(--color-passport-sky)" strokeWidth="1.6" />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path d="M20 12a8 8 0 1 1-3.2-6.4" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 4l3 1-1 3" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12.5l2-2 4.5 4.5-2 2-4.5-4.5z" stroke="var(--color-passport-sky)" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function DataIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <ellipse cx="12" cy="6" rx="7" ry="2.6" stroke="var(--color-passport-sky)" strokeWidth="1.8" />
      <path d="M5 6v5.5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 11.5V17c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-5.5" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const iconMap: Record<AiWorkforceRole["icon"], () => React.JSX.Element> = {
  support: SupportIcon,
  schedule: ScheduleIcon,
  sales: SalesIcon,
  content: ContentIcon,
  data: DataIcon,
};

export function AiRoleIcon({ icon }: { icon: AiWorkforceRole["icon"] }) {
  const Icon = iconMap[icon];
  return <Icon />;
}
