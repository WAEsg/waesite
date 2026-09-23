"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Briefcase, RefreshCw, Shield, User } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { buttonGhost, buttonGhostSm, buttonPrimary } from "@/components/ui/button-classes";
import { useRolePreference } from "@/lib/use-role-preference";

const JUMP_LINKS = [
  { id: "how-it-works-steps", label: "The three steps" },
  { id: "how-it-works-release", label: "How payment is released" },
  { id: "how-it-works-protect", label: "What protects you" },
];

// Base delay before the vignette's timeline starts, once it scrolls into
// view — matches the prototype's --hw-t0: 700ms.
const T0 = 700;

function MatchVignette({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIn, setIsIn] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const a = (name: string, duration: string, delayMs: number, fill: "backwards" | "forwards" = "backwards") =>
    isIn && !reduced ? { animation: `${name} ${duration} ${delayMs === 0 ? "" : `${delayMs}ms `}${fill}`.trim() } : undefined;

  return (
    <div
      ref={ref}
      className="relative mx-auto grid w-full max-w-[520px] overflow-hidden rounded-2xl border border-line p-6 pb-8"
      style={{
        background:
          "radial-gradient(var(--color-mist) 1px, transparent 1.5px) 0 0 / 18px 18px, linear-gradient(160deg, var(--color-cloud-blue), var(--color-frost) 68%)",
      }}
      role="img"
      aria-label="Illustration: a hirer's request for a bookkeeper is vetted and matched with an identity-verified Talent Partner in Manila."
    >
      {/* Request card */}
      <div
        className="relative z-[1] w-[min(100%,max(80%,280px))] justify-self-start rounded-2xl border border-line bg-white shadow-2"
        style={isIn ? { animation: `hw-rise 0.7s cubic-bezier(.16,1,.3,1) backwards` } : undefined}
      >
        <div className="flex flex-col gap-3 px-[18px] py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 font-mono text-[0.6875rem] font-bold tracking-[0.14em] text-voyage-blue uppercase">
              <Briefcase className="h-[15px] w-[15px]" aria-hidden />
              Your request
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-[11px] py-[5px] font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-slate uppercase shadow-[inset_0_0_0_1px_#DCE7F7]">
              One-off project
            </span>
          </div>
          <dl className="m-0 flex flex-col">
            {[
              ["Role", "Bookkeeper"],
              ["Budget", "S$1,500"],
              ["Timeline", "4 weeks"],
            ].map(([dt, dd], i) => (
              <div
                key={dt}
                className="flex items-baseline justify-between gap-3 border-t border-dashed border-line py-[9px] last:pb-0.5"
                style={isIn ? { animation: `hw-row 0.5s cubic-bezier(.16,1,.3,1) ${260 + i * 110}ms backwards` } : undefined}
              >
                <dt className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-slate uppercase">{dt}</dt>
                <dd className="m-0 text-right font-mono text-[0.8125rem] font-bold tracking-[0.02em] text-ink-navy tabular-nums">{dd}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Connector: draws from request card to talent card, gate icon pops mid-way */}
      <div className="relative z-[2] -my-2 h-[84px] w-[120px] justify-self-center">
        <svg viewBox="0 0 120 84" width="120" height="84" className="block overflow-visible">
          <path
            d="M14 6C14 48 106 36 106 78"
            fill="none"
            stroke="var(--color-mist)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray=".1 7"
          />
          <path
            d="M14 6C14 48 106 36 106 78"
            fill="none"
            stroke="var(--color-voyage-blue)"
            strokeWidth={2.5}
            strokeLinecap="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: isIn ? 0 : 1,
              transition: isIn && !reduced ? `stroke-dashoffset 1.1s cubic-bezier(.65,0,.35,1) ${T0}ms` : undefined,
            }}
          />
          <circle cx={14} cy={6} r={4.5} fill="var(--color-paper-white)" stroke="var(--color-voyage-blue)" strokeWidth={2} />
          <circle
            cx={106}
            cy={78}
            r={9}
            fill="none"
            stroke="var(--color-voyage-blue)"
            strokeWidth={2}
            style={a("hw-ring", "0.7s cubic-bezier(.16,1,.3,1)", T0 + 1050, "forwards")}
          />
          <circle cx={106} cy={78} r={4.5} fill="var(--color-voyage-blue)" stroke="var(--color-paper-white)" strokeWidth={2} style={a("hw-fade", "0.25s linear", T0)} />
        </svg>
        <span
          className="absolute top-1/2 left-1/2 -mt-[17px] -ml-[17px] grid h-[34px] w-[34px] place-items-center rounded-full border border-line bg-white text-voyage-blue shadow-1"
          style={a("hw-pop", "0.6s cubic-bezier(.34,1.56,.64,1)", T0 + 480)}
        >
          <Shield className="h-4 w-4 stroke-[2.2]" aria-hidden />
        </span>
        <span
          className="absolute top-[18px] left-[calc(50%+30px)] w-24 font-mono text-[0.6875rem] leading-[1.35] font-bold tracking-[0.12em] text-slate uppercase"
          style={a("hw-fade", "0.5s cubic-bezier(.16,1,.3,1)", T0 + 620)}
        >
          Vetted + matched
        </span>
      </div>

      {/* Talent card */}
      <div
        className="relative z-[1] w-[min(100%,max(80%,280px))] justify-self-end rounded-2xl border border-line bg-white shadow-2"
        style={isIn ? { animation: `hw-slide 0.75s cubic-bezier(.16,1,.3,1) ${T0 + 850}ms backwards` } : undefined}
      >
        <div
          className="flex flex-col gap-3 px-[18px] py-4"
          style={isIn ? { animation: `hw-impact 0.4s cubic-bezier(.16,1,.3,1) ${T0 + 1860}ms` } : undefined}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 font-mono text-[0.6875rem] font-bold tracking-[0.14em] text-voyage-blue uppercase">
              <User className="h-[15px] w-[15px]" aria-hidden />
              Matched talent
            </span>
            <span className="inline-flex items-center gap-[7px] font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-slate">
              SIN
              <i className="inline-block h-0 w-4 border-t-2 border-dotted border-passport-sky" aria-hidden />
              MNL
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-cloud-blue font-display font-bold text-voyage-blue">
              M
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <strong className="font-display text-lg leading-[1.1] font-bold tracking-[-0.01em] text-ink-navy">Maria</strong>
              <span className="text-sm leading-[1.3] text-slate">Bookkeeper · Manila</span>
            </span>
          </div>
          <div className="flex min-h-[50px] items-center justify-between gap-3 border-t border-dashed border-line pt-2.5">
            <span className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-slate uppercase">ID check</span>
            <span
              className="relative -my-0.5 mr-0.5 inline-flex"
              style={a("hw-thump", "0.65s cubic-bezier(.34,1.56,.64,1)", T0 + 1550)}
            >
              <span
                aria-hidden
                className="absolute -inset-1 rounded-[14px] border-2 border-success"
                style={a("hw-ring", "0.7s cubic-bezier(.16,1,.3,1)", T0 + 1880, "forwards")}
              />
              <span
                className="inline-flex flex-col items-center gap-0.5 rounded-[10px] border-[2.5px] px-3.5 py-2 font-mono text-xs font-bold tracking-[0.16em] uppercase [border-style:double] [mix-blend-mode:multiply]"
                style={{ borderColor: "rgb(23,117,63)", color: "rgb(23,117,63)", background: "rgba(255,255,255,.6)" }}
              >
                Verified
                <span className="text-[0.625rem] tracking-[0.12em]">Stripe Identity</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorksHero() {
  const [role, setRole] = useRolePreference();
  const [replayKey, setReplayKey] = useState(0);
  const reduced = !!useReducedMotion();

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
          <EyebrowLabel dash>How it works</EyebrowLabel>
          <h1 className="mt-3 text-balance font-display text-display leading-[1.02] font-extrabold tracking-[-0.03em] text-ink-navy">
            Three steps from posting a role to <em className="text-voyage-blue not-italic">work starting</em>
          </h1>
          <p className="mt-3 max-w-lg text-lede leading-[1.55] text-slate">
            Tell us what you need, get matched with a vetted, identity-verified Talent Partner, and start small, with
            protection built in at every stage.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {role === "talent" ? (
              <>
                <Link href="/signup?role=talent" onClick={() => setRole("talent")} className={buttonPrimary}>
                  Become a Talent Partner
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/signup?role=hirer" onClick={() => setRole("hirer")} className={buttonGhost}>
                  I&apos;m hiring
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup?role=hirer" onClick={() => setRole("hirer")} className={buttonPrimary}>
                  Post a role
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/signup?role=talent" onClick={() => setRole("talent")} className={buttonGhost}>
                  I&apos;m looking for work
                </Link>
              </>
            )}
          </div>

          <nav aria-label="On this page" className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
            <span className="mb-0.5 basis-full font-mono text-[0.6875rem] font-bold tracking-[0.14em] text-slate uppercase">
              On this page
            </span>
            {JUMP_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="group inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-line bg-white py-2 pr-3.5 pl-4 font-bold text-ink-navy transition-[transform,border-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-passport-sky hover:text-voyage-blue hover:shadow-1 active:scale-[0.98]"
              >
                {link.label}
                <ArrowRight className="h-4 w-4 rotate-90 text-voyage-blue transition-transform duration-300 group-hover:translate-x-[3px]" aria-hidden />
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <MatchVignette key={replayKey} reduced={reduced} />
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <p className="min-w-[220px] flex-1 font-mono text-[0.6875rem] leading-[1.5] text-slate">
              Illustrative example. You only see full profiles for candidates matched to your role.
            </p>
            <button
              type="button"
              onClick={() => setReplayKey((k) => k + 1)}
              className={`${buttonGhostSm} group -mr-2`}
            >
              <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" aria-hidden />
              Replay animation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
