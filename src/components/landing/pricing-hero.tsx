"use client";

import { ArrowRight } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useRolePreference } from "@/lib/use-role-preference";

export function PricingHero() {
  const [role, setRole] = useRolePreference();

  function scrollToCosts() {
    document.getElementById("pricing-costs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="bg-cloud-blue/40 px-4 pt-16 pb-14 sm:pt-20">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div>
            <EyebrowLabel dash>Pricing</EyebrowLabel>
            <h1 className="mt-3 text-balance font-display text-display leading-[1.02] font-extrabold tracking-[-0.03em] text-ink-navy">
              Simple, <span className="text-voyage-blue">honest</span> pricing
            </h1>
            <p className="mt-3 max-w-lg text-lede leading-[1.55] text-slate">
              Talent never pays to join or apply. Clients pay for what they use: an ongoing role (a Team Extension)
              or a one-off project.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-extrabold text-ink-navy">Which side are you on? We&apos;ll put your numbers first.</span>
            <div className="flex flex-wrap items-center gap-3">
              <SegmentedControl
                options={[
                  { value: "hirer", label: "I'm hiring" },
                  { value: "talent", label: "I'm looking for work" },
                ]}
                value={role}
                onChange={(v) => setRole(v as "hirer" | "talent")}
                className="!bg-white shadow-[inset_0_0_0_1.5px_#C9DDF7]"
              />
              {role && (
                <button type="button" onClick={() => setRole(null)} className="text-sm font-bold text-voyage-blue">
                  Show both sides
                </button>
              )}
            </div>
            <p className="text-sm text-slate">
              {role === "hirer"
                ? "Showing the hirer's share first, everywhere on this page."
                : role === "talent"
                  ? "Showing the Talent Partner's share first, everywhere on this page."
                  : "Not sure yet? Both sides are shown until you choose."}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-1">
          <div
            className={`flex flex-col gap-2.5 p-6 transition-colors ${role === "hirer" ? "bg-frost" : ""} ${role === "talent" ? "opacity-60" : ""}`}
          >
            <span className="flex flex-wrap items-center gap-2.5 font-mono text-xs font-bold tracking-[0.14em] text-slate uppercase">
              Hiring?
              {role === "hirer" && (
                <span className="rounded-full bg-cloud-blue px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.06em] text-voyage-blue normal-case">
                  Your side
                </span>
              )}
            </span>
            <p className="text-lg leading-[1.45] text-ink-navy">
              <strong className="font-extrabold text-voyage-blue">One month&apos;s pay</strong> to place, then{" "}
              <strong className="font-extrabold text-voyage-blue">4–8% a month</strong>, tapering down. Projects:{" "}
              <strong className="font-extrabold text-voyage-blue">10%</strong>.
            </p>
          </div>
          <div
            className={`flex flex-col gap-2.5 border-t border-dashed border-mist p-6 transition-colors ${role === "talent" ? "bg-frost" : ""} ${role === "hirer" ? "opacity-60" : ""}`}
          >
            <span className="flex flex-wrap items-center gap-2.5 font-mono text-xs font-bold tracking-[0.14em] text-slate uppercase">
              Looking for work?
              {role === "talent" && (
                <span className="rounded-full bg-cloud-blue px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.06em] text-voyage-blue normal-case">
                  Your side
                </span>
              )}
            </span>
            <p className="text-lg leading-[1.45] text-ink-navy">
              <strong className="font-extrabold text-voyage-blue">Free</strong> to join, apply and be placed.{" "}
              <strong className="font-extrabold text-voyage-blue">2–4%</strong> once you&apos;re working. Projects:{" "}
              <strong className="font-extrabold text-voyage-blue">5%</strong>.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-frost p-5">
            <button type="button" onClick={scrollToCosts} className="inline-flex min-h-12 items-center gap-2.5 rounded-full border-[1.5px] border-voyage-blue bg-voyage-blue px-[22px] py-3 font-extrabold text-white shadow-[0_6px_18px_rgba(30,79,163,0.26)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]">
              Work out my numbers
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <span className="font-mono text-xs text-slate">All prices in Singapore dollars (S$)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
