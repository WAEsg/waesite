"use client";

import { useState } from "react";
import { Check, Globe2, IdCard, Lock, RefreshCw, Shield, User, Users } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { Reveal } from "@/components/ui/reveal";
import { buttonGhostSm } from "@/components/ui/button-classes";

const POINTS = [
  { icon: Lock, title: "Talent isn't listed publicly", description: "You only see full profiles for candidates matched to your specific role. That keeps our vetted pool from being scraped or poached." },
  { icon: IdCard, title: "You verify too", description: "Every hirer and every Talent Partner is verified through Stripe Identity before they can post a role or apply to one, so both sides always know who they're working with." },
  { icon: Users, title: "A backup bench, just in case", description: "For every placement, we keep a shortlisted backup candidate on file for the first 90 days. If something falls through early on, you're not starting the search from zero." },
];

const GATE_STEPS = [
  { icon: IdCard, title: "Government ID submitted", note: "Required before anyone can apply to a role." },
  { icon: Shield, title: "Stripe Identity check", note: "A government-ID check backed by Stripe." },
  { icon: Check, title: "Verified", note: "Now they can apply, and be matched to your role." },
];

function VerificationGate({ replayKey }: { replayKey: number }) {
  return (
    <div key={replayKey} className="flex flex-col gap-5">
      <Reveal variant="scale" immediate>
        <div className="relative mx-auto w-full max-w-[280px] rounded-2xl border border-line bg-white p-4 shadow-2">
          <div className="flex items-center justify-between font-mono text-[0.5625rem] font-bold tracking-[0.14em] text-slate uppercase">
            <span>Government ID</span>
            <Globe2 className="h-4 w-4 text-passport-sky" aria-hidden />
          </div>
          <div className="mt-3 grid grid-cols-[22%_minmax(0,1fr)] items-center gap-x-3">
            <span className="flex aspect-[4/5] w-full items-center justify-center rounded-[10px] bg-cloud-blue text-voyage-blue">
              <User className="h-1/2 w-1/2" aria-hidden />
            </span>
            <span className="flex flex-col gap-1.5">
              <i className="block h-1.5 w-full rounded-full bg-line" />
              <i className="block h-1.5 w-4/5 rounded-full bg-line" />
              <i className="block h-1.5 w-3/5 rounded-full bg-line" />
            </span>
          </div>
          <p className="mt-3 truncate font-mono text-[0.5625rem] tracking-[0.06em] text-slate/70">
            P&lt;TALENT&lt;&lt;PARTNER&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          </p>
          <span
            className="absolute -top-3 -right-3 inline-flex flex-col items-center gap-0.5 rounded-[10px] border-[2.5px] px-3 py-1.5 font-mono text-[0.625rem] font-bold tracking-[0.16em] uppercase [border-style:double] [mix-blend-mode:multiply]"
            style={{ borderColor: "rgb(23,117,63)", color: "rgb(23,117,63)", transform: "rotate(-7deg)", background: "rgba(255,255,255,.6)" }}
          >
            Verified
            <span className="text-[0.5rem] tracking-[0.1em]">Stripe Identity</span>
          </span>
        </div>
      </Reveal>

      <ol className="flex flex-col gap-3">
        {GATE_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <Reveal key={step.title} variant="left" delayMs={150 + i * 120}>
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cloud-blue text-voyage-blue">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="flex flex-col gap-0.5 pt-1">
                  <b className="font-extrabold text-ink-navy">{step.title}</b>
                  <small className="text-sm text-slate">{step.note}</small>
                </span>
              </li>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}

export function ForHirersVetting() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div id="hirers-vetting" className="scroll-mt-24 bg-frost px-4 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-8">
          <div>
            <EyebrowLabel>How vetting works</EyebrowLabel>
            <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
              Verified before they can apply
            </h2>
            <p className="mt-2 text-lede leading-[1.55] text-slate">
              Before anyone can apply to a role, they verify their identity with Stripe Identity, a government-ID
              check backed by Stripe.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <Reveal key={point.title} variant="up" delayMs={i * 100}>
                  <div className="flex gap-4">
                    <span className="badge-ico flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold text-ink-navy">{point.title}</h3>
                      <p className="mt-1 text-slate">{point.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.6875rem] font-bold tracking-[0.14em] text-slate uppercase">Verification gate</span>
            <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-slate uppercase shadow-[inset_0_0_0_1px_#DCE7F7]">
              Example
            </span>
          </div>
          <div className="mt-6">
            <VerificationGate replayKey={replayKey} />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-mist pt-4">
            <p className="text-sm text-slate">Illustrative. The real check is run by Stripe Identity.</p>
            <button type="button" onClick={() => setReplayKey((k) => k + 1)} className={`${buttonGhostSm} group`}>
              <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" aria-hidden />
              Replay the check
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
