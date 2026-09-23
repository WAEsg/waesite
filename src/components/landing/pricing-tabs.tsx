"use client";

import { useState } from "react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PricingOngoingPanel } from "./pricing-ongoing-panel";
import { PricingProjectPanel } from "./pricing-project-panel";
import { PricingAiPanel } from "./pricing-ai-panel";

type Tab = "ongoing" | "project" | "ai";

export function PricingTabs() {
  const [tab, setTab] = useState<Tab>("ongoing");

  return (
    <div id="pricing-costs" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <EyebrowLabel>Pick how you&apos;ll work together</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            What will it cost?
          </h2>
        </div>

        <div className="mt-8">
          <SegmentedControl
            options={[
              { value: "ongoing", label: "Ongoing hire" },
              { value: "project", label: "One-off project" },
              { value: "ai", label: "AI Staffing" },
            ]}
            value={tab}
            onChange={(v) => setTab(v as Tab)}
            className="!inline-grid !w-auto"
          />
        </div>

        <div className="mt-10">
          {tab === "ongoing" && <PricingOngoingPanel />}
          {tab === "project" && <PricingProjectPanel />}
          {tab === "ai" && <PricingAiPanel />}
        </div>
      </div>
    </div>
  );
}
