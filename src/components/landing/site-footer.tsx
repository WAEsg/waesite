import Link from "next/link";
import { footerContact, footerHireAtScale, footerLinks, navLinks } from "@/lib/landing-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-abyss px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <span className="font-display text-xl font-bold text-frost">
            WaeWork
          </span>
          <p className="mt-2 text-sm text-mist">
            A WAE (We Are Everywhere) company. A global marketplace
            connecting hirers with verified remote talent, worldwide.
          </p>
          <p className="mt-3 text-sm text-mist">{footerContact.email}</p>
          <p className="text-sm text-mist">{footerContact.location}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-frost">Explore</span>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-mist hover:text-frost">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-frost">Support</span>
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-mist hover:text-frost">
              {link.label}
            </Link>
          ))}
          <Link href="/terms" className="text-mist hover:text-frost">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-mist hover:text-frost">
            Privacy Policy
          </Link>
          <Link href={footerHireAtScale.href} className="mt-2 text-mist hover:text-frost">
            {footerHireAtScale.label}
          </Link>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-5xl text-xs text-mist/60">
        Terms of Service and Privacy Policy are placeholder content and need
        real legal review before launch. &copy; {new Date().getFullYear()}{" "}
        WAE Pte. Ltd.
      </p>
    </footer>
  );
}
