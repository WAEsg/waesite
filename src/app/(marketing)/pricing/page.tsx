import type { Metadata } from "next";
import Link from "next/link";
import {
  pricingBuyout,
  pricingFeeFloor,
  pricingGigFee,
  pricingPlacementFee,
  pricingSubscriptionTiers,
  pricingTalentPromise,
  pricingTiers,
  pricingUrgentAddon,
} from "@/lib/landing-data";
import { buttonPrimaryDark, emphasisUnderline, glassCard, glassCardHover } from "@/components/ui/glass";
import { EarlyAccessBadge } from "@/components/ui/early-access-badge";
import { AiStaffingPricing } from "@/components/landing/ai-staffing-pricing";

export const metadata: Metadata = {
  title: "Pricing | WaeWork",
  description:
    "Simple, honest pricing: a one-time placement fee paid by the client for ongoing roles, a flat fee on project work, and optional plans for repeat hirers. Talent never pays to be placed.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-frost sm:text-4xl">
        Simple, honest pricing
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-lg text-mist">
        <span className={emphasisUnderline}>Talent never pays</span> to join
        or apply. Clients pay for what they use — an ongoing Team Extension
        or a one-off project — plus optional plans for repeat hiring.
      </p>

      {/* Team Extension pricing */}
      <div className="mt-10 text-left">
        <h2 className="text-center font-display text-xl font-semibold text-frost">
          For an ongoing Team Extension
        </h2>

        <div className={`mt-4 p-8 ${glassCard}`}>
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-display text-lg font-semibold text-frost">
              {pricingPlacementFee.title}
            </p>
            <p className="font-display text-2xl font-bold text-passport-sky">
              {pricingPlacementFee.amount}
            </p>
          </div>
          <p className="mt-1 text-sm text-mist">{pricingPlacementFee.description}</p>
        </div>

        <div className="mt-4">
          <p className="font-semibold text-frost">Ongoing platform fee</p>
          <p className="mt-1 text-sm text-mist">
            Tapers the longer the engagement runs — split between client and
            talent to fund ongoing verification, backup coverage, and
            neutral dispute support.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div key={tier.period} className={`p-6 ${glassCard} ${glassCardHover}`}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold text-mist">{tier.period}</p>
                  <p className="font-display text-sm font-bold text-frost">{tier.combined}</p>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-frost">
                    {tier.clientShare}
                  </span>
                  <span className="text-xs text-mist">client</span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-passport-sky">
                    {tier.talentShare}
                  </span>
                  <span className="text-xs text-mist">talent</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-mist/60">Fee floor: {pricingFeeFloor}</p>
        </div>

        <div className={`mt-4 p-6 ${glassCard}`}>
          <p className="font-semibold text-frost">Buy-out option</p>
          <p className="mt-1 text-sm text-mist">{pricingBuyout}</p>
        </div>
      </div>

      {/* Project / gig pricing */}
      <div className="mt-10 text-left">
        <h2 className="text-center font-display text-xl font-semibold text-frost">
          For project & gig work
        </h2>
        <div className={`mt-4 p-8 ${glassCard}`}>
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-display text-lg font-semibold text-frost">
              {pricingGigFee.title}
            </p>
            <p className="font-display text-2xl font-bold text-passport-sky">
              {pricingGigFee.rate}
            </p>
          </div>
          <p className="mt-1 text-sm text-mist">{pricingGigFee.description}</p>
          <div className="mt-4 flex gap-6">
            <div>
              <span className="font-display text-xl font-bold text-frost">
                {pricingGigFee.clientShare}
              </span>{" "}
              <span className="text-xs text-mist">client</span>
            </div>
            <div>
              <span className="font-display text-xl font-bold text-passport-sky">
                {pricingGigFee.talentShare}
              </span>{" "}
              <span className="text-xs text-mist">talent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription tiers */}
      <div className="mt-10 text-left">
        <h2 className="text-center font-display text-xl font-semibold text-frost">
          Plans for repeat &amp; high-volume hirers
        </h2>
        <p className="mx-auto mt-1 max-w-md text-center text-sm text-mist">
          Optional — pay per placement as above, or subscribe for frequent
          hiring.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {pricingSubscriptionTiers.map((tier) => (
            <div key={tier.name} className={`p-6 ${glassCard} ${glassCardHover}`}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-display text-lg font-semibold text-frost">{tier.name}</p>
                <p className="font-display text-xl font-bold text-passport-sky">{tier.price}</p>
              </div>
              <p className="mt-1.5 text-sm text-mist">{tier.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent priority add-on */}
      <div className="mt-10 text-left">
        <h2 className="text-center font-display text-xl font-semibold text-frost">
          Urgent priority add-on
        </h2>
        <div className={`mt-4 p-6 ${glassCard}`}>
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-semibold text-frost">{pricingUrgentAddon.title}</p>
            <p className="font-display text-xl font-bold text-passport-sky">
              {pricingUrgentAddon.price}
            </p>
          </div>
          <p className="mt-1 text-sm text-mist">{pricingUrgentAddon.description}</p>
          <p className="mt-3 text-xs text-mist/60">{pricingUrgentAddon.disclaimer}</p>
        </div>
      </div>

      {/* AI Staffing */}
      <div id="ai-staffing" className="mt-10 scroll-mt-24 text-left">
        <div className="flex items-center justify-center gap-2.5">
          <h2 className="font-display text-xl font-semibold text-frost">
            AI Staffing
          </h2>
          <EarlyAccessBadge />
        </div>
        <p className="mx-auto mt-1 max-w-md text-center text-sm text-mist">
          AI teammates alongside your human team, priced monthly.
        </p>
        <div className="mt-4">
          <AiStaffingPricing />
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-r from-voyage-blue/20 to-passport-sky/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <p className="text-frost">{pricingTalentPromise}</p>
      </div>

      <Link href="/signup" className={`${buttonPrimaryDark} mt-8`}>
        Get started
      </Link>
    </div>
  );
}
