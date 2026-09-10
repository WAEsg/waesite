import Link from "next/link";
import { DemoBanner } from "@/components/demo-banner";
import { RouteLine } from "@/components/route-line";

const steps = [
  {
    href: "/signup",
    title: "1. Sign up",
    description: "The real signup page — email + password, no demo shortcut here.",
  },
  {
    href: "/demo/onboarding",
    title: "2. Onboarding",
    description: "Pick hirer or talent and fill in your profile.",
  },
  {
    href: "/demo/dashboard/hirer",
    title: "3a. Hirer dashboard",
    description: "What a hirer sees after onboarding.",
  },
  {
    href: "/demo/dashboard/talent",
    title: "3b. Talent dashboard",
    description: "What talent sees after onboarding.",
  },
];

export default function DemoIndexPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <DemoBanner />
      <div className="flex flex-1 flex-col items-center px-4 py-16">
        <span className="font-display text-2xl font-bold text-voyage-blue">
          WaeWork
        </span>
        <RouteLine className="mt-3 h-8 w-40" />
        <h1 className="mt-4 text-center text-2xl font-bold text-ink-navy">
          Walk through the product
        </h1>
        <p className="mt-1 max-w-md text-center text-sm text-ink-navy/70">
          These pages use sample data so you can click through the whole flow
          without creating a real account.
        </p>

        <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
          {steps.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="rounded-2xl border border-ink-navy/10 bg-paper-white p-4 transition hover:border-voyage-blue"
            >
              <span className="block font-display font-semibold text-ink-navy">
                {step.title}
              </span>
              <span className="mt-1 block text-sm text-ink-navy/70">
                {step.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
