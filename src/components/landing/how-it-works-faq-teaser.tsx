"use client";

import { useState } from "react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkArrow } from "@/components/ui/link-arrow";

const QUESTIONS = [
  {
    q: "How much does WaeWork cost?",
    a: (
      <>
        <p>
          Talent never pays to join or apply. For an ongoing Team Extension, the client pays a placement fee of one
          month&apos;s pay on a successful match. After that, an ongoing platform fee tapers the longer the engagement
          runs: 12% in months 2–6, 8% in months 7–12 and 6% from month 13, split between client and talent (or
          S$45/month combined, whichever is greater).
        </p>
        <p>Project work is 15% of the total project value, split 10% client and 5% talent, with no separate placement fee.</p>
        <LinkArrow href="/pricing">See full pricing</LinkArrow>
      </>
    ),
  },
  {
    q: "Can I browse individual talent profiles before signing up?",
    a: (
      <>
        <p>
          No. Talent isn&apos;t listed publicly. You see full profiles only for candidates matched to your specific
          role, which keeps our vetted pool from being scraped or poached. You can browse role categories at any time.
        </p>
        <LinkArrow href="/for-talent">Browse role categories</LinkArrow>
      </>
    ),
  },
  {
    q: "Is WaeWork limited to specific countries?",
    a: <p>No. WaeWork is worldwide on both sides: hirers and Talent Partners can be located anywhere in the world.</p>,
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
            className={`relative h-8 w-8 shrink-0 rounded-full transition-[background-color,transform] duration-500 ${
              isOpen ? "rotate-180 bg-voyage-blue" : "bg-cloud-blue"
            }`}
          >
            <span
              className={`absolute top-1/2 left-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm ${isOpen ? "bg-white" : "bg-voyage-blue"}`}
            />
            <span
              className={`absolute top-1/2 left-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm transition-transform duration-500 ${
                isOpen ? "rotate-0 bg-white" : "rotate-90 bg-voyage-blue"
              }`}
            />
          </span>
        </button>
      </h3>
      <div
        className="grid transition-[grid-template-rows] duration-[450ms] ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex max-w-[68ch] flex-col gap-3 pb-[22px] text-slate">{a}</div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorksFaqTeaser() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div id="how-it-works-faq" className="scroll-mt-24 bg-frost px-4 py-14">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-start">
        <div>
          <EyebrowLabel>Quick answers</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            Three things people ask next
          </h2>
          <p className="mt-2 text-slate">Short answers here. The FAQ page covers verification, disputes and more.</p>
          <div className="mt-3">
            <LinkArrow href="/faq">Read all FAQs</LinkArrow>
          </div>
        </div>

        <div className="border-t border-line">
          {QUESTIONS.map((item, i) => (
            <AccordionItem
              key={item.q}
              q={item.q}
              a={item.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((current) => (current === i ? -1 : i))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
