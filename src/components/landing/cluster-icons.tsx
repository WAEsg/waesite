import type { SkillCluster } from "@/lib/skills-data";

function AdminIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="var(--color-passport-sky)" strokeWidth="1.8" />
      <path d="M4 9.5h16M8 13h4" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CreativeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.7 1.6-1.5 0-.4-.15-.7-.4-1-.25-.3-.4-.6-.4-1 0-.8.65-1.5 1.5-1.5H16a4 4 0 0 0 4-4c0-4.4-3.6-8-8-8z"
        stroke="var(--color-passport-sky)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="11" r="1.1" fill="var(--color-passport-sky)" />
      <circle cx="11.5" cy="7.5" r="1.1" fill="var(--color-passport-sky)" />
      <circle cx="15.5" cy="9.5" r="1.1" fill="var(--color-passport-sky)" />
    </svg>
  );
}

function TechIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 5l-3 14" stroke="var(--color-passport-sky)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FinanceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path d="M4 19V9M9.5 19V5M15 19v-7M20 19v-4" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 19h18" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SalesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path d="M4 17l5-5 4 4 7-8" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 8h5v5" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpecializedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M12 3l1.8 4.6 4.7.4-3.6 3.1 1.1 4.6-4-2.5-4 2.5 1.1-4.6-3.6-3.1 4.7-.4L12 3z"
        stroke="var(--color-passport-sky)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const iconMap: Record<SkillCluster["icon"], () => React.JSX.Element> = {
  admin: AdminIcon,
  creative: CreativeIcon,
  tech: TechIcon,
  finance: FinanceIcon,
  sales: SalesIcon,
  specialized: SpecializedIcon,
};

export function ClusterIcon({ icon }: { icon: SkillCluster["icon"] }) {
  const Icon = iconMap[icon];
  return <Icon />;
}
