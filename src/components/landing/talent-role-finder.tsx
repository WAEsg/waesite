"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MessageCircle, Search, X } from "lucide-react";
import { skillClusters } from "@/lib/skills-data";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { buttonPrimary } from "@/components/ui/button-classes";
import { ClusterIcon } from "./cluster-icons";
import { useRolePreference, type SiteRole } from "@/lib/use-role-preference";

const TOTAL_ROLES = skillClusters.reduce((sum, c) => sum + c.roles.length, 0);
const TRY_WORDS = ["Designer", "Developer", "Assistant", "Sales"];

function AccordionCategory({
  cluster,
  isOpen,
  onToggle,
  query,
  role,
  setRole,
}: {
  cluster: (typeof skillClusters)[number];
  isOpen: boolean;
  onToggle: () => void;
  query: string;
  role: SiteRole;
  setRole: (role: SiteRole) => void;
}) {
  const q = query.trim().toLowerCase();
  const visibleRoles = q ? cluster.roles.filter((r) => r.title.toLowerCase().includes(q)) : cluster.roles;
  if (q && visibleRoles.length === 0) return null;

  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          className="group flex min-h-[64px] w-full items-center justify-between gap-3.5 py-4 text-left"
        >
          <span className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 gap-y-1">
            <span
              className={`badge-ico row-span-2 flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300 ${
                isOpen ? "bg-voyage-blue text-white" : "bg-cloud-blue text-voyage-blue"
              }`}
            >
              <ClusterIcon icon={cluster.icon} />
            </span>
            <span className="self-end font-display text-[1.1875rem] leading-[1.2] font-bold tracking-[-0.01em] text-ink-navy">
              {cluster.label}
            </span>
            <span className="justify-self-start self-start rounded-full bg-white px-2.5 py-1 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-slate uppercase shadow-[inset_0_0_0_1px_#DCE7F7]">
              {visibleRoles.length} roles
            </span>
          </span>
          <span
            aria-hidden
            className={`relative h-8 w-8 shrink-0 rounded-full transition-[background-color,transform] duration-500 ${
              isOpen ? "rotate-180 bg-voyage-blue" : "bg-cloud-blue"
            }`}
          >
            <span className={`absolute top-1/2 left-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm ${isOpen ? "bg-white" : "bg-voyage-blue"}`} />
            <span
              className={`absolute top-1/2 left-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm transition-transform duration-500 ${
                isOpen ? "rotate-0 bg-white" : "rotate-90 bg-voyage-blue"
              }`}
            />
          </span>
        </button>
      </h3>
      <div className="grid transition-[grid-template-rows] duration-[450ms] ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-4 pb-[26px] sm:pl-[66px]">
            <p className="text-slate">{cluster.description}</p>
            <ul className="flex flex-wrap gap-2">
              {visibleRoles.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/hire/${r.slug}`}
                    className="inline-flex min-h-11 items-center rounded-[18px] border-[1.5px] border-line bg-frost px-3.5 py-2 text-[0.9375rem] font-bold text-ink-navy transition-colors hover:border-voyage-blue hover:bg-cloud-blue hover:text-voyage-blue"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
            {role === "hirer" ? (
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/signup?role=hirer" onClick={() => setRole("hirer")} className={buttonPrimary}>
                  Post a role in {cluster.label}
                </Link>
                <span className="text-sm text-slate">
                  You&apos;ll create a hirer account first. We match you from the vetted pool; talent isn&apos;t listed
                  publicly.
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/signup?role=talent" onClick={() => setRole("talent")} className={buttonPrimary}>
                  Apply for {cluster.label} roles
                </Link>
                <span className="text-sm text-slate">You&apos;ll create a free account first.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TalentRoleFinder() {
  const [query, setQuery] = useState("");
  const [openSlug, setOpenSlug] = useState<string>(skillClusters[0].slug);
  const [role, setRole] = useRolePreference();

  const q = query.trim().toLowerCase();
  const matchCount = useMemo(() => {
    if (!q) return null;
    return skillClusters.reduce((sum, c) => sum + c.roles.filter((r) => r.title.toLowerCase().includes(q)).length, 0);
  }, [q]);

  return (
    <div id="talent-roles" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-[clamp(28px,5vw,64px)] lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="flex flex-col gap-7 lg:sticky lg:top-24">
          <div>
            <EyebrowLabel>Browse by skill</EyebrowLabel>
            <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
              What kind of roles are out there
            </h2>
            <p className="mt-2 text-lede leading-[1.55] text-slate">
              Browse by skill, then apply to a specific role once you find your fit.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="talent-search" className="sr-only">
              Search for a skill or role
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate" aria-hidden />
              <input
                id="talent-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. designer, bookkeeper"
                autoComplete="off"
                className="min-h-[54px] w-full rounded-full border-[1.5px] border-field-line bg-white py-2 pr-14 pl-[46px] text-ink-navy placeholder:text-slate focus:border-voyage-blue focus:ring-4 focus:ring-passport-sky/[0.22] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-[5px] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-slate transition-[background-color,color,transform] hover:rotate-90 hover:bg-cloud-blue hover:text-voyage-blue"
                >
                  <X className="h-[18px] w-[18px] stroke-[2.4]" aria-hidden />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-0.5 font-mono text-[0.6875rem] font-bold tracking-[0.14em] text-slate uppercase">Try</span>
              {TRY_WORDS.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => setQuery(word)}
                  aria-pressed={query === word}
                  className={`min-h-11 rounded-full border-[1.5px] px-4 font-bold transition-[background-color,border-color,transform,color] hover:-translate-y-0.5 ${
                    query === word ? "border-voyage-blue bg-voyage-blue text-white" : "border-mist bg-white text-voyage-blue hover:border-passport-sky hover:bg-cloud-blue"
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>
            <p role="status" className="min-h-[1.45em] font-mono text-[0.8125rem] leading-[1.45] font-bold tracking-[0.03em] text-slate">
              {q ? `${matchCount} role${matchCount === 1 ? "" : "s"} match "${query}"` : `${TOTAL_ROLES} roles across ${skillClusters.length} categories`}
            </p>
          </div>
        </div>

        <div>
          <div className="border-t border-line">
            {skillClusters.map((cluster) => (
              <AccordionCategory
                key={cluster.slug}
                cluster={cluster}
                query={query}
                role={role}
                setRole={setRole}
                isOpen={q ? true : openSlug === cluster.slug}
                onToggle={() => setOpenSlug((current) => (current === cluster.slug ? "" : cluster.slug))}
              />
            ))}
          </div>

          {q && matchCount === 0 && (
            <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border-[1.5px] border-dashed border-mist p-6">
              <span className="badge-ico flex h-11 w-11 items-center justify-center rounded-xl bg-cloud-blue text-voyage-blue">
                <Search className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-display text-xl font-bold text-ink-navy">No roles match your search yet</h3>
              <p className="text-slate">
                Our role list keeps growing. Check the spelling, try a broader word like &quot;design&quot; or
                &quot;support&quot;, or tell us what you&apos;re looking for and we&apos;ll source it.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact?topic=applying" className={buttonPrimary}>
                  Tell us what you&apos;re looking for
                </Link>
                <button type="button" onClick={() => setQuery("")} className="min-h-11 font-bold text-voyage-blue">
                  Clear search
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 flex items-start gap-3 rounded-2xl bg-frost px-[18px] py-4 text-slate">
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-voyage-blue" aria-hidden />
            <span>
              <strong className="text-ink-navy">Don&apos;t see your role?</strong> Our role list keeps growing.{" "}
              <Link href="/contact?topic=applying" className="font-extrabold text-voyage-blue">
                Tell us what you&apos;re looking for
              </Link>{" "}
              and we&apos;ll source it.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
