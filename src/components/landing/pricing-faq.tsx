"use client";

import { useState } from "react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkArrow } from "@/components/ui/link-arrow";

const QUESTIONS = [
  {
    q: "When is the placement fee charged?",
    a: (
      <>
        <p>On a successful match for an ongoing Team Extension. It is one month&apos;s pay, charged to the client only. Talent pays nothing.</p>
        <p>Project-based work has no separate placement fee.</p>
      </>
    ),
  },
  {
    q: "What is the S$45 minimum?",
    a: (
      <>
        <p>
          The ongoing platform fee is the percentage for your stage (12%, 8% or 6%) or S$45/month combined, whichever
          is greater. It only comes into play at lower monthly pay.
        </p>
        <p>S$45 is one combined minimum for client and talent together. We haven&apos;t set how it&apos;s split yet.</p>
      </>
    ),
  },
  {
    q: "Can we go direct later?",
    a: (
      <>
        <p>
          Yes. A buy-out option is available after month 12 for a fully direct relationship with your Talent
          Partner, with no ongoing platform fee.
        </p>
        <LinkArrow href="/contact?topic=hiring">Ask us about a buy-out</LinkArrow>
      </>
    ),
  },
  {
    q: "Does talent ever pay to join?",
    a: (
      <>
        <p>No. WaeWork never charges talent to join, apply or be placed.</p>
        <p>
          Once work is underway there is a small service fee: 4% in months 2–6, 2.5% in months 7–12 and 2% from
          month 13 on an ongoing Team Extension, or 5% on project work. It funds verification, backup coverage and
          dispute support.
        </p>
      </>
    ),
  },
];

function AccordionItem({ q, a, isOpen, onToggle }: { q: string; a: React.ReactNode; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          className="flex min-h-11 w-full items-center justify-between gap-4 py-4 text-left font-display font-bold text-ink-navy transition-colors hover:text-voyage-blue"
        >
          {q}
          <span
            aria-hidden
            className={`relative h-8 w-8 shrink-0 rounded-full transition-[background-color,transform] duration-500 ${isOpen ? "rotate-180 bg-voyage-blue" : "bg-cloud-blue"}`}
          >
            <span className={`absolute top-1/2 left-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm ${isOpen ? "bg-white" : "bg-voyage-blue"}`} />
            <span
              className={`absolute top-1/2 left-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm transition-transform duration-500 ${
                isOpen ? "rotate-0 bg-white" : "rotate-90 bg-voyage-blue"
              }`}
            />
          </span>
        </button>
      </h3>
      <div className="grid transition-[grid-template-rows] duration-[450ms] ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
        <div className="min-h-0 overflow-hidden">
          <div className="flex max-w-[68ch] flex-col gap-3 pb-[22px] text-slate">{a}</div>
        </div>
      </div>
    </div>
  );
}

export function PricingFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="px-4 py-14">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-start">
        <div>
          <EyebrowLabel>Pricing questions</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            The short answers
          </h2>
          <div className="mt-3">
            <LinkArrow href="/faq">See all questions</LinkArrow>
          </div>
        </div>

        <div className="border-t border-line">
          {QUESTIONS.map((item, i) => (
            <AccordionItem key={item.q} q={item.q} a={item.a} isOpen={openIndex === i} onToggle={() => setOpenIndex((c) => (c === i ? -1 : i))} />
          ))}
        </div>
      </div>
    </div>
  );
}
