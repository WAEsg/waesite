"use client";

import { AlertTriangle } from "lucide-react";
import { glassPanelLight } from "@/components/ui/glass";
import { buttonPrimarySm } from "@/components/ui/button-classes";

export function PaymentFailedState({
  message = "We couldn't process that payment. Your card may have been declined, or the charge timed out.",
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className={`flex flex-col items-center gap-3 p-8 text-center ${glassPanelLight}`}>
      <div className="rounded-full bg-error-bg p-3">
        <AlertTriangle className="h-6 w-6 text-error" />
      </div>
      <h3 className="font-display text-lg font-bold text-ink-navy">Payment didn&apos;t go through</h3>
      <p className="max-w-sm text-sm text-slate">{message}</p>
      <button type="button" onClick={onRetry} className={buttonPrimarySm}>
        Try again
      </button>
    </div>
  );
}
