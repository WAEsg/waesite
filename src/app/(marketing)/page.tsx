import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Hero } from "@/components/landing/hero";
import { HowItWorksTeaser } from "@/components/landing/how-it-works-teaser";
import { WhyWaeworkSection } from "@/components/landing/why-waework-section";
import { SkillsTeaser } from "@/components/landing/skills-teaser";
import { AiWorkforceSection } from "@/components/landing/ai-workforce-section";
import { WhereToNextSection } from "@/components/landing/where-to-next-section";

export const metadata: Metadata = {
  title: "Hire Verified Remote Talent, Worldwide | WaeWork",
  description:
    "WaeWork is a global marketplace connecting hirers with identity-verified remote talent worldwide, with payment protection built into every engagement.",
};

export default function LandingPage() {
  // TEMPORARY: livemain is on hold while the Founding Talent waitlist is
  // the only thing live on the domain. Delete this one redirect line
  // (and this comment block) to put livemain's real homepage back at "/"
  // — nothing else on this page changed, so that's the entire revert.
  redirect("/talent-waitlist");

  return (
    <>
      <Hero />
      <HowItWorksTeaser />
      <WhyWaeworkSection />
      <SkillsTeaser />
      <AiWorkforceSection />
      <WhereToNextSection />
    </>
  );
}
