import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { Logo } from "@/components/ui/logo";
import { WaitlistForm } from "./waitlist-form";

export const metadata: Metadata = {
  title: "Founding Talent Waitlist | WaeWork",
  description:
    "Join the WaeWork Founding Talent waitlist — be first in line when we open up matching, with a locked-in fee discount for early members.",
};

const PERKS = [
  "First access when we open up matching to your category",
  "A locked-in Founding Talent fee discount",
  "No cost to join — talent never pays to apply or be placed",
];

// Standalone — deliberately outside the (marketing) route group, so it
// does not inherit SiteNav/SiteFooter (which link to how-it-works,
// pricing, dashboards, etc.). This page is meant to be the only thing
// reachable on the domain right now: no header nav, no footer links, no
// path back into livemain. The logo below is a static, unlinked mark —
// present for branding, but not a link to "/".
export default function TalentWaitlistPage() {
  return (
    <div
      className="relative min-h-full px-4 pt-10 pb-16 sm:pt-14"
      style={{ background: "radial-gradient(56% 72% at 92% 6%, var(--color-cloud-blue), transparent 72%), linear-gradient(180deg, var(--color-frost), var(--color-paper-white) 82%)" }}
    >
      <div className="mx-auto mb-10 max-w-5xl">
        <Logo />
      </div>
      <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <EyebrowLabel dash>For talent</EyebrowLabel>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-alert-bg px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-alert uppercase shadow-[inset_0_0_0_1px_#F5C56B]">
                <Sparkles className="h-3 w-3" aria-hidden />
                Founding Talent
              </span>
            </div>
            <h1 className="mt-3 text-balance font-display text-display leading-[1.02] font-extrabold tracking-[-0.03em] text-ink-navy">
              Be first in line, <span className="text-voyage-blue">as a founding member</span>
            </h1>
            <p className="mt-3 max-w-lg text-lede leading-[1.55] text-slate">
              We&apos;re opening WaeWork to Talent Partners in waves. Join the Founding Talent waitlist now and
              you&apos;ll be first in line for matching — plus a fee discount locked in for being early.
            </p>
          </div>

          <ul className="flex flex-col gap-3.5">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-slate">
                <Check className="mt-0.5 h-4 w-4 shrink-0 stroke-[2.4] text-success" aria-hidden />
                {perk}
              </li>
            ))}
          </ul>

          <p className="rounded-lg bg-frost px-3.5 py-3 text-sm text-slate">
            Free to join, now and always — WaeWork never charges talent to join, apply, or be placed.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-1 sm:p-8">
          <WaitlistForm />
        </div>
      </div>
    </div>
  );
}
