import Link from "next/link";
import { skillClusters } from "@/lib/skills-data";
import { glassCard, glassCardHover, glowShadow } from "@/components/ui/glass";
import { ClusterIcon } from "./cluster-icons";

// Lean teaser for the home page — cluster names + a couple of example
// roles, linking out to the full browsing experience on /for-talent.
// No individual talent or live listings here.
export function SkillsTeaser() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="text-center font-display text-2xl font-bold text-frost sm:text-3xl">
        Browse by skill
      </h2>
      <p className="mx-auto mt-2 max-w-md text-center text-mist">
        Talent Partners across every skill a growing business needs,
        worldwide.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillClusters.map((cluster) => (
          <Link
            key={cluster.slug}
            href={`/for-talent#${cluster.slug}`}
            className={`p-5 ${glassCard} ${glassCardHover}`}
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] ${glowShadow}`}>
              <ClusterIcon icon={cluster.icon} />
            </div>
            <span className="mt-3 block font-display font-semibold text-frost">
              {cluster.label}
            </span>
            <span className="mt-1 block text-sm text-mist">
              {cluster.roles
                .slice(0, 2)
                .map((r) => r.title)
                .join(", ")}
              {cluster.roles.length > 2 ? ", …" : ""}
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-mist">
        <Link href="/for-talent" className="font-semibold text-passport-sky hover:text-frost">
          See all roles →
        </Link>
      </p>
    </section>
  );
}
