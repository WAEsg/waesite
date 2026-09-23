"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/landing-data";
import { buttonPrimarySm } from "@/components/ui/button-classes";
import { EarlyAccessBadge } from "@/components/ui/early-access-badge";
import { Logo } from "@/components/ui/logo";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" stroke="var(--color-ink-navy)" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="var(--color-ink-navy)" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

// Links may target a hash anchor (e.g. "/#ai-staffing") — those never
// have their own distinct pathname, so they must never be marked
// "active" by comparing against `pathname` (routeOf("/#ai-staffing")
// resolves to "/", which would wrongly match the homepage on every
// visit — the bug this guards against). Only a plain page link can be
// the active one.
function isActiveLink(href: string, pathname: string) {
  return !href.includes("#") && pathname === href;
}

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const activeHref = navLinks.find((link) => isActiveLink(link.href, pathname))?.href;

  function movePill(target?: HTMLElement | null) {
    const pill = pillRef.current;
    if (!pill) return;
    const t = target ?? (activeHref ? linkRefs.current[activeHref] : null);
    if (!t || !t.offsetWidth) {
      pill.style.opacity = "0";
      return;
    }
    pill.style.opacity = "1";
    pill.style.width = `${t.offsetWidth}px`;
    pill.style.transform = `translateX(${t.offsetLeft}px)`;
  }

  useEffect(() => {
    movePill();
    function onResize() {
      movePill();
    }
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => movePill());
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-navy/10 bg-paper-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" aria-label="WaeWork home">
          <Logo />
        </Link>

        <nav
          ref={navRef}
          aria-label="Main"
          onMouseLeave={() => movePill()}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) movePill();
          }}
          className="relative mx-auto hidden items-center gap-0.5 md:flex"
        >
          <span
            ref={pillRef}
            aria-hidden
            className="absolute top-1/2 left-0 -mt-[19px] h-[38px] w-0 rounded-full bg-cloud-blue opacity-0 transition-[transform,width,opacity] duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)]"
          />
          {navLinks.map((link) => {
            const active = isActiveLink(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => {
                  linkRefs.current[link.href] = el;
                }}
                onMouseEnter={(e) => movePill(e.currentTarget)}
                onFocus={(e) => movePill(e.currentTarget)}
                aria-current={active ? "page" : undefined}
                className={`relative z-10 inline-flex items-center gap-1.5 rounded-full px-[13px] py-2.5 text-[0.9375rem] whitespace-nowrap transition-colors ${
                  active ? "font-extrabold text-voyage-blue" : "font-bold text-slate hover:text-voyage-blue"
                }`}
              >
                {link.label}
                {"badge" in link && link.badge && (
                  <span
                    className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#F5A623] shadow-[0_0_0_3px_#FFF3DC]"
                    title="Early access"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-slate transition hover:text-ink-navy md:inline"
          >
            Log in
          </Link>
          <Link href="/signup" className={buttonPrimarySm}>
            Get started
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-navy/15 md:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-ink-navy/10 bg-paper-white/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1 text-sm font-semibold">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href, pathname);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex min-h-11 items-center gap-2 border-l-2 pl-3 transition ${
                      active
                        ? "border-passport-sky font-bold text-ink-navy"
                        : "border-transparent text-slate hover:text-ink-navy"
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
              className="flex min-h-11 items-center justify-center rounded-full border border-ink-navy/15 text-sm font-semibold text-ink-navy"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className={buttonPrimarySm}
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
