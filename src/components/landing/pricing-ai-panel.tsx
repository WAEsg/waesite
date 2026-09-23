import Link from "next/link";
import { Sparkles } from "lucide-react";

const PLANS = [
  {
    name: "AI Starter",
    price: "S$99",
    blurb: "For businesses trying their first AI teammate.",
    featured: true,
    perks: ["Founding Member pricing, limited to our first 50 hirers", "Rate rises to S$125/month once Founding Member spots are filled"],
    href: "/ai-workforce?plan=starter",
  },
  { name: "AI Growth", price: "S$199", blurb: "For teams running multiple AI teammates day to day.", href: "/ai-workforce?plan=growth" },
  { name: "AI Custom", price: "from S$349", blurb: "For larger teams. Tell us what you need.", href: "/ai-workforce?plan=custom" },
];

export function PricingAiPanel() {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-alert-bg px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-alert uppercase shadow-[inset_0_0_0_1px_#F5C56B]">
          Early access
        </span>
        <h3 className="mt-3 font-display text-2xl font-bold text-ink-navy">AI Staffing plans</h3>
        <p className="mt-1.5 max-w-2xl text-slate">
          Pay monthly for however much AI staffing your business needs. We&apos;re onboarding early access clients
          now: join the waitlist and we&apos;ll be in touch as capacity opens up.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <article
            key={plan.name}
            className={`relative flex flex-col gap-4 rounded-2xl border bg-white p-7 ${plan.featured ? "border-2 border-voyage-blue shadow-1" : "border-line"}`}
          >
            {plan.featured && (
              <span className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 rounded-full bg-alert-bg px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-alert uppercase shadow-[inset_0_0_0_1px_#F5C56B]">
                Founding Member
              </span>
            )}
            <h4 className="font-display text-lg font-bold text-ink-navy">{plan.name}</h4>
            <p className="font-display text-[clamp(2rem,3vw,2.6rem)] leading-none font-extrabold tracking-[-0.03em] text-ink-navy tabular-nums">
              {plan.price}
              <small className="ml-1 text-base font-bold text-slate">/month</small>
            </p>
            <p className="text-slate">{plan.blurb}</p>
            {plan.perks && (
              <ul className="flex flex-col gap-2">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-sm text-slate">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-voyage-blue" aria-hidden />
                    {perk}
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={plan.href}
              className={`mt-auto flex min-h-11 items-center justify-center rounded-full px-4 font-extrabold transition ${
                plan.featured
                  ? "border-[1.5px] border-voyage-blue bg-voyage-blue text-white hover:-translate-y-0.5"
                  : "border-[1.5px] border-mist text-ink-navy hover:border-passport-sky"
              }`}
            >
              Join the waitlist
            </Link>
          </article>
        ))}
      </div>

      <p className="flex items-start gap-2.5 rounded-lg bg-frost p-3.5 text-slate">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-voyage-blue" aria-hidden />
        <span>
          <strong className="text-ink-navy">AI Staffing plans are separate from the hiring plans.</strong> Starter
          and Growth on the Ongoing hire tab are for hiring people. These three are for AI teammates.{" "}
          <Link href="/ai-workforce" className="font-extrabold text-voyage-blue">
            Meet the AI teammates
          </Link>
        </span>
      </p>
    </div>
  );
}
