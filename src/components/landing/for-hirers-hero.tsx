"use client";

import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, Clock, Users } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { AccentUnderline } from "@/components/ui/accent-underline";
import { buttonPrimary, buttonSecondary } from "@/components/ui/button-classes";
import { Reveal } from "@/components/ui/reveal";
import { useRolePreference } from "@/lib/use-role-preference";

const CANDIDATES = [
  { initial: "A", name: "Amara", role: "Bookkeeper", route: "NBO", best: true },
  { initial: "D", name: "Diego", role: "Accountant", route: "BOG", best: false },
  { initial: "L", name: "Linh", role: "Bookkeeper", route: "SGN", best: false },
];

export function ForHirersHero() {
  const [role, setRole] = useRolePreference();

  return (
    <div
      className="px-4 pb-16 pt-16 sm:pt-20"
      style={{
        background:
          "radial-gradient(56% 72% at 92% 6%, var(--color-cloud-blue), transparent 72%), linear-gradient(180deg, var(--color-frost), var(--color-paper-white) 82%)",
      }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <EyebrowLabel dash>For hirers</EyebrowLabel>
          <h1 className="mt-3 text-balance font-display text-display leading-[1.02] font-extrabold tracking-[-0.03em] text-ink-navy">
            Hire in{" "}
            <span className="whitespace-nowrap">
              <span className="relative inline-block text-voyage-blue">
                days
                <AccentUnderline delayMs={450} viewBox="0 0 120 10" path="M3 6C24 2 52 9 78 5s28-2 39 1" />
              </span>
              ,
            </span>{" "}
            <span className="whitespace-nowrap">not months</span>
          </h1>
          <p className="mt-3 max-w-lg text-lede leading-[1.55] text-slate">
            Built for teams who need to move fast without a big HR department. Every candidate is identity-verified
            before they can apply, and your payment stays protected until work is actually delivered.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link href="/signup?role=hirer" onClick={() => setRole("hirer")} className={buttonPrimary}>
              Post a role
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/pricing" className={buttonSecondary}>
              See pricing
            </Link>
          </div>
          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5">
            <p className="flex items-start gap-2.5 text-sm text-slate">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-voyage-blue" aria-hidden />
              What happens next: create your account in about a minute, verify your ID, then post your role.
            </p>
            <p className="text-sm text-slate">Built for growing teams, from solo founders to established companies.</p>
            {role === "talent" && (
              <p className="text-sm text-slate">
                Looking for work instead?{" "}
                <Link href="/for-talent" className="font-bold text-voyage-blue">
                  Go to For talent
                </Link>
              </p>
            )}
          </div>
        </div>

        <Reveal variant="scale" delayMs={120} immediate>
          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="flex flex-col gap-3.5 rounded-2xl border border-line bg-white p-5 shadow-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-display text-lg font-bold tracking-[-0.01em] text-ink-navy">Your shortlist</span>
                <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-slate uppercase shadow-[inset_0_0_0_1px_#DCE7F7]">
                  Example
                </span>
              </div>
              <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
                Role · Bookkeeper · Ongoing Team Extension
              </p>
              <ol className="flex flex-col gap-2.5">
                {CANDIDATES.map((c) => (
                  <li
                    key={c.name}
                    className={`relative grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 rounded-2xl p-3.5 ${
                      c.best ? "bg-frost ring-2 ring-voyage-blue ring-offset-4 ring-offset-cloud-blue/40" : ""
                    }`}
                  >
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-full font-display font-bold ${
                        c.best ? "bg-voyage-blue text-white" : "bg-cloud-blue text-voyage-blue"
                      }`}
                    >
                      {c.initial}
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-ink-navy">{c.name}</span>
                        {c.best && (
                          <span className="rounded-full bg-voyage-blue px-2 py-0.5 font-mono text-[0.625rem] font-bold tracking-[0.06em] text-white uppercase">
                            Best fit
                          </span>
                        )}
                      </span>
                      <span className="flex flex-wrap items-center gap-2 text-sm text-slate">
                        {c.role}
                        <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-voyage-blue">
                          <i className="inline-block h-0 w-3.5 border-t-2 border-dotted border-passport-sky" aria-hidden />
                          {c.route}
                        </span>
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.06em] text-success uppercase">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      ID verified
                    </span>
                  </li>
                ))}
              </ol>
              <p className="flex items-center gap-2.5 rounded-lg bg-frost px-3 py-2.5 text-sm text-slate">
                <Users className="h-4 w-4 shrink-0 text-voyage-blue" aria-hidden />
                Backup candidate kept on file for 90 days
              </p>
            </div>

            <div className="waework-float absolute -right-3 -bottom-7 w-52" style={{ animationDelay: "-2s" }}>
              <div className="inline-flex max-w-full items-stretch overflow-hidden rounded-[14px] border border-line bg-white font-mono shadow-2">
                <div className="flex min-w-0 flex-col gap-1 px-3.5 py-2.5">
                  <span className="flex items-center gap-2 text-[0.8125rem] font-bold tracking-[0.06em] text-ink-navy">
                    SIN
                    <i className="inline-block h-0 w-[18px] border-t-2 border-dotted border-passport-sky" aria-hidden />
                    NBO
                  </span>
                  <span className="text-[0.6875rem] tracking-[0.03em] text-slate">Best fit · ID verified</span>
                </div>
                <div className="flex shrink-0 items-center justify-center border-l-2 border-dashed border-mist bg-success-bg px-3 text-success">
                  <Check className="h-4 w-4 stroke-[2.6]" aria-hidden />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-9 text-center font-mono text-xs tracking-[0.04em] text-slate">
            Illustrative example. Not real people or a real role.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
