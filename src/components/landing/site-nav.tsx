"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { navLinks } from "@/lib/landing-data";
import { buttonPrimaryDarkSm } from "@/components/ui/glass";
import { EarlyAccessBadge } from "@/components/ui/early-access-badge";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" stroke="var(--color-frost)" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="var(--color-frost)" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

// Links may target a hash anchor (e.g. "/#ai-staffing") — active-state
// comparison uses the route only, ignoring the hash, so a same-page
// anchor doesn't need its own distinct pathname to be treated sensibly.
function routeOf(href: string) {
  return href.split("#")[0];
}

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-abyss/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl font-bold text-frost">
          WaeWork
        </Link>

        <ul className="hidden items-center gap-5 md:flex lg:gap-6">
          {navLinks.map((link) => {
            const active = pathname === routeOf(link.href);
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={`relative inline-flex items-center gap-1.5 pb-1 transition-colors ${
                    active
                      ? "text-[16px] font-bold text-frost"
                      : "text-[15px] font-semibold text-mist hover:text-frost"
                  }`}
                >
                  {link.label}
                  {"badge" in link && link.badge && <EarlyAccessBadge compact />}
                  {active && (
                    <motion.span
                      key={pathname}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{ transformOrigin: "left" }}
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-passport-sky"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-mist transition hover:text-frost md:inline"
          >
            Log in
          </Link>
          <Link href="/signup" className={buttonPrimaryDarkSm}>
            Get Started
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-lg md:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-abyss/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1 text-sm font-semibold">
            {navLinks.map((link) => {
              const active = pathname === routeOf(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex min-h-11 items-center gap-2 border-l-2 pl-3 transition ${
                      active
                        ? "border-passport-sky font-bold text-frost"
                        : "border-transparent text-mist hover:text-frost"
                    }`}
                  >
                    {link.label}
                    {"badge" in link && link.badge && <EarlyAccessBadge compact />}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center justify-center rounded-xl border border-white/15 text-sm font-semibold text-frost"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className={buttonPrimaryDarkSm}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
