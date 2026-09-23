import { IdCard, RefreshCw, Scale } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { Reveal } from "@/components/ui/reveal";

const ITEMS = [
  { icon: IdCard, title: "Ongoing verification", note: "Every hirer and every Talent Partner is verified through Stripe Identity before they can post a role or apply to one." },
  { icon: RefreshCw, title: "Backup coverage", note: "For every placement, we keep a shortlisted backup candidate on file for the first 90 days." },
  { icon: Scale, title: "Neutral dispute support", note: "If a hirer and Talent Partner disagree on delivered work, our support team mediates fairly for both sides. It's a service everyone is covered by, not a deduction against either party." },
];

export function PricingFeeExplainer() {
  return (
    <div className="bg-frost px-4 py-14">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-6">
          <div>
            <EyebrowLabel>Where the fee goes</EyebrowLabel>
            <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
              What the fee pays for
            </h2>
          </div>
          <div className="flex items-start gap-4">
            <span
              className="inline-flex shrink-0 flex-col items-center gap-0.5 rounded-[10px] border-[2.5px] px-3.5 py-2 font-mono text-xs font-bold tracking-[0.16em] uppercase [border-style:double] [mix-blend-mode:multiply]"
              style={{ borderColor: "rgb(23,117,63)", color: "rgb(23,117,63)", transform: "rotate(-7deg)", background: "rgba(255,255,255,.6)" }}
            >
              Free to join
              <span className="text-[0.625rem] tracking-[0.12em]">Talent Partners</span>
            </span>
            <p className="text-slate">
              Talent never pays to join or apply — only a small service fee once work is underway, which funds
              verification, backup coverage, and dispute support.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} variant="up" delayMs={i * 120}>
                <div className="flex gap-4">
                  <span className="badge-ico flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink-navy">{item.title}</h3>
                    <p className="mt-1 text-slate">{item.note}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
