import type { Metadata } from "next";
import Link from "next/link";
import { buttonPrimaryDark, buttonSecondaryDark, glassCard, glowShadow } from "@/components/ui/glass";
import { audienceLine } from "@/lib/landing-data";

export const metadata: Metadata = {
  title: "For Hirers — Post a Role, Hire Verified Talent | WaeWork",
  description:
    "Post a role, get matched with an identity-verified Talent Partner from anywhere in the world, and pay with confidence — funds are held and released on a schedule that protects you both.",
};

const steps = [
  {
    title: "Post what you need",
    description:
      "Describe the role or project — scope, budget, and whether it's a project-based engagement or an ongoing Team Extension.",
  },
  {
    title: "We vet and match",
    description:
      "Every applicant completes identity verification through Stripe Identity before they can apply. We surface the best-fit Talent Partners from a global pool.",
  },
  {
    title: "Start small, scale once it's working",
    description:
      "Funds are held via Stripe Connect, not paid out upfront, and released on a schedule tied to how the engagement actually works.",
  },
];

export default function ForHirersPage() {
  return (
    <div>
      <section className="px-4 py-16 text-center">
        <h1 className="mx-auto max-w-2xl font-display text-3xl font-bold text-frost sm:text-4xl">
          Hire in days, not months
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-mist">
          Built for teams who need to move fast without a big HR department.
          Every candidate is identity-verified before they can apply, and
          your payment stays protected until work is actually delivered.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/signup?role=hirer" className={buttonPrimaryDark}>
            Post a role
          </Link>
          <Link href="/how-it-works" className={buttonSecondaryDark}>
            See how it works
          </Link>
        </div>
        <p className="mt-4 text-sm text-mist/70">{audienceLine}</p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className={`p-6 ${glassCard}`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-voyage-blue to-passport-sky font-display text-sm font-bold text-frost ${glowShadow}`}>
                {i + 1}
              </span>
              <h2 className="mt-3 font-display font-semibold text-frost">
                {step.title}
              </h2>
              <p className="mt-1.5 text-sm text-mist">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className={`p-8 ${glassCard}`}>
          <h2 className="font-display text-xl font-semibold text-frost">
            How vetting works
          </h2>
          <p className="mt-2 text-mist">
            Before anyone can apply to a role, they verify their identity
            with Stripe Identity — a government-ID check backed by Stripe.
            Talent isn&apos;t listed publicly; you only see full profiles
            for candidates matched to your specific role, which keeps our
            vetted pool from being scraped or poached.
          </p>
        </div>

        <div className={`mt-4 p-8 ${glassCard}`}>
          <h2 className="font-display text-xl font-semibold text-frost">
            Payment protection
          </h2>
          <p className="mt-2 text-mist">
            Funds are held via Stripe Connect rather than paid to your
            Talent Partner upfront. For an ongoing Team Extension, release
            happens every 15 days — partial at day 15, the rest at day 30 —
            so you&apos;re never paying a full month for work you
            haven&apos;t seen. For project-based work, release is tied to
            milestones you agree on, so you can start small and scale up
            once it&apos;s working.
          </p>
          <p className="mt-3 text-sm text-mist/70">
            Details on cost:{" "}
            <Link href="/pricing" className="font-semibold text-passport-sky hover:text-frost">
              see pricing
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
