"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, X, MessageCircle } from "lucide-react";
import { LinkArrow } from "@/components/ui/link-arrow";
import { buttonPrimary } from "@/components/ui/button-classes";

type Category = "trust" | "payments" | "pricing" | "start";
const CATEGORY_LABEL: Record<Category, string> = {
  trust: "Trust & verification",
  payments: "Payments",
  pricing: "Pricing",
  start: "Getting started",
};

type FaqItem = {
  cats: Category[];
  keywords: string;
  q: string;
  a: React.ReactNode;
};

const ITEMS: FaqItem[] = [
  {
    cats: ["trust"],
    keywords: "kyc id check passport government identity stripe badge vetting vetted safe scam fake real person",
    q: "How does WaeWork verify hirers and talent?",
    a: (
      <>
        <p>
          Every hirer and every Talent Partner verifies their identity through Stripe Identity, a government-ID
          check backed by Stripe, before they can post a role or apply to one. So you always know who you&apos;re
          working with.
        </p>
        <p>Once a Talent Partner is verified, a &quot;Verified&quot; badge appears on their profile to the hirers they&apos;re matched with.</p>
        <LinkArrow href="/how-it-works">See how it works</LinkArrow>
      </>
    ),
  },
  {
    cats: ["trust", "start"],
    keywords: "directory search candidates cv resume list public see people shortlist categories roles",
    q: "Can I browse individual talent profiles before signing up?",
    a: (
      <>
        <p>
          No. Talent isn&apos;t listed publicly. You see full profiles only for candidates matched to your specific
          role, which keeps our vetted pool from being scraped or poached.
        </p>
        <p>You can browse the role categories before you sign up.</p>
        <LinkArrow href="/for-talent#talent-roles">Browse roles by skill</LinkArrow>
      </>
    ),
  },
  {
    cats: ["trust"],
    keywords: "mia ghost ghosted disappear disappears missing no reply silent quit replacement guarantee backup bench",
    q: "What happens if a Talent Partner becomes unresponsive?",
    a: (
      <>
        <p>
          A defined response window kicks in automatically, so there&apos;s no ambiguity about what happens next. If
          it doesn&apos;t work out early on, we&apos;ll help place a replacement.
        </p>
        <p>
          For every placement we also keep a shortlisted backup candidate on file for the first 90 days. If
          something falls through early, you&apos;re not starting the search from zero.
        </p>
        <LinkArrow href="/how-it-works">See how it works</LinkArrow>
      </>
    ),
  },
  {
    cats: ["trust", "payments"],
    keywords: "disagree disagreement conflict complaint mediation mediate neutral argue quality problem refund",
    q: "What happens if there's a dispute?",
    a: (
      <>
        <p>If a hirer and a Talent Partner disagree on delivered work, our support team mediates fairly for both sides.</p>
        <p>Everyone on WaeWork is covered by this service. It is not a deduction against either party.</p>
      </>
    ),
  },
  {
    cats: ["payments"],
    keywords: "escrow hold held release schedule paid pay payout payday wages money safe upfront milestone milestones stripe connect day 15 day 30 salary",
    q: "How does payment protection work?",
    a: (
      <>
        <p>Funds are held via Stripe Connect rather than paid out upfront, then released on a schedule that matches the work.</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-ink-navy">Ongoing Team Extension:</strong> funds are held and released every 15
            days. Partial at day 15, the rest at day 30, so neither side is exposed to a full month of risk.
          </li>
          <li>
            <strong className="text-ink-navy">Project-based work:</strong> release is tied to milestones you agree
            on upfront.
          </li>
        </ul>
        <LinkArrow href="/how-it-works">See how it works</LinkArrow>
      </>
    ),
  },
  {
    cats: ["payments", "pricing"],
    keywords: "when charge charged billing bill invoice one month pay successful match timing first month",
    q: "When is the placement fee charged?",
    a: (
      <>
        <p>Upon successful match. The placement fee is one month&apos;s pay, charged to the client only. Talent pays nothing.</p>
        <p>
          It applies to an ongoing Team Extension. There is no separate placement fee for project-based work, and
          the ongoing platform fee is listed from month 2 onwards.
        </p>
        <LinkArrow href="/pricing">See Team Extension pricing</LinkArrow>
      </>
    ),
  },
  {
    cats: ["pricing"],
    keywords: "price prices fee fees charge charges commission percent percentage rate rates expensive plans subscription starter growth floor minimum",
    q: "How much does WaeWork cost?",
    a: (
      <>
        <p>Talent never pays to join or apply. Clients pay for what they use.</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-ink-navy">Ongoing Team Extension:</strong> a placement fee of one month&apos;s
            pay, charged to the client only, upon successful match. Then an ongoing platform fee that tapers the
            longer the engagement runs: 12% in months 2–6 (8% client, 4% talent), 8% in months 7–12 (5.5% client,
            2.5% talent) and 6% from month 13 (4% client, 2% talent). The fee is that percentage or S$45/month
            combined, whichever is greater.
          </li>
          <li>
            <strong className="text-ink-navy">Project and gig work:</strong> 15% of total project value, split 10%
            client and 5% talent, taken from milestone releases. No separate placement fee.
          </li>
          <li>
            <strong className="text-ink-navy">Optional plans for repeat hirers:</strong> Starter at S$79/month, or
            Growth at S$149/month.
          </li>
        </ul>
        <LinkArrow href="/pricing">See pricing</LinkArrow>
      </>
    ),
  },
  {
    cats: ["pricing", "start"],
    keywords: "free join joining signup sign up apply cost talent freelancer worker service fee cut commission placed",
    q: "Do Talent Partners pay to join?",
    a: (
      <>
        <p>No. It&apos;s free to join, and WaeWork never charges talent to join, apply or get placed.</p>
        <p>
          Talent pays only a small service fee once work is underway: 4%, then 2.5%, then 2% on an ongoing Team
          Extension as the engagement runs longer, and 5% on projects. It funds verification, backup coverage and
          dispute support.
        </p>
        <LinkArrow href="/for-talent">See how it works for talent</LinkArrow>
      </>
    ),
  },
  {
    cats: ["pricing"],
    keywords: "buyout buy out direct hire directly leave platform twelve months 12 year permanent off platform",
    q: "Can we go direct after a year?",
    a: (
      <>
        <p>
          Yes. A buy-out option is available after month 12 for a fully direct relationship with your Talent
          Partner, with no ongoing platform fee.
        </p>
        <p>
          If you stay on the platform instead, the ongoing platform fee is at its lowest from month 13: 6% in total
          (4% client, 2% talent).
        </p>
        <LinkArrow href="/contact?topic=hiring">Ask us about the buy-out</LinkArrow>
      </>
    ),
  },
  {
    cats: ["start", "pricing"],
    keywords: "speed quick quickly urgent rush priority expedited time long days hours 24 48 asap soon turnaround",
    q: "How fast can I get matched?",
    a: (
      <>
        <p>WaeWork is built to help you hire in days, not months.</p>
        <p>
          Need it sooner? The Urgent priority add-on is a flat S$50–100 rush fee for expedited 24–48hr matching. It
          is subject to available talent. If we&apos;re unable to find a suitable match, we&apos;ll let you know.
        </p>
        <LinkArrow href="/pricing">See pricing</LinkArrow>
      </>
    ),
  },
  {
    cats: ["start", "payments"],
    keywords: "ongoing role retainer long term full time part time monthly project gig one-off difference extend scale",
    q: "What is a Team Extension?",
    a: (
      <>
        <p>
          A Team Extension is an ongoing role with a Talent Partner. The other way to work together is
          project-based: one-off and milestone-based.
        </p>
        <p>
          You can begin with a single project and, once it&apos;s working, extend it into an ongoing Team Extension.
          Add a Talent Partner for a busy quarter, extend the partnership when it&apos;s working, or scale back down.
        </p>
        <p>On a Team Extension, payment releases every 15 days: partial at day 15, the rest at day 30.</p>
        <LinkArrow href="/how-it-works">See how it works</LinkArrow>
      </>
    ),
  },
  {
    cats: ["start"],
    keywords: "country location region worldwide global international overseas abroad singapore where anywhere borders",
    q: "Is WaeWork limited to specific countries?",
    a: (
      <>
        <p>No. WaeWork is worldwide on both sides: hirers and Talent Partners can be located anywhere in the world.</p>
        <p>We&apos;re headquartered in Singapore, but the marketplace is not restricted to any single region on either side.</p>
      </>
    ),
  },
  {
    cats: ["start"],
    keywords: "company size enterprise large big startup founder solo sme team scale volume many roles",
    q: "Is WaeWork only for small businesses?",
    a: (
      <>
        <p>No. WaeWork is built for growing teams, from solo founders to established companies.</p>
        <p>Building a whole team rather than one role? Tell us and we&apos;ll set it up with you.</p>
        <LinkArrow href="/contact?topic=scale">Talk to us about hiring at scale</LinkArrow>
      </>
    ),
  },
  {
    cats: ["start", "pricing"],
    keywords: "artificial intelligence bot bots agent agents automation automate chatbot assistant waitlist early access founding member",
    q: "What is AI Staffing?",
    a: (
      <>
        <p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-alert-bg px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-alert uppercase shadow-[inset_0_0_0_1px_#F5C56B]">
            Early access
          </span>
        </p>
        <p>
          AI Staffing is AI-powered staff working alongside your human team, around the clock, for work that
          doesn&apos;t need a human and just needs to get done.
        </p>
        <p>We&apos;re onboarding early access clients now. Join the waitlist and we&apos;ll be in touch as capacity opens up.</p>
        <p>
          Plans are monthly: AI Starter at S$99/month (Founding Member pricing, limited to our first 50 hirers,
          rising to S$125/month once those spots are filled), AI Growth at S$199/month, and AI Custom from
          S$349/month.
        </p>
        <LinkArrow href="/ai-workforce">See AI Staffing</LinkArrow>
      </>
    ),
  },
];

const CATEGORIES: Category[] = ["trust", "payments", "pricing", "start"];

function AccordionItem({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line">
      <h3>
        <button type="button" onClick={onToggle} className="flex min-h-11 w-full items-center justify-between gap-4 py-4 text-left">
          <span className="flex flex-col gap-1">
            <span className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-voyage-blue uppercase">
              {CATEGORY_LABEL[item.cats[0]]}
            </span>
            <span className="font-display text-lg font-bold text-ink-navy">{item.q}</span>
          </span>
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
          <div className="flex max-w-[68ch] flex-col gap-3 pb-[22px] text-slate">{item.a}</div>
        </div>
      </div>
    </div>
  );
}

export function FaqPageContent() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [openIndex, setOpenIndex] = useState(0);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    return ITEMS.filter((item) => {
      if (cat !== "all" && !item.cats.includes(cat)) return false;
      if (!q) return true;
      return item.q.toLowerCase().includes(q) || item.keywords.includes(q);
    });
  }, [cat, q]);

  const counts: Record<Category | "all", number> = {
    all: ITEMS.length,
    trust: ITEMS.filter((i) => i.cats.includes("trust")).length,
    payments: ITEMS.filter((i) => i.cats.includes("payments")).length,
    pricing: ITEMS.filter((i) => i.cats.includes("pricing")).length,
    start: ITEMS.filter((i) => i.cats.includes("start")).length,
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <div className="flex flex-col gap-7 lg:sticky lg:top-24">
        <div>
          <span className="font-mono text-xs font-bold tracking-[0.14em] text-voyage-blue uppercase">Help · FAQ</span>
          <h1 className="mt-3 text-balance font-display text-display leading-[1.02] font-extrabold tracking-[-0.03em] text-ink-navy">
            Questions, <span className="text-voyage-blue">answered</span>
          </h1>
          <p className="mt-3 max-w-md text-lede leading-[1.55] text-slate">
            Plain answers about verification, payments and pricing. Search for a word, or pick a topic.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate" aria-hidden />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the FAQs"
              maxLength={80}
              autoComplete="off"
              className="min-h-[54px] w-full rounded-full border-[1.5px] border-field-line bg-white py-2 pr-14 pl-[46px] text-ink-navy placeholder:text-slate focus:border-voyage-blue focus:ring-4 focus:ring-passport-sky/[0.22] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-[5px] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-slate transition hover:rotate-90 hover:bg-cloud-blue hover:text-voyage-blue"
              >
                <X className="h-[18px] w-[18px] stroke-[2.4]" aria-hidden />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {(["all", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border-[1.5px] px-4 font-bold transition ${
                  cat === c ? "border-voyage-blue bg-voyage-blue text-white" : "border-line bg-white text-ink-navy hover:border-passport-sky"
                }`}
              >
                {c === "all" ? "All" : CATEGORY_LABEL[c]}
                <span className={`font-mono text-xs ${cat === c ? "text-cloud-blue" : "text-slate"}`}>{counts[c]}</span>
              </button>
            ))}
          </div>

          <p role="status" className="font-mono text-[0.8125rem] font-bold text-slate">
            {q || cat !== "all" ? `Showing ${results.length} of ${ITEMS.length} answers` : `Showing all ${ITEMS.length} answers`}
          </p>
        </div>
      </div>

      <div>
        {results.length > 0 ? (
          <div className="border-t border-line">
            {results.map((item) => {
              const globalIndex = ITEMS.indexOf(item);
              return (
                <AccordionItem
                  key={item.q}
                  item={item}
                  isOpen={openIndex === globalIndex}
                  onToggle={() => setOpenIndex((c) => (c === globalIndex ? -1 : globalIndex))}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-2xl border-[1.5px] border-dashed border-mist p-6">
            <span className="badge-ico flex h-11 w-11 items-center justify-center rounded-xl bg-cloud-blue text-voyage-blue">
              <Search className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="font-display text-xl font-bold text-ink-navy">No answers match your search</h3>
            <p className="text-slate">Try a shorter word, like &quot;fee&quot;, &quot;verify&quot; or &quot;dispute&quot;. Or ask us and we&apos;ll answer you directly.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className={buttonPrimary}>
                Ask us directly
              </Link>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCat("all");
                }}
                className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-mist px-[22px] font-extrabold text-ink-navy"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 flex items-start gap-3 rounded-2xl bg-frost px-[18px] py-4 text-slate">
          <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-voyage-blue" aria-hidden />
          <span>
            <strong className="text-ink-navy">Don&apos;t see your question?</strong> Send us your question, or email{" "}
            <a href="mailto:hello@waework.com" className="font-extrabold text-voyage-blue">
              hello@waework.com
            </a>{" "}
            directly.
          </span>
        </p>
      </div>
    </div>
  );
}
