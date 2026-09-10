import type { Metadata } from "next";
import { FlightPathSection } from "@/components/landing/flight-path-section";
import { TrustSection } from "@/components/landing/trust-section";

export const metadata: Metadata = {
  title: "How It Works | WaeWork",
  description:
    "See how WaeWork matches hirers with identity-verified remote talent worldwide, with payment protection built into every engagement.",
};

export default function HowItWorksPage() {
  return (
    <div className="px-4 pb-16 pt-16 text-center">
      <h1 className="font-display text-3xl font-bold text-frost sm:text-4xl">
        How WaeWork works
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-mist">
        Three steps from posting a role to work starting, with protection
        built in at every stage.
      </p>
      <FlightPathSection />
      <TrustSection />
    </div>
  );
}
