import { IdCard, Scale, Wallet } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkArrow } from "@/components/ui/link-arrow";
import { Reveal } from "@/components/ui/reveal";

const ITEMS = [
  {
    icon: IdCard,
    problem: "The problem · a hire nobody could verify",
    title: "Identity verification on both sides",
    note: "Every hirer and every Talent Partner is verified through Stripe Identity before they can post a role or apply to one, so you always know who you're working with.",
  },
  {
    icon: Wallet,
    problem: "The problem · a payment that never arrived on time",
    title: "Payment held and released on a schedule that matches the work",
    note: "Funds are held via Stripe Connect. On an ongoing Team Extension they release every 15 days, partial at day 15 and the rest at day 30. On project-based work, release is tied to agreed milestones.",
  },
  {
    icon: Scale,
    problem: "The problem · a dispute with no neutral party to call",
    title: "Support that mediates fairly",
    note: "If a hirer and a Talent Partner disagree on delivered work, our support team mediates fairly for both sides. Everyone on WaeWork is covered, and it is not a deduction against either party.",
  },
];

export function AboutBuilt() {
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <EyebrowLabel>What we built</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            Three protections, one for each thing that kept going wrong
          </h2>
          <div className="mt-3">
            <LinkArrow href="/how-it-works">See how it works</LinkArrow>
          </div>
        </div>

        <ul className="mt-8 flex flex-col">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} variant="up" delayMs={i * 120}>
                <li className="flex flex-col gap-3.5 border-t border-line py-6 sm:flex-row">
                  <span className="badge-ico flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <span className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">{item.problem}</span>
                    <h3 className="mt-1.5 font-display text-xl font-bold text-ink-navy">{item.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-slate">{item.note}</p>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
