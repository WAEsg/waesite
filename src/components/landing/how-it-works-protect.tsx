import { Briefcase, Check, IdCard, RefreshCw, Scale, User, Users, Wallet } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { Reveal } from "@/components/ui/reveal";

const ITEMS = [
  {
    icon: IdCard,
    title: "Identity verification, both sides",
    chip: "Both sides",
    description: (
      <>
        Every hirer and every Talent Partner is verified through <strong className="font-bold text-ink-navy">Stripe Identity</strong> before
        they can post a role or apply to one, so you always know who you&apos;re working with.
      </>
    ),
    lead: true,
  },
  {
    icon: Wallet,
    title: "Payment protection that matches the work",
    chip: "Both sides",
    description: (
      <>
        For an ongoing Team Extension, funds are held and released <strong className="font-bold text-ink-navy">every 15 days</strong>: partial
        at day 15, the rest at day 30, so neither side is exposed to a full month of risk. For project-based work,
        release is tied to agreed milestones instead.
      </>
    ),
  },
  {
    icon: Users,
    title: "A backup bench, just in case",
    chip: "Hirers",
    chipPlain: true,
    description: (
      <>
        For every placement, we keep a shortlisted backup candidate on file for the{" "}
        <strong className="font-bold text-ink-navy">first 90 days</strong>. If something falls through early on,
        you&apos;re not starting the search from zero.
      </>
    ),
  },
  {
    icon: RefreshCw,
    title: "Replacement guarantee and a clear plan if someone goes quiet",
    chip: "Hirers",
    chipPlain: true,
    description:
      "If a Talent Partner goes unresponsive, a defined response window kicks in automatically, so there's no ambiguity about what happens next. If it doesn't work out early on, we'll help place a replacement.",
  },
  {
    icon: Scale,
    title: "Neutral dispute resolution",
    chip: "Both sides",
    description:
      "If a hirer and Talent Partner disagree on delivered work, our support team mediates fairly for both sides. It's a service everyone on WaeWork is covered by, not a deduction against either party.",
  },
];

export function HowItWorksProtect() {
  return (
    <div id="how-it-works-protect" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <EyebrowLabel>Built-in protection</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            What protects you, and them
          </h2>
          <p className="mt-2 text-lede leading-[1.55] text-slate">
            If this is your first time hiring or working remotely across borders, here&apos;s exactly what&apos;s in
            place.
          </p>
        </div>

        <ul className="mt-8 flex flex-col">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} variant="up" delayMs={i * 90}>
                <li className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row">
                  <span className="badge-ico flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-xl font-bold text-ink-navy">{item.title}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.08em] uppercase ${
                          item.chipPlain ? "bg-white text-slate shadow-[inset_0_0_0_1px_#DCE7F7]" : "bg-cloud-blue text-voyage-blue"
                        }`}
                      >
                        {item.chip}
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-slate">{item.description}</p>

                    {item.lead && (
                      <ul aria-hidden className="mt-4 flex flex-col gap-2 sm:max-w-xs">
                        <li className="flex items-center justify-between gap-3 rounded-full border border-line bg-white py-2 pr-2 pl-3.5">
                          <span className="flex items-center gap-2 text-sm font-bold text-ink-navy">
                            <Briefcase className="h-4 w-4 text-slate" aria-hidden />
                            Hirer
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.06em] text-success uppercase">
                            <Check className="h-3 w-3" aria-hidden />
                            Verified
                          </span>
                        </li>
                        <li className="flex items-center justify-between gap-3 rounded-full border border-line bg-white py-2 pr-2 pl-3.5">
                          <span className="flex items-center gap-2 text-sm font-bold text-ink-navy">
                            <User className="h-4 w-4 text-slate" aria-hidden />
                            Talent Partner
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.06em] text-success uppercase">
                            <Check className="h-3 w-3" aria-hidden />
                            Verified
                          </span>
                        </li>
                      </ul>
                    )}
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
