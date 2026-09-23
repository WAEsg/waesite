import Link from "next/link";
import { glassCardLight } from "@/components/ui/glass";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-paper-white px-4 py-12 text-ink-navy">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-cloud-blue/50 via-paper-white to-paper-white"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-passport-sky/15 blur-[100px]"
        aria-hidden="true"
      />

      <div className={`w-full max-w-md p-8 ${glassCardLight}`}>
        <Link href="/" className="flex justify-center">
          <span className="font-display text-2xl font-bold text-ink-navy">
            WaeWork
          </span>
        </Link>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
