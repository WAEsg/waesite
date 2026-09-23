import Link from "next/link";
import { footerContact, footerHireAtScale, footerLinks, navLinks } from "@/lib/landing-data";
import { buttonOutlineLightSm } from "@/components/ui/button-classes";
import { Logo } from "@/components/ui/logo";

// Matches the prototype's .footer exactly: a 4-column grid (brand blurb,
// Explore, Support, a standalone "Hiring at scale?" panel with its own
// CTA button — not a link tucked into the Support list), then a
// .footer__base row with the copyright and a decorative monospace MRZ
// passport strip. Column headings and links both use the exact colors
// from `.footer h2` / `.footer a` (#8FA7D3 mono-caps headings, #DCE8FF
// links that go solid white + underline on hover) — not the generic
// mist/frost tokens used elsewhere on the page.
const exploreLinks = navLinks.filter((link) => link.label !== "FAQ");
const footerLinkClass = "text-[#DCE8FF] transition-colors hover:text-white hover:underline";
const footerHeadingClass = "font-mono text-[0.6875rem] font-bold tracking-[0.14em] text-[#8FA7D3] uppercase";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-deep-navy px-4 py-14 text-[#BACBEA]">
      <div className="mx-auto grid max-w-5xl gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Link href="/" aria-label="WaeWork home">
            <Logo variant="dark" />
          </Link>
          <p className="mt-3 text-sm">
            A WAE (We Are Everywhere) company. A global marketplace connecting hirers with verified remote talent,
            worldwide.
          </p>
          <p className="mt-3 text-sm">
            <a href={`mailto:${footerContact.email}`} className={footerLinkClass}>
              {footerContact.email}
            </a>
            <br />
            {footerContact.location}
          </p>
        </div>

        <nav aria-label="Explore" className="flex flex-col gap-2.5 text-[0.9375rem]">
          <h2 className={`mb-1 ${footerHeadingClass}`}>Explore</h2>
          {exploreLinks.map((link) => (
            <Link key={link.href} href={link.href} className={footerLinkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Support" className="flex flex-col gap-2.5 text-[0.9375rem]">
          <h2 className={`mb-1 ${footerHeadingClass}`}>Support</h2>
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className={footerLinkClass}>
              {link.label}
            </Link>
          ))}
          <Link href="/terms" className={footerLinkClass}>
            Terms of Service
          </Link>
          <Link href="/privacy" className={footerLinkClass}>
            Privacy Policy
          </Link>
        </nav>

        <div>
          <h2 className={`mb-1 ${footerHeadingClass}`}>{footerHireAtScale.heading}</h2>
          <p className="mt-3.5 text-sm">{footerHireAtScale.blurb}</p>
          <Link href={footerHireAtScale.href} className={`${buttonOutlineLightSm} mt-3.5`}>
            {footerHireAtScale.label}
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-5xl flex-col items-center gap-2.5 border-t border-white/[0.14] pt-[22px] text-[0.8125rem] sm:flex-row sm:justify-between sm:gap-6">
        <span>&copy; {new Date().getFullYear()} WAE Pte. Ltd.</span>
        <span aria-hidden className="min-w-0 overflow-hidden font-mono whitespace-nowrap tracking-[0.12em] opacity-55">
          P&lt;SGP&lt;WAEWORK&lt;&lt;VERIFIED&lt;TALENT&lt;WORLDWIDE&lt;&lt;&lt;&lt;&lt;&lt;
        </span>
      </div>
    </footer>
  );
}
