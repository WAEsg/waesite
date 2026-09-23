import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { SignupProgress } from "./signup-progress";
import { SignupSidePanel } from "./signup-side-panel";
import type { SiteRole } from "@/lib/use-role-preference";

export function SignupWizardShell({
  step,
  role,
  stepLabel,
  title,
  lede,
  children,
}: {
  step: 1 | 2 | 3;
  role: SiteRole;
  stepLabel: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="px-4 pt-10 pb-16 sm:pt-14"
      style={{ background: "radial-gradient(820px 380px at 88% -60px, var(--color-cloud-blue), transparent 70%)" }}
    >
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex" aria-label="WaeWork home">
          <Logo />
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="flex flex-col gap-7">
            <SignupProgress step={step} />

            <div className="flex flex-col items-start gap-3">
              <span className="font-mono text-xs font-bold tracking-[0.14em] text-voyage-blue uppercase">{stepLabel}</span>
              <h1 tabIndex={-1} className="text-balance font-display text-[clamp(2rem,2.2vw+1.35rem,3.1rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink-navy">
                {title}
              </h1>
              <p className="max-w-lg text-[1.0625rem] leading-[1.55] text-slate">{lede}</p>
            </div>

            {children}
          </div>

          <SignupSidePanel role={role} step={step} />
        </div>
      </div>
    </div>
  );
}
