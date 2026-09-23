"use client";

import { useState } from "react";
import { Check, Lock, Wallet } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkArrow } from "@/components/ui/link-arrow";
import { ReleaseTimeline, type ReleaseStage } from "@/components/ui/release-timeline";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useRolePreference, type SiteRole } from "@/lib/use-role-preference";

const ONGOING_STAGES: ReleaseStage[] = [
  { icon: <Lock className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Day 0", what: "Funds held", note: "Held via Stripe Connect, not paid out upfront." },
  { icon: <Wallet className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Day 15", what: "Partial release", note: "Part of the payment is released to the Talent Partner." },
  { icon: <Check className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Day 30", what: "Remainder released", note: "The rest is released." },
];

const PROJECT_STAGES: ReleaseStage[] = [
  { icon: <Lock className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Start", what: "Funds held", note: "Held via Stripe Connect, not paid out upfront." },
  { icon: <Wallet className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Release 1", what: "Milestone 1", note: "Released when the first agreed milestone is approved." },
  { icon: <Wallet className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Release 2", what: "Milestone 2", note: "Released when the second agreed milestone is approved." },
  { icon: <Check className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Final release", what: "Final milestone", note: "The remainder is released when the final milestone is approved." },
];

function RoleTick({ role, activeRole, label, note }: { role: "hirer" | "talent"; activeRole: SiteRole; label: string; note: string }) {
  const active = role === activeRole;
  return (
    <li className="flex items-start gap-2.5">
      <Check className="mt-0.5 h-4 w-4 shrink-0 stroke-[2.4] text-success" aria-hidden />
      <span className={active ? "text-ink-navy" : "text-slate"}>
        <strong className="text-ink-navy">{label}</strong> {note}{" "}
        {active && (
          <span className="ml-1 inline-flex translate-y-[1px] items-center rounded-full bg-success-bg px-2.5 py-0.5 font-mono text-[0.6875rem] font-bold tracking-[0.06em] text-success uppercase">
            That&apos;s you
          </span>
        )}
      </span>
    </li>
  );
}

export function HowItWorksPayment() {
  const [mode, setMode] = useState<"ongoing" | "project">("ongoing");
  const [role] = useRolePreference();

  return (
    <div id="how-it-works-release" className="scroll-mt-24 bg-frost px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <EyebrowLabel>Payment protection</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            How payment is released
          </h2>
          <p className="mt-2 text-lede leading-[1.55] text-slate">
            Funds are held via Stripe Connect, not paid out upfront. When they&apos;re released depends on the kind of
            work.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-1">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-frost p-5">
            <span className="font-extrabold text-ink-navy">What kind of work is it?</span>
            <SegmentedControl
              options={[
                { value: "ongoing", label: "Ongoing Team Extension" },
                { value: "project", label: "One-off project" },
              ]}
              value={mode}
              onChange={setMode}
            />
          </div>

          <div className="flex flex-col gap-[clamp(24px,3.2vw,38px)] p-[clamp(18px,3vw,36px)] pt-[clamp(22px,3.2vw,38px)]">
            {mode === "ongoing" ? (
              <>
                <div className="flex flex-wrap items-center gap-3.5">
                  <h3 className="font-display text-xl font-bold text-ink-navy">Ongoing Team Extension</h3>
                  <span className="rounded-full bg-cloud-blue px-[11px] py-[5px] font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-voyage-blue uppercase">
                    Released every 15 days
                  </span>
                </div>
                <ReleaseTimeline stages={ONGOING_STAGES} />
                <div className="grid gap-6 sm:grid-cols-[1.1fr_0.9fr] sm:items-start">
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-slate">
                      For an ongoing Team Extension, funds are held and released every 15 days: partial at day 15, the
                      rest at day 30. That way neither side is exposed to a full month of risk.
                    </p>
                    <LinkArrow href="/pricing">See fees for ongoing roles</LinkArrow>
                  </div>
                  <ul className="flex flex-col gap-3.5">
                    <RoleTick role="hirer" activeRole={role} label="Hirers:" note="you're never paying a full month for work you haven't seen." />
                    <RoleTick role="talent" activeRole={role} label="Talent Partners:" note="you're never working a full month unpaid." />
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3.5">
                  <h3 className="font-display text-xl font-bold text-ink-navy">One-off project</h3>
                  <span className="rounded-full bg-cloud-blue px-[11px] py-[5px] font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-voyage-blue uppercase">
                    Released by milestone
                  </span>
                </div>
                <ReleaseTimeline stages={PROJECT_STAGES} />
                <div className="grid gap-6 sm:grid-cols-[1.1fr_0.9fr] sm:items-start">
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-slate">
                      For project-based work, release is tied to milestones you agree on. Funds are released as each
                      agreed milestone is approved.
                    </p>
                    <p className="text-sm text-slate">Example shown with three milestones. Yours are agreed upfront, before work starts.</p>
                    <LinkArrow href="/pricing">See fees for one-off projects</LinkArrow>
                  </div>
                  <ul className="flex flex-col gap-3.5">
                    <RoleTick
                      role="hirer"
                      activeRole={role}
                      label="Hirers:"
                      note="you agree the milestones, so you can start small and scale up once it's working."
                    />
                    <RoleTick role="talent" activeRole={role} label="Talent Partners:" note="milestones are agreed upfront with your hirer." />
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
