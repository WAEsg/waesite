import type { Metadata } from "next";
import { ForHirersHero } from "@/components/landing/for-hirers-hero";
import { ForHirersSteps } from "@/components/landing/for-hirers-steps";
import { ForHirersVetting } from "@/components/landing/for-hirers-vetting";
import { ForHirersPayment } from "@/components/landing/for-hirers-payment";
import { ForHirersFees } from "@/components/landing/for-hirers-fees";
import { ForHirersCategories } from "@/components/landing/for-hirers-categories";
import { WhereToNextSection } from "@/components/landing/where-to-next-section";

export const metadata: Metadata = {
  title: "For Hirers — Post a Role, Hire Verified Talent | WaeWork",
  description:
    "Post a role, get matched with an identity-verified Talent Partner from anywhere in the world, and pay with confidence — funds are held and released on a schedule that protects you both.",
};

export default function ForHirersPage() {
  return (
    <div>
      <ForHirersHero />
      <ForHirersSteps />
      <ForHirersVetting />
      <ForHirersPayment />
      <ForHirersFees />
      <ForHirersCategories />
      <WhereToNextSection
        heading="Ready to meet your shortlist?"
        subheading={'Creating an account takes about a minute. You\'ll arrive at sign-up with "Hirer" already chosen.'}
        cards={[
          { label: "Post a role", description: "Create your hirer account, verify your ID, then describe the role.", href: "/signup?role=hirer" },
          { label: "Work out your cost", description: "See exactly what you'd pay for an ongoing role or a one-off project.", href: "/pricing" },
          { label: "Talk to us", description: "Questions about hiring? Send us a message, or email hello@waework.com.", href: "/contact?topic=hiring" },
        ]}
      />
    </div>
  );
}
