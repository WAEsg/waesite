"use client";

import { useEffect, useRef, useState } from "react";
import { Check, IdCard, TrendingUp } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkArrow } from "@/components/ui/link-arrow";
import { useRolePreference } from "@/lib/use-role-preference";

type Step = {
  number: string;
  title: string;
  description: string;
  detailLabel: string;
  detail: React.ReactNode;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "Tell us what you need",
    description: "Post a project or an ongoing role in minutes. Describe the work, budget, and timeline.",
    detailLabel: "What goes in your post",
    detail: (
      <ul className="flex flex-wrap gap-2">
        {["Scope", "Budget", "Timeline"].map((label) => (
          <li
            key={label}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white py-[7px] pr-3.5 pl-[7px] font-mono text-[0.8125rem] font-bold tracking-[0.04em] text-ink-navy"
          >
            <Check className="h-[22px] w-[22px] rounded-full bg-success-bg p-[5px] stroke-[3.2] text-success" aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    ),
  },
  {
    number: "02",
    title: "We vet and match talent",
    description:
      "Every profile is identity-verified with Stripe Identity, and we surface the best-fit Talent Partners from a global pool.",
    detailLabel: "How identity is checked",
    detail: (
      <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2.5">
        <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-white shadow-[inset_0_0_0_1px_#DCE7F7]">
          <IdCard className="h-[22px] w-[22px] text-voyage-blue" aria-hidden />
        </span>
        <span className="flex min-w-[130px] flex-1 flex-col gap-0.5">
          <strong className="leading-[1.2] font-extrabold text-ink-navy">Stripe Identity</strong>
          <span className="font-mono text-xs tracking-[0.02em] text-slate">Government-ID check</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-[11px] py-[5px] font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-success uppercase">
          <Check className="h-3.5 w-3.5" aria-hidden />
          Verified
        </span>
      </div>
    ),
  },
  {
    number: "03",
    title: "Start small, scale once it's working",
    description:
      "Begin with a single project. Funds are held via Stripe Connect and released on a schedule that matches the work. Once it's working, extend it into an ongoing role, which we call a Team Extension.",
    detailLabel: "How it grows",
    detail: (
      <div
        className="inline-flex max-w-full items-stretch overflow-hidden rounded-[14px] border border-line bg-white font-mono shadow-1"
      >
        <div className="flex min-w-0 flex-col gap-1 px-3.5 py-2.5">
          <span className="flex flex-wrap items-center gap-2 text-[0.8125rem] font-bold tracking-[0.06em] text-ink-navy">
            PROJECT
            <i className="inline-block h-0 w-[18px] border-t-2 border-dotted border-passport-sky" aria-hidden />
            TEAM EXTENSION
          </span>
          <span className="text-[0.6875rem] tracking-[0.03em] text-slate">Extend it once it&apos;s working</span>
        </div>
        <div className="flex shrink-0 items-center justify-center border-l-2 border-dashed border-mist bg-success-bg px-3 text-success">
          <TrendingUp className="h-4 w-4 stroke-[2.6]" aria-hidden />
        </div>
      </div>
    ),
  },
];

function StepRow({ step }: { step: Step }) {
  const ref = useRef<HTMLLIElement>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className="group grid grid-cols-[clamp(64px,9vw,116px)_minmax(0,1.15fr)_minmax(0,0.85fr)] items-start gap-x-[clamp(18px,3.4vw,48px)] gap-y-4 pt-[clamp(24px,3vw,34px)] max-lg:grid-cols-[clamp(56px,11vw,88px)_minmax(0,1fr)] max-sm:grid-cols-1"
    >
      <span
        aria-hidden
        className="font-display text-[clamp(3rem,4.6vw+1rem,5rem)] leading-[0.85] font-extrabold tracking-[-0.04em] text-mist transition-[color,transform] duration-500 tabular-nums group-hover:-translate-y-[3px] group-hover:text-passport-sky max-sm:text-[2.75rem]"
        style={isIn ? { animation: "hw-up 0.7s cubic-bezier(.16,1,.3,1) backwards" } : { opacity: 0 }}
      >
        {step.number}
      </span>
      <div
        className="flex min-w-0 flex-col gap-2.5"
        style={isIn ? { animation: "hw-up 0.8s cubic-bezier(.16,1,.3,1) 80ms backwards" } : { opacity: 0 }}
      >
        <span className="font-mono text-xs font-bold tracking-[0.14em] text-voyage-blue uppercase">STEP {step.number}</span>
        <h3 className="text-balance font-display text-[clamp(1.375rem,1vw+1.1rem,1.75rem)] leading-[1.15] font-bold tracking-[-0.02em] text-ink-navy">
          {step.title}
        </h3>
        <p className="max-w-[54ch] text-[1.0625rem] text-slate">{step.description}</p>
      </div>
      <div
        className="min-w-0 max-lg:col-span-2 max-sm:col-span-1"
        style={isIn ? { animation: "hw-slide 0.8s cubic-bezier(.16,1,.3,1) 200ms backwards" } : { opacity: 0 }}
      >
        <div className="flex min-w-0 flex-col items-start gap-3 rounded-2xl border border-dashed border-mist bg-frost p-4">
          <span className="font-mono text-[0.6875rem] font-bold tracking-[0.14em] text-slate uppercase">{step.detailLabel}</span>
          {step.detail}
        </div>
      </div>
    </li>
  );
}

export function HowItWorksSteps() {
  const [role] = useRolePreference();

  return (
    <div id="how-it-works-steps" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <EyebrowLabel>The three steps</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            What happens, and in what order
          </h2>
          <p className="mt-2 text-lede leading-[1.55] text-slate">
            You describe the work. We verify and match. You start small, and scale once it&apos;s working.
          </p>
        </div>

        <ol className="mt-2 flex flex-col gap-[clamp(30px,4.5vw,56px)]">
          {STEPS.map((step) => (
            <StepRow key={step.number} step={step} />
          ))}
        </ol>

        <div className="mt-[clamp(32px,4.5vw,56px)] flex flex-col items-start gap-3 rounded-2xl border border-line bg-frost p-5 sm:flex-row sm:items-center sm:gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-voyage-blue shadow-[inset_0_0_0_1px_#DCE7F7]">
            <TrendingUp className="h-5 w-5" aria-hidden />
          </span>
          {role === "talent" ? (
            <p className="min-w-0 flex-1 text-slate">
              <strong className="text-ink-navy">Looking for work?</strong> It&apos;s free to join. Verify your identity with
              Stripe Identity, then apply to any open role.
            </p>
          ) : (
            <p className="min-w-0 flex-1 text-slate">
              <strong className="text-ink-navy">Hiring?</strong> Step 1 takes minutes. Post your first role and we&apos;ll
              take it from there.
            </p>
          )}
          <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {role === "talent" ? (
              <>
                <LinkArrow href="/signup?role=talent">Become a Talent Partner</LinkArrow>
                <LinkArrow href="/for-talent" quiet>
                  See the guide for talent
                </LinkArrow>
              </>
            ) : (
              <>
                <LinkArrow href="/signup?role=hirer">Post a role</LinkArrow>
                <LinkArrow href="/for-hirers" quiet>
                  See the guide for hirers
                </LinkArrow>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
