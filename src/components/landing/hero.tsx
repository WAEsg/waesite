import Link from "next/link";
import { buttonPrimaryDark, buttonSecondaryDark } from "@/components/ui/glass";
import { KineticHeadline } from "./kinetic-headline";
import { Globe } from "./globe";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-16 pt-20 sm:pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <KineticHeadline text="Great talent isn't confined to one zip code." />
          <p className="mx-auto mt-5 max-w-lg text-lg text-mist lg:mx-0">
            Built for teams who need to move fast without a big HR
            department. Get matched with a vetted, identity-verified Talent
            Partner from anywhere in the world — with payment protection
            built in from day one.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/signup?role=hirer" className={buttonPrimaryDark}>
              I&apos;m Hiring
            </Link>
            <Link href="/signup?role=talent" className={buttonSecondaryDark}>
              I&apos;m Looking for Work
            </Link>
          </div>
        </div>

        <Globe />
      </div>
    </section>
  );
}
