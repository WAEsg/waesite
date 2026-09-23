"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkArrow } from "@/components/ui/link-arrow";
import { buttonPrimary } from "@/components/ui/button-classes";

const TAPER = [
  { label: "Months 2–6", value: "8%", width: 100 },
  { label: "Months 7–12", value: "5.5%", width: 68.75 },
  { label: "Month 13+", value: "4%", width: 50 },
];

const ROWS = [
  { what: "Placement fee", pay: "One month's pay", note: "Ongoing roles only. Charged to you on a successful match. Talent pays nothing." },
  { what: "Ongoing platform fee", tag: "Client share", note: "Tapers the longer the engagement runs. The total fee (your share plus your Talent Partner's) has a combined minimum of S$45/month." },
  { what: "Project work", tag: "Client share", pay: "10% of project value", note: "No placement fee. Taken from milestone releases." },
  { what: "Optional plans", pay: "Starter S$79/month · Growth S$149/month", note: "Only if you hire often. Starter: limited postings, standard matching. Growth: unlimited postings, priority matching, dedicated support." },
  { what: "Urgent priority add-on", pay: "S$50–100 flat", note: "For 24–48hr matching, subject to available talent. If we can't find a suitable match, we'll let you know." },
  { what: "Buy-out option", pay: "After month 12", note: "Move to a fully direct relationship with your Talent Partner, with no ongoing platform fee." },
];

function TaperBar() {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid max-w-[340px] grid-cols-3 items-end gap-2.5">
      {TAPER.map((step, i) => (
        <div key={step.label} className="flex min-w-0 flex-col gap-1.5">
          <small className="font-mono text-[0.6875rem] font-bold tracking-[0.06em] text-slate uppercase">{step.label}</small>
          <b className="font-display text-xl font-bold tracking-[-0.01em] text-ink-navy">{step.value}</b>
          <span className="block h-1.5 overflow-hidden rounded-full bg-line" aria-hidden>
            <span
              className="block h-full origin-left rounded-full bg-gradient-to-r from-passport-sky to-voyage-blue transition-transform duration-[900ms] ease-out"
              style={{ width: `${step.width}%`, transform: isIn ? "scaleX(1)" : "scaleX(0)", transitionDelay: `${i * 160 + 250}ms` }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

export function ForHirersFees() {
  return (
    <div id="hirers-fees" className="scroll-mt-24 bg-frost px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <EyebrowLabel>What you&apos;ll pay</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            Your costs, in plain numbers
          </h2>
          <p className="mt-2 text-lede leading-[1.55] text-slate">
            Talent never pays to join or apply. You pay for what you use: an ongoing Team Extension or a one-off
            project, plus optional plans if you hire often.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white shadow-1">
          <table className="w-full min-w-[560px] border-collapse tabular-nums">
            <thead>
              <tr>
                {["What", "You pay", "Good to know"].map((h) => (
                  <th key={h} className="border-b border-line bg-frost px-[18px] py-[14px] text-left font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-slate uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.what} className="transition-colors hover:bg-frost">
                  <th scope="row" className="w-[24%] border-b border-line px-[18px] py-[14px] text-left font-extrabold text-ink-navy">
                    {row.what}
                    {row.tag && (
                      <span className="mt-1 block font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">{row.tag}</span>
                    )}
                  </th>
                  <td className="w-[33%] border-b border-line px-[18px] py-[14px] align-top text-ink-navy">
                    {row.what === "Ongoing platform fee" ? <TaperBar /> : <strong className="font-display text-lg font-bold text-ink-navy">{row.pay}</strong>}
                  </td>
                  <td className="border-b border-line px-[18px] py-[14px] align-top leading-[1.5] text-slate">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-[64ch] flex-1 text-sm text-slate">
            Month 1 has no ongoing platform fee listed; the placement fee applies on a successful match. Figures show
            your share only.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/signup?role=hirer" className={buttonPrimary}>
              Post a role
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <LinkArrow href="/pricing">Work out your exact cost</LinkArrow>
          </div>
        </div>
      </div>
    </div>
  );
}
