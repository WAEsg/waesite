import { Calendar, Check, IdCard, Lock, PenLine, Shield, Globe2, Wallet } from "lucide-react";
import type { SiteRole } from "@/lib/use-role-preference";

const POINTS: Record<"hirer" | "talent" | "none", { icon: React.ComponentType<{ className?: string }>; title: string; note: string }[]> = {
  hirer: [
    { icon: PenLine, title: "Post a role in minutes", note: "Describe the work, budget, and timeline." },
    { icon: IdCard, title: "Every candidate ID-verified", note: "Every applicant verifies with Stripe Identity before they can apply." },
    { icon: Lock, title: "Payment held until work is delivered", note: "Funds are held via Stripe Connect, not paid out upfront." },
  ],
  talent: [
    { icon: Wallet, title: "Free to join, apply and be placed", note: "WaeWork never charges you to join or get placed. Only a small service fee once work is underway." },
    { icon: Shield, title: "Work with ID-verified hirers", note: "Every hirer verifies with Stripe Identity before they can post a role." },
    { icon: Calendar, title: "Paid every 15 days on ongoing work", note: "Partial at day 15, the rest at day 30. Project work is released by agreed milestones." },
  ],
  none: [
    { icon: IdCard, title: "Identity verification, both sides", note: "Every hirer and every Talent Partner is verified through Stripe Identity." },
    { icon: Lock, title: "Payment protection built in", note: "Funds are held via Stripe Connect and released on a schedule that matches the work." },
    { icon: Globe2, title: "Worldwide on both sides", note: "Hirers and Talent Partners can be anywhere in the world." },
  ],
};

const ROUTE_LABEL: Record<"hirer" | "talent" | "none", string> = {
  hirer: "Hirer",
  talent: "Talent Partner",
  none: "You",
};

// The prototype's `.au-pass` — a boarding-pass chip that swaps its
// stub icon from a lock to a checkmark once verification completes,
// sitting atop the reassurance panel that rewrites itself per role.
export function SignupSidePanel({ role, step }: { role: SiteRole; step: 1 | 2 | 3 }) {
  const key = role ?? "none";
  const points = POINTS[key];
  const verified = step === 3;

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-2xl bg-frost p-[clamp(22px,2.8vw,34px)] shadow-1">
        <div className="inline-flex max-w-full items-stretch self-start overflow-hidden rounded-[14px] border border-line bg-white font-mono shadow-1">
          <div className="flex min-w-0 flex-col gap-1 px-3.5 py-2.5">
            <span className="flex flex-wrap items-center gap-2 text-[0.8125rem] font-bold tracking-[0.06em] text-ink-navy uppercase">
              {ROUTE_LABEL[key]}
              <i className="inline-block h-0 w-3 border-t-2 border-dotted border-passport-sky" aria-hidden />
              WaeWork
            </span>
            <span className="text-[0.6875rem] tracking-[0.03em] text-slate normal-case">Sign-up pass · step {step} of 3</span>
          </div>
          <div
            className={`flex shrink-0 items-center justify-center border-l-2 border-dashed px-3 transition-colors duration-400 ${
              verified ? "border-mist bg-success-bg text-success" : "border-mist bg-cloud-blue text-voyage-blue"
            }`}
          >
            {verified ? <Check className="h-4 w-4 stroke-[2.6]" aria-hidden /> : <Lock className="h-4 w-4 stroke-[2.6]" aria-hidden />}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <h2 className="font-display text-xl font-bold text-ink-navy">
            {role === "hirer" ? "What you get as a hirer" : role === "talent" ? "What you get as a Talent Partner" : "What every account gets"}
          </h2>
          <ul className="flex flex-col gap-5">
            {points.map((point) => {
              const Icon = point.icon;
              return (
                <li key={point.title} className="flex gap-4">
                  <span className="badge-ico flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-voyage-blue shadow-[inset_0_0_0_1px_#DCE7F7]">
                    <Icon className="h-[22px] w-[22px]" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-ink-navy">{point.title}</h3>
                    <p className="mt-0.5 text-sm text-slate">{point.note}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
