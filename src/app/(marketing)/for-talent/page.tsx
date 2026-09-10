import type { Metadata } from "next";
import Link from "next/link";
import { buttonPrimaryDark, buttonSecondaryDark, glassCard } from "@/components/ui/glass";
import { SkillsExplorer } from "@/components/landing/skills-explorer";

export const metadata: Metadata = {
  title: "For Talent — Work with Verified Hirers, Worldwide | WaeWork",
  description:
    "Apply to roles from hirers worldwide with WaeWork. Free to join, identity-verified, and paid on a schedule that protects you from unpaid work.",
};

export default function ForTalentPage() {
  return (
    <div>
      <section className="px-4 py-16 text-center">
        <h1 className="mx-auto max-w-2xl font-display text-3xl font-bold text-frost sm:text-4xl">
          Become a Talent Partner, wherever you are
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-mist">
          Free to join — WaeWork never charges talent to be placed. Get
          matched to project-based work or an ongoing Team Extension with
          hirers worldwide, with payment protection from day one.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/signup?role=talent" className={buttonPrimaryDark}>
            Get started
          </Link>
          <Link href="/how-it-works" className={buttonSecondaryDark}>
            See how it works
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-center font-display text-2xl font-semibold text-frost">
          What kind of roles are out there
        </h2>
        <p className="mx-auto mt-1 max-w-md text-center text-sm text-mist">
          Browse by skill — apply to a specific role once you find your fit.
        </p>
        <div className="mt-8">
          <SkillsExplorer />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className={`p-8 ${glassCard}`}>
          <h2 className="font-display text-xl font-semibold text-frost">
            Verification process
          </h2>
          <p className="mt-2 text-mist">
            After you sign up, you&apos;ll verify your identity with Stripe
            Identity — a quick government-ID check. Once verified, you can
            apply to any open role and a &ldquo;Verified&rdquo; badge
            appears on your profile to hirers you&apos;re matched with.
          </p>
        </div>

        <div className={`mt-4 p-8 ${glassCard}`}>
          <h2 className="font-display text-xl font-semibold text-frost">
            Getting paid, protected
          </h2>
          <p className="mt-2 text-mist">
            For an ongoing Team Extension, payment releases every 15 days —
            partial at day 15, the rest at day 30 — so you&apos;re never
            working a full month unpaid. For project-based work, release is
            tied to milestones agreed upfront with your hirer.
          </p>
          <p className="mt-3 text-sm text-mist/70">
            WaeWork never charges you to join or get placed —{" "}
            <Link href="/pricing" className="font-semibold text-passport-sky hover:text-frost">
              see how pricing works
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
