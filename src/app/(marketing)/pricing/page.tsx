import type { Metadata } from "next";
import { PricingHero } from "@/components/landing/pricing-hero";
import { PricingTabs } from "@/components/landing/pricing-tabs";
import { PricingFeeExplainer } from "@/components/landing/pricing-fee-explainer";
import { PricingFaq } from "@/components/landing/pricing-faq";
import { WhereToNextSection } from "@/components/landing/where-to-next-section";

export const metadata: Metadata = {
  title: "Pricing | WaeWork",
  description:
    "Simple, honest pricing: a one-time placement fee paid by the client for ongoing roles, a flat fee on project work, and optional plans for repeat hirers. Talent never pays to be placed.",
};

export default function PricingPage() {
  return (
    <div>
      <PricingHero />
      <PricingTabs />
      <PricingFeeExplainer />
      <PricingFaq />
      <WhereToNextSection
        heading="Numbers make sense? Pick your path."
        subheading="Your choice carries through to sign-up, so you only answer it once."
        cards={[
          { label: "Post a role", description: "One month's pay to place, then a fee that tapers from 8% to 4%.", href: "/signup?role=hirer" },
          { label: "Become a Talent Partner", description: "Free to join, apply and be placed. 2–4% once you're working.", href: "/signup?role=talent" },
          { label: "Talk to us about hiring at scale", description: "Building a whole team, not one role? We'll set it up with you.", href: "/contact?topic=scale" },
        ]}
      />
    </div>
  );
}
