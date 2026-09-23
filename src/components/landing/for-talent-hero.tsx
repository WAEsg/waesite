"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, Check, MapPin, Wallet } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { buttonGhost, buttonPrimary } from "@/components/ui/button-classes";
import { Reveal } from "@/components/ui/reveal";
import { useRolePreference } from "@/lib/use-role-preference";

const CHECKS = [
  { title: "Identity verified", note: "Government-ID check, Stripe Identity" },
  { title: "Matched to a hirer", note: "Ongoing Team Extension" },
  { title: "Payment protected", note: "Held via Stripe Connect" },
];

const TRUST = ["No fee to join, apply or be placed", "Hirers are ID-verified too", "Paid every 15 days on ongoing roles"];

export function ForTalentHero() {
  const [role, setRole] = useRolePreference();

  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-16 sm:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[28%] -right-[12%] -z-10 aspect-square w-[min(820px,110vw)] rounded-full"
        style={{ background: "radial-gradient(closest-side, var(--color-cloud-blue), transparent 72%)" }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <EyebrowLabel>For talent</EyebrowLabel>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-success uppercase">
              <Check className="h-3.5 w-3.5" aria-hidden />
              Free to join
            </span>
          </div>
          <h1 className="mt-3 text-balance font-display text-display leading-[1.02] font-extrabold tracking-[-0.03em] text-ink-navy">
            Become a Talent Partner, <em className="text-voyage-blue not-italic">wherever you are</em>
          </h1>
          <p className="mt-3 max-w-lg text-lede leading-[1.55] text-slate">
            Free to join. WaeWork never charges talent to be placed. Get matched to project-based work or an ongoing
            role (a Team Extension) with hirers worldwide, with payment protection from day one.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link href="/signup?role=talent" onClick={() => setRole("talent")} className={buttonPrimary}>
              Get started — it&apos;s free
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/how-it-works" className={buttonGhost}>
              See how it works
            </Link>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 stroke-[2.4] text-success" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          {role === "hirer" && (
            <p className="mt-5 flex max-w-[56ch] items-start gap-2.5 rounded-lg bg-alert-bg px-3.5 py-3 text-[0.9375rem] font-bold text-alert shadow-[inset_0_0_0_1px_#F5C56B]">
              <Briefcase className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                You told us you&apos;re hiring. This page is written for talent, but the role categories below are the
                same ones you hire from.{" "}
                <Link href="/signup?role=hirer" onClick={() => setRole("hirer")} className="font-extrabold">
                  Post a role
                </Link>{" "}
                or{" "}
                <Link href="/for-hirers" className="font-extrabold">
                  go to the page for hirers
                </Link>
                .
              </span>
            </p>
          )}
        </div>

        <Reveal variant="scale" delayMs={100} immediate>
          <div className="relative mx-auto w-full max-w-[400px] pb-9">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-2 transition-transform duration-300 hover:-translate-y-[5px] hover:-rotate-[0.6deg]">
              <div className="flex items-center justify-between border-b-2 border-dashed border-mist pb-3.5 text-sm">
                <span className="text-slate">Talent Partner</span>
                <span className="inline-flex items-center gap-2 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-voyage-blue">
                  MNL
                  <i className="inline-block h-0 w-5 border-t-2 border-dotted border-passport-sky" aria-hidden />
                  SIN
                </span>
              </div>
              <div className="flex items-center gap-3.5 pt-4">
                <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-cloud-blue font-display text-xl font-bold text-voyage-blue">
                  M
                  <span className="absolute right-0 bottom-0 h-4 w-4 rounded-full border-[3px] border-white bg-success" />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-display text-xl font-extrabold tracking-[-0.02em] text-ink-navy">Maria</span>
                  <span className="font-bold text-slate">Bookkeeper</span>
                  <span className="flex items-center gap-1 text-sm text-slate">
                    <MapPin className="h-[15px] w-[15px] text-voyage-blue" aria-hidden />
                    Manila
                  </span>
                </div>
              </div>
              <ul className="mt-4 flex flex-col gap-3">
                {CHECKS.map((c) => (
                  <li key={c.title} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full bg-success-bg text-success">
                      <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden />
                    </span>
                    <span className="flex flex-col">
                      <b className="font-extrabold text-ink-navy">{c.title}</b>
                      <small className="text-[0.8125rem] text-slate">{c.note}</small>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-3.5 border-t-2 border-dashed border-mist pt-3.5">
                <span className="h-[26px] flex-1 rounded-sm bg-[repeating-linear-gradient(90deg,#172B4D_0,#172B4D_2px,transparent_2px,transparent_5px)] opacity-20" />
                <span className="font-mono text-[0.625rem] font-bold tracking-[0.14em] whitespace-nowrap text-slate">WW · TP · EXAMPLE</span>
              </div>
              <span
                className="absolute top-[66px] right-4 inline-flex flex-col items-center gap-0.5 rounded-[10px] border-[2.5px] px-3 py-1.5 font-mono text-[0.625rem] font-bold tracking-[0.16em] uppercase [border-style:double] [mix-blend-mode:multiply]"
                style={{ borderColor: "rgb(23,117,63)", color: "rgb(23,117,63)", transform: "rotate(-7deg)", background: "rgba(255,255,255,.6)" }}
              >
                Verified
                <span className="text-[0.5rem] tracking-[0.1em]">Stripe Identity</span>
              </span>
            </div>

            <div className="waework-float absolute -left-6 bottom-0 z-[2] w-56" style={{ animationDelay: "-1.5s" }}>
              <div className="flex items-center gap-3 rounded-2xl bg-ink-navy py-3 pr-[18px] pl-3 text-white shadow-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-success-bg text-success">
                  <Wallet className="h-[18px] w-[18px] stroke-[2.2]" aria-hidden />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <b className="text-[0.9375rem] font-extrabold">Payment released</b>
                  <small className="font-mono text-[0.625rem] font-bold tracking-[0.1em] text-mist uppercase">Day 15 · partial release</small>
                </span>
              </div>
            </div>
          </div>
          <p className="mx-auto max-w-[42ch] text-center text-[0.8125rem] text-slate">
            Illustrative profile. Talent isn&apos;t listed publicly. Only hirers you&apos;re matched with see yours.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
