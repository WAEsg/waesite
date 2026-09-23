import type { Metadata } from "next";
import { HowItWorksHero } from "@/components/landing/how-it-works-hero";
import { HowItWorksSteps } from "@/components/landing/how-it-works-steps";
import { HowItWorksPayment } from "@/components/landing/how-it-works-payment";
import { HowItWorksProtect } from "@/components/landing/how-it-works-protect";
import { HowItWorksFaqTeaser } from "@/components/landing/how-it-works-faq-teaser";
import { WhereToNextSection } from "@/components/landing/where-to-next-section";

export const metadata: Metadata = {
  title: "How It Works | WaeWork",
  description:
    "See how WaeWork matches hirers with identity-verified remote talent worldwide, with payment protection built into every engagement.",
};

export default function HowItWorksPage() {
  return (
    <div>
      <HowItWorksHero />
      <HowItWorksSteps />
      <HowItWorksPayment />
      <HowItWorksProtect />
      <HowItWorksFaqTeaser />
      <WhereToNextSection
        heading="Start with one role, or one application"
        subheading="Pick your side and we'll carry it through sign-up. Creating an account takes about a minute."
        cards={[
          { label: "I'm hiring", description: "Post a role and get matched with verified talent.", href: "/signup?role=hirer" },
          { label: "I'm looking for work", description: "Free to join. Get matched with verified hirers.", href: "/signup?role=talent" },
          {
            label: "See pricing",
            description: "Clear fees for ongoing roles and one-off projects. Talent never pays to join or apply.",
            href: "/pricing",
          },
        ]}
      />
    </div>
  );
}
