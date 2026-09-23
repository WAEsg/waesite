"use client";

import { useActionState } from "react";
import { promoteToAdmin, type AdminActionState } from "../actions";
import { buttonPrimary } from "@/components/ui/button-classes";

const initial: AdminActionState = { error: null };

export function PromoteAdminForm() {
  const [state, formAction, pending] = useActionState(promoteToAdmin, initial);

  return (
    <form action={formAction} className="space-y-3">
      <label className="block">
        <span className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
          Email address
        </span>
        <input
          type="email"
          name="email"
          required
          placeholder="teammate@company.com"
          className="mt-1 w-full rounded-xl border border-line bg-paper-white px-3 py-2 text-sm text-ink-navy outline-none focus:border-voyage-blue"
        />
      </label>
      <p className="text-xs text-slate">
        The email must belong to an existing WaeWork account — they&apos;ll need to have signed up
        already.
      </p>
      <button type="submit" disabled={pending} className={`text-sm ${buttonPrimary}`}>
        {pending ? "Granting…" : "Grant admin access"}
      </button>
      {state.error && <p className="text-xs text-error">{state.error}</p>}
    </form>
  );
}
