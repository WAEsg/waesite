import { trustPillars } from "@/lib/landing-data";
import { glassCard, glassCardHover, glowShadow } from "@/components/ui/glass";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4.5" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="var(--color-passport-sky)" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="1.4" fill="var(--color-passport-sky)" />
    </svg>
  );
}

function BenchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <circle cx="9" cy="8" r="2.6" stroke="var(--color-passport-sky)" strokeWidth="1.8" />
      <circle cx="17" cy="9.5" r="2" stroke="var(--color-passport-sky)" strokeWidth="1.6" strokeDasharray="2.2 2.2" />
      <path d="M4 19c0-3 2.2-5 5-5s5 2 5 5" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14.5 19c0-2.2 1.3-3.8 3-4.3" stroke="var(--color-passport-sky)" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2.2 2.2" />
    </svg>
  );
}

function ReplaceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path d="M4 12a8 8 0 0 1 13.66-5.66M20 12a8 8 0 0 1-13.66 5.66" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17.5 3v3.5H14M6.5 21v-3.5H10" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path d="M12 3v18M7 21h10" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 5l-5 3.5M12 5l5 3.5" stroke="var(--color-passport-sky)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 8.5l3 5h-6l3-5zM20 8.5l3 5h-6l3-5z" stroke="var(--color-passport-sky)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

const icons = [ShieldIcon, LockIcon, BenchIcon, ReplaceIcon, ScaleIcon];

export function TrustSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="text-center font-display text-2xl font-bold text-frost sm:text-3xl">
        What protects you — and them
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-mist">
        If this is your first time hiring or working remotely across
        borders, here&apos;s exactly what&apos;s in place.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trustPillars.map((pillar, index) => {
          const Icon = icons[index];
          return (
            <div key={pillar.title} className={`p-6 ${glassCard} ${glassCardHover}`}>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] ${glowShadow}`}>
                <Icon />
              </div>
              <h3 className="mt-4 font-display font-semibold text-frost">
                {pillar.title}
              </h3>
              <p className="mt-1.5 text-sm text-mist">{pillar.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
