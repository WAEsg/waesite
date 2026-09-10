import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { ValuePropsSection } from "@/components/landing/value-props-section";
import { SkillsTeaser } from "@/components/landing/skills-teaser";
import { AiWorkforceSection } from "@/components/landing/ai-workforce-section";

export const metadata: Metadata = {
  title: "Hire Verified Remote Talent, Worldwide | WaeWork",
  description:
    "WaeWork is a global marketplace connecting hirers with identity-verified remote talent worldwide, with payment protection built into every engagement.",
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ValuePropsSection />
      <SkillsTeaser />
      <AiWorkforceSection />
    </>
  );
}
