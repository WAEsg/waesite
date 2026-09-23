import type { Metadata } from "next";
import { FaqPageContent } from "@/components/landing/faq-page-content";
import { FaqStillStuck } from "@/components/landing/faq-still-stuck";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { WhereToNextSection } from "@/components/landing/where-to-next-section";

export const metadata: Metadata = {
  title: "FAQ | WaeWork",
  description:
    "Answers to common questions about how WaeWork verifies hirers and talent, how payment protection works, pricing, and disputes.",
};

export default function FaqPage() {
  return (
    <div>
      <FaqJsonLd />
      <FaqPageContent />
      <FaqStillStuck />
      <WhereToNextSection
        heading="Got your answer? Pick your side."
        subheading="Tell us which side you're on and we'll take you to the right sign-up. Pricing is one click away too."
        cards={[
          { label: "I'm hiring", description: "Post a role and get matched with verified talent.", href: "/signup?role=hirer" },
          { label: "I'm looking for work", description: "Free to join. Get matched with verified hirers.", href: "/signup?role=talent" },
          { label: "See pricing", description: "Every fee, plan and add-on on one page.", href: "/pricing" },
        ]}
      />
    </div>
  );
}
