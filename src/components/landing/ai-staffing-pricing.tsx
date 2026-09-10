import { aiStaffingFoundingMember, aiStaffingTiers } from "@/lib/landing-data";
import { glassCard, glassCardHover } from "@/components/ui/glass";

// Single shared render of the AI Staffing tiers — used on the AI Workforce
// homepage section and the dedicated Pricing page, so Starter's Founding
// Member framing can't drift between the two.
export function AiStaffingPricing() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {aiStaffingTiers.map((tier) => (
        <div
          key={tier.name}
          className={`relative flex flex-col p-6 text-left ${glassCard} ${glassCardHover} ${
            tier.founding ? "border-passport-sky/30" : ""
          }`}
        >
          {tier.founding && (
            <span className="mb-3 inline-flex w-fit items-center rounded-full bg-gradient-to-r from-voyage-blue to-passport-sky px-3 py-1 text-xs font-semibold text-frost">
              {aiStaffingFoundingMember.badge}
            </span>
          )}
          <p className="font-display text-lg font-semibold text-frost">{tier.name}</p>
          <p className="mt-1 font-display text-2xl font-bold text-passport-sky">
            {tier.price}
          </p>
          <p className="mt-2 flex-1 text-sm text-mist">{tier.description}</p>
          {tier.founding && (
            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="text-xs font-medium text-mist/80">
                {aiStaffingFoundingMember.label}
              </p>
              <p className="mt-1 text-xs text-mist/60">
                {aiStaffingFoundingMember.subnote}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
