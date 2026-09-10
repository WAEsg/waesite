import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";
import { PageTransition } from "@/components/landing/page-transition";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="marketing-dark relative flex min-h-full flex-1 flex-col bg-abyss text-frost">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-deep-navy/40 via-abyss to-abyss"
        aria-hidden="true"
      />
      <SiteNav />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
    </div>
  );
}
