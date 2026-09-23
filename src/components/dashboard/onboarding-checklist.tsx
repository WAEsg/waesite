"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import { dismissOnboardingChecklist } from "@/app/dashboard/_shared/onboarding-actions";
import { glassPanelLight } from "@/components/ui/glass";

export type ChecklistItem = {
  label: string;
  href: string;
  completed: boolean;
};

export function OnboardingChecklist({
  items,
  dismissed,
}: {
  items: ChecklistItem[];
  dismissed: boolean;
}) {
  const [hidden, setHidden] = useState(dismissed || items.every((i) => i.completed));
  const [, startTransition] = useTransition();

  if (hidden) return null;

  return (
    <div className={`relative p-5 ${glassPanelLight}`}>
      <button
        type="button"
        aria-label="Dismiss checklist"
        onClick={() => {
          setHidden(true);
          startTransition(() => {
            dismissOnboardingChecklist();
          });
        }}
        className="absolute right-4 top-4 text-slate hover:text-ink-navy"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="font-display text-base font-bold text-ink-navy">Get set up</p>
      <p className="mt-1 text-sm text-slate">
        A few quick steps to get the most out of WaeWork.
      </p>

      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition hover:bg-voyage-blue/5"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  item.completed
                    ? "border-success bg-success text-paper-white"
                    : "border-line text-transparent"
                }`}
              >
                <Check className="h-3 w-3" />
              </span>
              <span
                className={item.completed ? "text-slate line-through" : "text-ink-navy"}
              >
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
