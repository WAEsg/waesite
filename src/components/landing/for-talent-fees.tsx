"use client";

import { useEffect, useRef, useState } from "react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkArrow } from "@/components/ui/link-arrow";

const TAPER = [
  { when: "Months 2–6", value: "4%", width: 100 },
  { when: "Months 7–12", value: "2.5%", width: 62.5 },
  { when: "Month 13+", value: "2%", width: 50 },
];

function TaperBars() {
  const ref = useRef<HTMLOListElement>(null);
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
    <ol ref={ref} className="grid grid-cols-3 gap-2.5">
      {TAPER.map((step, i) => (
        <li key={step.when} className={`flex min-w-0 flex-col gap-2 ${i > 0 ? "border-l-2 border-dashed border-mist pl-[clamp(10px,2vw,18px)]" : ""}`}>
          <span className="font-display text-[clamp(1.625rem,3.4vw,2.6rem)] leading-[1] font-extrabold tracking-[-0.03em] text-voyage-blue">
            {step.value}
          </span>
          <span
            className="block h-1.5 rounded-full bg-gradient-to-r from-passport-sky to-voyage-blue transition-transform duration-1000 ease-out"
            style={{ width: `${step.width}%`, transformOrigin: "left", transform: isIn ? "scaleX(1)" : "scaleX(0)", transitionDelay: `${i * 160 + 350}ms` }}
          />
          <span className="font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-slate uppercase">{step.when}</span>
        </li>
      ))}
    </ol>
  );
}

export function ForTalentFees() {
  return (
    <div className="bg-frost px-4 py-14">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <EyebrowLabel>What it costs you</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            Free to join. Free to apply. Free to be placed.
          </h2>
          <p className="mt-2 max-w-md text-slate">
            You pay only a small service fee once work is underway. It funds verification, backup coverage, and
            dispute support. The placement fee is charged to the hirer only.
          </p>
          <p className="mt-3">
            <LinkArrow href="/pricing">See full pricing</LinkArrow>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6">
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-slate uppercase">
              Ongoing work · your service fee tapers over time
            </p>
            <TaperBars />
            <p className="text-sm text-slate">
              The ongoing platform fee has a combined minimum: the percentage, or S$45/month across hirer and talent
              together, whichever is greater.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-6">
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-slate uppercase">Project work</p>
            <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5">
              <span className="font-display text-[clamp(1.625rem,3.4vw,2.6rem)] leading-[1] font-extrabold tracking-[-0.03em] text-voyage-blue">
                5%
              </span>
              <span className="max-w-[34ch] font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-slate uppercase">
                of project value, taken from milestone releases
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
