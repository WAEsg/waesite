"use client";

import Link from "next/link";
import { AlertOctagon } from "lucide-react";
import { glassPanelLight } from "@/components/ui/glass";
import { buttonPrimarySm, buttonSecondarySm } from "@/components/ui/button-classes";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-20 text-center">
      <div className={`flex flex-col items-center gap-3 p-8 ${glassPanelLight}`}>
        <div className="rounded-full bg-error-bg p-3">
          <AlertOctagon className="h-6 w-6 text-error" />
        </div>
        <h1 className="font-display text-lg font-bold text-ink-navy">
          Something went wrong loading this page
        </h1>
        <p className="text-sm text-slate">
          This is on our end, not something you did. Try again, or head back to your
          dashboard.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <button type="button" onClick={reset} className={buttonPrimarySm}>
            Try again
          </button>
          <Link href="/dashboard" className={buttonSecondarySm}>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
