import Link from "next/link";
import { Shield, Zap, RefreshCw, Users, Lock, Wallet, Check } from "lucide-react";
import { valueProps } from "@/lib/landing-data";
import { buttonPrimary } from "@/components/ui/button-classes";
import { Reveal } from "@/components/ui/reveal";
import { ReleaseTimeline } from "@/components/ui/release-timeline";

const FEATURE_ICONS = [Zap, RefreshCw, Users];
// Icons are pre-rendered elements, not bare component references — a
// raw function reference can't cross the server/client boundary into
// ReleaseTimeline (a client component), but an already-created React
// element can.
const RELEASE_STAGES = [
  { icon: <Lock className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Day 0", what: "Funds held", note: "Held via Stripe Connect, not paid out upfront." },
  { icon: <Wallet className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Day 15", what: "Partial release", note: "Part of the payment is released to the Talent Partner." },
  { icon: <Check className="h-4 w-4" strokeWidth={3} aria-hidden />, day: "Day 30", what: "Remainder released", note: "Neither side carries a full month of risk." },
];

// The prototype's "hm-why" section — a two-column block, not two separate
// grids: a "Verified" trust card (with the payment-release timeline
// embedded inside it) beside a feature list with icons and a closing CTA.
// Reuses the same `valueProps` data as before — item 3 is the lead card's
// copy, items 0-2 are the feature list — just laid out differently.
export function WhyWaeworkSection() {
  const [feat1, feat2, feat3, lead] = valueProps;
  const features = [feat1, feat2, feat3];

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Reveal variant="left">
          <div className="relative rounded-2xl border border-line bg-white p-6">
            <span
              className="absolute top-[clamp(18px,2.4vw,30px)] right-[clamp(16px,2.4vw,30px)] inline-flex flex-col items-center gap-0.5 rounded-[10px] border-[2.5px] px-3.5 py-2 font-mono text-xs font-bold tracking-[0.16em] uppercase [border-style:double] [mix-blend-mode:multiply]"
              style={{ borderColor: "rgb(23,117,63)", color: "rgb(23,117,63)", transform: "rotate(-7deg)", background: "rgba(255,255,255,.6)" }}
            >
              Verified
              <span className="text-[0.625rem] tracking-[0.12em]">Stripe Identity</span>
            </span>
            <span className="badge-ico flex h-12 w-12 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue transition-[transform,background-color] duration-500">
              <Shield className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="mt-4 max-w-[26ch] text-balance font-display text-[clamp(1.45rem,1.3vw+1rem,1.95rem)] leading-[1.14] font-bold tracking-[-0.02em] text-ink-navy">
              {lead.title}
            </h3>
            <p className="mt-1.5 max-w-[62ch] text-sm text-slate">{lead.description}</p>

            <div className="mt-6">
              <p className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-slate uppercase">
                Ongoing Team Extension · how payment is released
              </p>
              <div className="mt-4">
                <ReleaseTimeline stages={RELEASE_STAGES} />
              </div>
              <p className="mt-4 text-xs text-slate">
                For project-based work, release is tied to agreed milestones instead.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col">
          {features.map((feature, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <Reveal key={feature.title} variant="up" delayMs={i * 110}>
                <div className={`card-hover flex gap-4 py-4 ${i > 0 ? "border-t border-line" : ""}`}>
                  <span className="badge-ico flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-display font-bold tracking-tight text-ink-navy">{feature.title}</h3>
                    <p className="text-sm text-slate">{feature.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
          <Reveal variant="up" delayMs={features.length * 110}>
            <div className="mt-2 pt-2">
              <Link href="/signup?role=hirer" className={buttonPrimary}>
                Post a role
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
