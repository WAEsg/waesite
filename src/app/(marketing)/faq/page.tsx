import type { Metadata } from "next";
import { FaqSection } from "@/components/landing/faq-section";
import { FaqJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "FAQ | WaeWork",
  description:
    "Answers to common questions about how WaeWork verifies hirers and talent, how payment protection works, pricing, and disputes.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <FaqJsonLd />
      <h1 className="text-center font-display text-3xl font-bold text-frost sm:text-4xl">
        Frequently asked questions
      </h1>
      <div className="mt-10">
        <FaqSection />
      </div>
    </div>
  );
}
