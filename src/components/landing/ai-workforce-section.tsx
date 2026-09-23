import Link from "next/link";
import { Sparkles } from "lucide-react";
import { aiWorkforceHeading, aiWorkforceIntro, aiWorkforceRoles, aiStaffingFoundingMember } from "@/lib/landing-data";
import { buttonPrimary, buttonSecondary } from "@/components/ui/button-classes";
import { EarlyAccessBadge } from "@/components/ui/early-access-badge";
import { AiRoleIcon } from "./ai-icons";
import { Reveal } from "@/components/ui/reveal";

// Matches the prototype's "hm-ai" band exactly: a teaser only — copy +
// price + CTAs on the left, a single "Five AI teammates" roster card (not
// a grid of individual cards) on the right. The full pricing table lives
// on /ai-workforce, not here — the prototype's homepage band never shows
// it either.
export function AiWorkforceSection() {
  return (
    <section id="ai-staffing" className="scroll-mt-24 bg-cloud-blue/40 px-4 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
        <Reveal variant="up">
          <div>
            <EarlyAccessBadge />
            <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
              {aiWorkforceHeading}
            </h2>
            <p className="mt-3 max-w-md text-slate">{aiWorkforceIntro}</p>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-mono text-xs font-bold tracking-[0.14em] text-slate uppercase">From</span>
              <span className="font-display text-3xl font-extrabold text-ink-navy">
                S$99<span className="text-base font-semibold text-slate">/month</span>
              </span>
            </div>
            <p className="mt-1 text-sm text-slate">{aiStaffingFoundingMember.label}.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/ai-workforce" className={buttonPrimary}>
                See AI Staffing
              </Link>
              <Link href="/ai-workforce" className={buttonSecondary}>
                Join the waitlist
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal variant="right" delayMs={100}>
          <div className="rounded-2xl border border-line bg-white p-5 shadow-1">
            <p className="flex items-center gap-2 font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-slate uppercase">
              <Sparkles className="h-3.5 w-3.5 text-voyage-blue" aria-hidden />
              Five AI teammates
            </p>
            <ul className="mt-2">
              {aiWorkforceRoles.map((role) => (
                <li key={role.slug} className="flex items-center gap-3 border-t border-line py-[9px] font-bold text-ink-navy">
                  <span className="badge-ico flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-cloud-blue text-voyage-blue">
                    <AiRoleIcon icon={role.icon} />
                  </span>
                  <span className="text-[0.9375rem]">{role.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
