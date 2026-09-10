import Link from "next/link";
import {
  aiWorkforceFallback,
  aiWorkforceHeading,
  aiWorkforceIntro,
  aiWorkforceRoles,
  aiWorkforceWaitlistNote,
} from "@/lib/landing-data";
import { glassCard, glassCardHover, glowShadow } from "@/components/ui/glass";
import { EarlyAccessBadge } from "@/components/ui/early-access-badge";
import { AiRoleIcon } from "./ai-icons";
import { AiStaffingPricing } from "./ai-staffing-pricing";

export function AiWorkforceSection() {
  return (
    <section id="ai-staffing" className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2.5">
          <h2 className="font-display text-2xl font-bold text-frost sm:text-3xl">
            {aiWorkforceHeading}
          </h2>
          <EarlyAccessBadge />
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-mist">{aiWorkforceIntro}</p>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-mist/70">
          {aiWorkforceWaitlistNote}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aiWorkforceRoles.map((role) => (
          <div key={role.slug} className={`flex flex-col p-5 ${glassCard} ${glassCardHover}`}>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] ${glowShadow}`}>
              <AiRoleIcon icon={role.icon} />
            </div>
            <span className="mt-3 font-display font-semibold text-frost">
              {role.title}
            </span>
            <p className="mt-1 flex-1 text-sm text-mist">{role.description}</p>
            <Link
              href={`/ai-workforce?role=${role.slug}`}
              className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-passport-sky transition hover:text-frost"
            >
              Get Early Access →
            </Link>
          </div>
        ))}

        {/* Fallback card — visually distinct (dashed border, muted fill)
            so it reads as open-ended, not another fixed role. */}
        <div className="flex flex-col rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5 text-center sm:text-left">
          <p className="font-display font-semibold text-frost">
            {aiWorkforceFallback.heading}
          </p>
          <p className="mt-1 flex-1 text-sm text-mist">{aiWorkforceFallback.body}</p>
          <Link
            href="/ai-workforce"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-4 text-sm font-semibold text-frost backdrop-blur-xl transition hover:border-passport-sky/50 sm:justify-start"
          >
            {aiWorkforceFallback.button}
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-center font-display text-xl font-semibold text-frost">
          AI Staffing plans
        </h3>
        <p className="mx-auto mt-1 max-w-md text-center text-sm text-mist">
          Pay monthly for however much AI staffing your business needs.
        </p>
        <div className="mt-6">
          <AiStaffingPricing />
        </div>
      </div>
    </section>
  );
}
