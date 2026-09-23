import type { Metadata } from "next";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { AboutHero } from "@/components/landing/about-hero";
import { AboutStory } from "@/components/landing/about-story";
import { AboutBuilt } from "@/components/landing/about-built";
import { AboutFacts } from "@/components/landing/about-facts";
import { WhereToNextSection } from "@/components/landing/where-to-next-section";

export const metadata: Metadata = {
  title: "About WaeWork",
  description:
    "WaeWork is built by WAE (We Are Everywhere) to make hiring and working across borders simple, safe, and fair for both sides.",
};

export default function AboutPage() {
  return (
    <div>
      <OrganizationJsonLd />
      <AboutHero />
      <AboutStory />
      <AboutBuilt />
      <AboutFacts />
      <WhereToNextSection
        heading="Wherever you are, start here"
        subheading="Both sides are verified, and payment is protected from day one. Pick yours."
        cards={[
          { label: "I'm hiring", description: "Post a role and get matched with verified talent.", href: "/signup?role=hirer" },
          { label: "I'm looking for work", description: "Free to join. Get matched with verified hirers.", href: "/signup?role=talent" },
          { label: "See how it works", description: "Three steps, and the protections behind them.", href: "/how-it-works" },
        ]}
      />
    </div>
  );
}
