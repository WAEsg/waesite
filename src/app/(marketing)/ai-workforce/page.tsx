import type { Metadata } from "next";
import { glassCard } from "@/components/ui/glass";
import { EarlyAccessBadge } from "@/components/ui/early-access-badge";
import { AiWorkforceInterestForm } from "./interest-form";

export const metadata: Metadata = {
  title: "AI Workforce Early Access | WaeWork",
  description:
    "Join the early access waitlist for WaeWork's AI-powered staff — AI teammates for support, admin, sales, content, and data, alongside your human team.",
};

export default function AiWorkforcePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="text-center">
        <EarlyAccessBadge />
        <h1 className="mt-3 font-display text-3xl font-bold text-frost sm:text-4xl">
          Tell us what you need
        </h1>
        <p className="mx-auto mt-3 max-w-md text-mist">
          This is a short interest form, not the full hiring flow — we&apos;re
          onboarding AI Workforce clients gradually as capacity opens up.
        </p>
      </div>

      <div className={`mt-8 p-6 sm:p-8 ${glassCard}`}>
        <AiWorkforceInterestForm />
      </div>
    </div>
  );
}
