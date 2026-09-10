"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { skillClusters, allLongTailRoles } from "@/lib/skills-data";
import { buttonSecondaryDark, glassCard, glassCardHover, glowShadow, neumorphicInset } from "@/components/ui/glass";
import { ClusterIcon } from "./cluster-icons";

// Category-first browsing, Fiverr-style — no individual talent profiles
// are ever shown here, only skill clusters, roles, and long-tail pages.
// The cluster list stays fixed; only the expanded role detail grows.
// Deep links from elsewhere (e.g. /#admin-support) rely on the native
// browser anchor scroll to each card's id — no JS-driven auto-expand,
// so there's no server/client render mismatch to manage.
export function SkillsExplorer() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const prefersReducedMotion = useReducedMotion();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return allLongTailRoles.filter((r) => r.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <label className="mx-auto block max-w-md">
        <span className="sr-only">Search for a skill or role</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a skill, e.g. “bookkeeping” or “Shopify”"
          className={`w-full min-h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-frost placeholder:text-mist/50 outline-none transition focus:border-passport-sky focus:ring-2 focus:ring-passport-sky/40 ${neumorphicInset}`}
        />
      </label>

      {results ? (
        <div className="mt-8">
          {results.length === 0 ? (
            <p className="text-center text-mist">
              No exact match — tell us what you need below and we&apos;ll
              source it.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((role) => {
                const cluster = skillClusters.find((c) => c.slug === role.clusterSlug);
                return (
                  <Link
                    key={role.slug}
                    href={`/hire/${role.slug}`}
                    className={`flex min-h-11 flex-col justify-center p-4 ${glassCard} ${glassCardHover}`}
                  >
                    <span className="font-semibold text-frost">{role.title}</span>
                    {cluster && (
                      <span className="text-xs text-mist">{cluster.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillClusters.map((cluster) => {
            const isOpen = expanded === cluster.slug;
            return (
              <div
                key={cluster.slug}
                id={cluster.slug}
                className={`scroll-mt-24 p-5 ${glassCard} ${!isOpen ? glassCardHover : ""} ${
                  isOpen ? "sm:col-span-2 lg:col-span-3" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : cluster.slug)}
                  aria-expanded={isOpen}
                  className="flex w-full min-h-11 items-start justify-between gap-3 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] ${glowShadow}`}>
                      <ClusterIcon icon={cluster.icon} />
                    </div>
                    <div>
                      <span className="block font-display font-semibold text-frost">
                        {cluster.label}
                      </span>
                      <span className="mt-1 block text-sm text-mist">
                        {cluster.roles
                          .slice(0, 3)
                          .map((r) => r.title)
                          .join(", ")}
                      </span>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`mt-1 shrink-0 text-passport-sky transition-transform ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-sm text-mist">{cluster.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {cluster.roles.map((role) => (
                          <Link
                            key={role.slug}
                            href={`/hire/${role.slug}`}
                            className="flex min-h-11 items-center rounded-full border border-white/10 bg-white/[0.05] px-3 text-sm font-medium text-mist backdrop-blur-sm transition hover:border-passport-sky/50 hover:text-frost"
                          >
                            {role.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      <div className={`mt-8 flex flex-col items-center gap-3 p-6 text-center ${glassCard}`}>
        <p className="font-display font-semibold text-frost">
          Don&apos;t see what you need?
        </p>
        <p className="text-sm text-mist">
          Our role list keeps growing — tell us what you&apos;re looking
          for and we&apos;ll source it.
        </p>
        <Link href="/contact" className={buttonSecondaryDark}>
          Tell us what you need
        </Link>
      </div>
    </div>
  );
}
