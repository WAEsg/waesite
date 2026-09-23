import Link from "next/link";
import { ArrowRight, Briefcase, IdCard, Shield, User } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { buttonPrimary } from "@/components/ui/button-classes";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  { icon: User, title: "Sign up", description: "Create your account with an email and password. It takes about a minute, and it's free." },
  { icon: IdCard, title: "Verify with Stripe Identity", description: "A quick government-ID check, backed by Stripe. It comes before you can apply to a role." },
  { icon: Shield, title: "Get your “Verified” badge", description: "The badge appears on your profile to hirers you're matched with. Your profile is never listed publicly." },
  { icon: Briefcase, title: "Apply to any open role", description: "Once verified, you can apply to project-based work or an ongoing Team Extension, with hirers worldwide." },
];

export function ForTalentVerification() {
  return (
    <div className="bg-frost px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <EyebrowLabel>Verification process</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            Get verified, then apply to any open role
          </h2>
          <p className="mt-2 text-lede leading-[1.55] text-slate">
            Every hirer goes through the same check before they can post a role, so you always know who you&apos;re
            working with.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} variant="up" delayMs={i * 90}>
                <div className="flex h-full flex-col gap-2.5">
                  <span className="badge-ico flex h-12 w-12 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="font-mono text-xs font-bold tracking-[0.14em] text-voyage-blue uppercase">
                    STEP {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink-navy">{step.title}</h3>
                  <p className="text-slate">{step.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-10">
          <Link href="/signup?role=talent" className={buttonPrimary}>
            Start with step 1 — sign up free
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>
      </div>
    </div>
  );
}
