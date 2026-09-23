import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";
import { PageTransition } from "@/components/landing/page-transition";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-paper-white text-ink-navy">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-cloud-blue/50 via-paper-white to-paper-white"
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
