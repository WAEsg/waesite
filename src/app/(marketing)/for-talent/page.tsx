import type { Metadata } from "next";
import { ForTalentHero } from "@/components/landing/for-talent-hero";
import { TalentRoleFinder } from "@/components/landing/talent-role-finder";
import { ForTalentVerification } from "@/components/landing/for-talent-verification";
import { ForTalentPayment } from "@/components/landing/for-talent-payment";
import { ForTalentFees } from "@/components/landing/for-talent-fees";
import { WhereToNextSection } from "@/components/landing/where-to-next-section";

export const metadata: Metadata = {
  title: "For Talent — Work with Verified Hirers, Worldwide | WaeWork",
  description:
    "Apply to roles from hirers worldwide with WaeWork. Free to join, identity-verified, and paid on a schedule that protects you from unpaid work.",
};

export default function ForTalentPage() {
  return (
    <div>
      <ForTalentHero />
      <TalentRoleFinder />
      <ForTalentVerification />
      <ForTalentPayment />
      <ForTalentFees />
      <WhereToNextSection
        heading="Ready to become a Talent Partner?"
        subheading="Creating an account takes about a minute. We'll remember that you're here for work, so sign-up starts in the right place."
        cards={[
          { label: "Get started — it's free", description: "Sign up, verify your identity, then apply to any open role.", href: "/signup?role=talent" },
          { label: "See how you're protected", description: "ID checks on both sides, held payments and neutral dispute support.", href: "/how-it-works#how-it-works-protect" },
          { label: "Ask us a question", description: "Not sure where you fit? Send us a message about applying.", href: "/contact?topic=applying" },
        ]}
      />
    </div>
  );
}
