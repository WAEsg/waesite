import Link from "next/link";
import { Check } from "lucide-react";
import { buttonPrimary, buttonSecondary } from "@/components/ui/button-classes";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { Reveal } from "@/components/ui/reveal";
import { KineticHeadline } from "./kinetic-headline";
import { HeroGlobeStage } from "./hero-globe-stage";

const HERO_BULLETS = [
  "ID-verified on both sides",
  "Payment held until work is delivered",
  "Backup candidate kept for 90 days",
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-16 pt-20 sm:pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <Reveal variant="fade" immediate>
            <EyebrowLabel dash className="justify-center lg:justify-start">
              Verified remote talent · Worldwide
            </EyebrowLabel>
          </Reveal>
          <div className="mt-3">
            <KineticHeadline
              text="Great talent isn't confined to one postcode."
              accentText="one postcode."
            />
          </div>
          <Reveal variant="up" delayMs={150} immediate>
            <p className="mx-auto mt-5 max-w-lg text-lede leading-[1.55] text-slate lg:mx-0">
              Built for teams who need to move fast without a big HR
              department. Get matched with a vetted, identity-verified
              Talent Partner from anywhere in the world — with payment
              protection built in from day one.
            </p>
          </Reveal>

          <Reveal variant="up" delayMs={220} immediate>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/signup?role=hirer" className={buttonPrimary}>
                I&apos;m Hiring
              </Link>
              <Link href="/signup?role=talent" className={buttonSecondary}>
                I&apos;m Looking for Work
              </Link>
            </div>
          </Reveal>

          <Reveal variant="fade" delayMs={300} immediate>
            <ul className="mx-auto mt-6 flex max-w-lg flex-col gap-2 text-sm text-slate lg:mx-0">
              {HERO_BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-center justify-center gap-2 lg:justify-start">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 stroke-[2.4] text-success" aria-hidden />
                  {bullet}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <HeroGlobeStage />
      </div>
    </section>
  );
}
