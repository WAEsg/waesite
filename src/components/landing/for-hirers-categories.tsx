import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { skillClusters } from "@/lib/skills-data";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkArrow } from "@/components/ui/link-arrow";
import { Reveal } from "@/components/ui/reveal";
import { ClusterIcon } from "./cluster-icons";

// The prototype's `.hr-cats` — a flat row-style list (icon + name/count on
// the left, arrow on the right), not the card grid used by the homepage's
// "Browse by skill" teaser.
export function ForHirersCategories() {
  return (
    <div id="hirers-categories" className="px-4 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <EyebrowLabel>What can you hire for?</EyebrowLabel>
          <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
            Every skill a growing business needs
          </h2>
          <p className="mt-2 text-slate">Pick a category to see the roles inside it.</p>
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillClusters.map((cluster, i) => (
            <Reveal key={cluster.slug} variant="up" delayMs={i * 60}>
              <Link
                href={`/for-talent#${cluster.slug}`}
                className="group flex min-h-[76px] items-center gap-3.5 rounded-2xl border border-transparent bg-white p-4 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-[3px] hover:border-mist hover:shadow-1"
              >
                <span className="badge-ico flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cloud-blue text-voyage-blue">
                  <ClusterIcon icon={cluster.icon} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-display text-[1.0625rem] leading-[1.25] font-bold tracking-[-0.01em] text-ink-navy">{cluster.label}</span>
                  <span className="font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-slate uppercase">
                    {cluster.roles.length} roles
                    {cluster.slug === "specialized-other" && " · not listed? We'll source it"}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-mist transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-voyage-blue" aria-hidden />
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal variant="fade" delayMs={200}>
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-frost px-5 py-4">
            <span className="badge-ico flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-voyage-blue shadow-[inset_0_0_0_1px_#DCE7F7]">
              <Users className="h-5 w-5" aria-hidden />
            </span>
            <p className="min-w-[300px] flex-1 text-slate">
              <strong className="text-ink-navy">Need a whole team?</strong> If you&apos;re building a team rather than
              filling one role, we&apos;ll set it up with you.
            </p>
            <LinkArrow href="/contact?topic=scale">Talk to us about hiring at scale</LinkArrow>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
