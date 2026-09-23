"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { useRolePreference } from "@/lib/use-role-preference";

type NextCard = {
  label: string;
  description: string;
  href: string;
};

const DEFAULT_CARDS: NextCard[] = [
  { label: "I'm hiring", description: "Post a role and get matched with verified talent.", href: "/signup?role=hirer" },
  { label: "I'm looking for work", description: "Free to join. Get matched with verified hirers.", href: "/signup?role=talent" },
  { label: "See pricing", description: "Clear fees for ongoing roles, one-off projects and AI Staffing.", href: "/pricing" },
];

// Matches the prototype's `.choice`/`.choice__title`/`.choice--solid`
// exactly: 22px padding, a 20px font-display title with the arrow pushed
// to the far edge (justify-between, not just a small gap), a 15px
// description, and a -5px hover lift. The ghost (ink-navy border/bg
// tokens don't apply here) ".choice" uses raw white-alpha values, since
// this band sits on --deep, not the page's usual palette.
//
// Like the prototype's `data-set-role` links, picking a card with a
// `?role=hirer`/`?role=talent` href remembers that choice site-wide.
function ChoiceCard({
  card,
  wide = false,
  solid = false,
  onClick,
}: {
  card: NextCard;
  wide?: boolean;
  solid?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={card.href}
      onClick={onClick}
      className={`group flex flex-col gap-2 rounded-2xl border p-[22px] transition-[transform,background-color,border-color] duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-[5px] ${
        solid
          ? "border-white bg-white"
          : "border-white/[0.18] bg-white/[0.07] hover:border-white/50 hover:bg-white/[0.13]"
      } ${wide ? "sm:col-span-2" : ""}`}
    >
      <span
        className={`flex items-center justify-between gap-3 font-display text-xl leading-[1.2] font-bold ${solid ? "text-deep-navy" : "text-white"}`}
      >
        {card.label}
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-[350ms] ease-out group-hover:translate-x-1.5" aria-hidden />
      </span>
      <p className={`text-[0.9375rem] leading-[1.5] ${solid ? "text-slate" : "text-[#BACBEA]"}`}>{card.description}</p>
    </Link>
  );
}

// The prototype closes nearly every page with a "Where to next?" band —
// dark navy background, a solid (white) card for the primary choice, an
// outlined "ghost" card for the secondary choice, and a third wide card
// spanning both beneath. Built once here and reused across marketing
// pages instead of re-implementing per page.
export function WhereToNextSection({
  heading = "Hiring, or looking for work?",
  subheading = "Pick one and we'll carry your choice through sign-up. Creating an account takes about a minute.",
  cards = DEFAULT_CARDS,
}: {
  heading?: string;
  subheading?: string;
  cards?: NextCard[];
}) {
  const [primary, secondary, wide] = cards;
  const [, setRole] = useRolePreference();

  function pickRole(href: string) {
    const params = href.split("?")[1];
    const role = params ? new URLSearchParams(params).get("role") : null;
    if (role === "hirer" || role === "talent") setRole(role);
  }

  return (
    <section className="bg-deep-navy px-4 py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-start">
        <div>
          <EyebrowLabel dash dark>
            Where to next?
          </EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-white">{heading}</h2>
          <p className="mt-2 max-w-md text-white/70">{subheading}</p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {primary && <ChoiceCard card={primary} solid onClick={() => pickRole(primary.href)} />}
          {secondary && <ChoiceCard card={secondary} onClick={() => pickRole(secondary.href)} />}
          {wide && <ChoiceCard card={wide} wide onClick={() => pickRole(wide.href)} />}
        </div>
      </div>
    </section>
  );
}
