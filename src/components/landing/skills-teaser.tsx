import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { skillClusters } from "@/lib/skills-data";
import { glassCardLight, glassCardLightHover } from "@/components/ui/glass";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { Reveal } from "@/components/ui/reveal";
import { ClusterIcon } from "./cluster-icons";

// Home page teaser — exact structure from the prototype's "Browse by
// skill" band: eyebrow + headline, a 3-col grid of category cards (icon,
// role count chip, category name, a short role list, "See all N roles"
// link), then a role-dependent hiring/looking-for-work prompt.
export function SkillsTeaser() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="max-w-xl">
        <EyebrowLabel dash>Browse by skill</EyebrowLabel>
        <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
          Talent Partners across every skill a growing business needs, worldwide
        </h2>
        <p className="mt-2 text-slate">Pick a category to see the roles inside it.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillClusters.map((cluster, i) => (
          <Reveal key={cluster.slug} variant="up" delayMs={i * 70}>
            <Link
              href={`/for-talent#${cluster.slug}`}
              className={`card-hover group relative block p-5 ${glassCardLight} ${glassCardLightHover}`}
            >
              <div className="flex items-start justify-between">
                <span className="badge-ico flex h-12 w-12 items-center justify-center rounded-[14px] bg-cloud-blue">
                  <ClusterIcon icon={cluster.icon} />
                </span>
                <span className="rounded-full bg-cloud-blue px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-voyage-blue uppercase">
                  {cluster.roles.length} roles
                </span>
              </div>
              <h3 className="mt-4 font-display font-bold text-ink-navy">{cluster.label}</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate">
                {cluster.roles.slice(0, 3).map((role) => (
                  <li key={role.slug}>{role.title}</li>
                ))}
              </ul>
              <span className="mt-4 flex items-center gap-2 text-sm font-extrabold text-voyage-blue">
                See all {cluster.roles.length} roles
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal variant="fade" delayMs={200}>
        <div className={`mt-6 flex flex-wrap items-center gap-4 p-5 ${glassCardLight}`}>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
            <Search className="h-5 w-5" aria-hidden />
          </span>
          <p className="flex-1 text-sm text-ink-navy">
            <strong className="font-extrabold">Hiring?</strong> Post a role and we&apos;ll match you from the vetted pool.
            Talent isn&apos;t listed publicly, so there are no profiles to scroll through.
          </p>
          <Link href="/signup?role=hirer" className="flex items-center gap-2 text-sm font-extrabold text-voyage-blue">
            Post a role
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
