import Link from "next/link";
import { DemoBanner } from "@/components/demo-banner";

export function DemoShell({
  name,
  subtitle,
  children,
}: {
  name: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <DemoBanner />
      <header className="flex items-center justify-between border-b border-ink-navy/10 bg-paper-white px-6 py-4">
        <Link
          href="/demo"
          className="font-display text-xl font-bold text-voyage-blue"
        >
          WaeWork
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <div className="text-right">
            <p className="font-semibold text-ink-navy">{name}</p>
            <p className="text-ink-navy/60">{subtitle}</p>
          </div>
          <Link
            href="/demo"
            className="rounded-xl border border-ink-navy/15 px-3 py-1.5 font-semibold text-ink-navy transition hover:border-voyage-blue hover:text-voyage-blue"
          >
            Log out
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-cloud-blue px-6 py-10">{children}</main>
    </div>
  );
}
