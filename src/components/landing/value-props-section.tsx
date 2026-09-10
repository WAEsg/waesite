import Link from "next/link";
import { valueProps, audienceLine } from "@/lib/landing-data";
import { glassCard, glassCardHover } from "@/components/ui/glass";

export function ValuePropsSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid gap-4 sm:grid-cols-2">
        {valueProps.map((prop) => (
          <div key={prop.title} className={`p-6 ${glassCard} ${glassCardHover}`}>
            <h2 className="font-display font-semibold text-frost">{prop.title}</h2>
            <p className="mt-1.5 text-sm text-mist">{prop.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-mist/70">{audienceLine}</p>
        <Link
          href="/how-it-works"
          className="mt-3 inline-block font-semibold text-passport-sky transition hover:text-frost"
        >
          See how it works →
        </Link>
      </div>
    </section>
  );
}
