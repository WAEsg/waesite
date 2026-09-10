import type { Metadata } from "next";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { emphasisUnderline, glassCard } from "@/components/ui/glass";

export const metadata: Metadata = {
  title: "About WaeWork",
  description:
    "WaeWork is built by WAE (We Are Everywhere) to make hiring and working across borders simple, safe, and fair for both sides.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <OrganizationJsonLd />
      <h1 className="font-display text-3xl font-bold text-frost sm:text-4xl">
        About WaeWork
      </h1>

      <div className={`mt-8 space-y-4 p-6 sm:p-8 ${glassCard}`}>
        <p className="text-mist">
          WaeWork is a marketplace connecting hirers with identity-verified
          remote talent — both sides can be located anywhere in the world.
        </p>
        <p className="text-xl font-semibold leading-snug text-frost">
          We built WaeWork on a simple belief: great talent isn&apos;t
          confined to one zip code, and neither is a great opportunity.
        </p>
      </div>

      <div className={`mt-6 space-y-4 p-6 sm:p-8 ${glassCard}`}>
        <p className="italic text-mist/80">
          We started WaeWork after watching good hires fall apart over
          things that had nothing to do with skill — a payment that never
          arrived on time, a hire nobody could verify, a dispute with no
          neutral party to call. It felt like a solvable problem.
        </p>
        <p className="text-mist">
          So we built the protections we wished existed: identity
          verification on both sides, payment held and released on a
          schedule that matches how the work actually happens, and a
          support team that mediates fairly when something goes wrong.
        </p>
      </div>

      <div className={`mt-6 space-y-4 p-6 sm:p-8 ${glassCard}`}>
        <p className="text-mist">
          WaeWork is built by WAE (We Are Everywhere), a company focused on
          making it easy and safe to hire and work across borders — a
          marketplace that&apos;s genuinely{" "}
          <span className={emphasisUnderline}>worldwide</span>, not
          restricted to any single region on either side.
        </p>
        <p className="text-mist">
          We&apos;re early-stage — if you have feedback or want to partner
          with us, reach out at hello@waework.co.
        </p>
      </div>
    </div>
  );
}
