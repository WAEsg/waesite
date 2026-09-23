import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonGhost, buttonPrimary } from "@/components/ui/button-classes";
import { footerContact } from "@/lib/landing-data";

const FACTS = [
  { dt: "Company", dd: <>WAE Pte. Ltd.</> },
  { dt: "Base", dd: <>{footerContact.location}</> },
  { dt: "Stage", dd: <>Early-stage</> },
  {
    dt: "Contact",
    dd: (
      <a href={`mailto:${footerContact.email}`} className="inline-block -my-3 py-3">
        {footerContact.email}
      </a>
    ),
  },
];

export function AboutFacts() {
  return (
    <div className="bg-frost px-4 py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-1">
          <dl className="grid grid-cols-2 sm:grid-cols-4">
            {FACTS.map((fact, i) => (
              <div
                key={fact.dt}
                className={`flex min-w-0 flex-col gap-2 border-line p-5 ${i % 2 === 1 ? "border-l border-dashed" : "sm:border-l sm:border-dashed"} ${
                  i >= 2 ? "border-t border-dashed sm:border-t-0" : ""
                } ${i === 0 ? "sm:border-l-0" : ""}`}
              >
                <dt className="font-mono text-[0.6875rem] font-bold tracking-[0.14em] text-slate uppercase">{fact.dt}</dt>
                <dd className="font-mono text-sm font-bold tracking-[0.01em] text-ink-navy [overflow-wrap:anywhere]">{fact.dd}</dd>
              </div>
            ))}
          </dl>
          <p
            aria-hidden
            className="overflow-hidden border-t border-line bg-frost px-5 py-3.5 font-mono text-xs whitespace-nowrap text-slate/70"
            style={{ letterSpacing: "0.2em" }}
          >
            P&lt;SGP&lt;WAE&lt;PTE&lt;LTD&lt;&lt;WE&lt;ARE&lt;EVERYWHERE&lt;&lt;EARLY&lt;STAGE&lt;&lt;HELLO&lt;AT&lt;WAEWORK&lt;CO&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-navy">We&apos;re early-stage, and we&apos;re listening</h2>
            <p className="mt-1 max-w-md text-slate">
              If you have feedback or want to partner with us, reach out at{" "}
              <a href={`mailto:${footerContact.email}`} className="font-extrabold text-voyage-blue">
                {footerContact.email}
              </a>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact?topic=partnering" className={buttonPrimary}>
              Partner with us
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/contact?topic=other" className={buttonGhost}>
              Send feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
