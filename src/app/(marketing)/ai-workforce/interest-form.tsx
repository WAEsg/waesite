"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { submitAiWorkforceInterest, type AiWorkforceActionState } from "./actions";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { buttonPrimaryDark, neumorphicInset } from "@/components/ui/glass";
import { aiWorkforceRoles } from "@/lib/landing-data";

const initialState: AiWorkforceActionState = { status: "idle", message: null };

const fieldClasses = `mt-1 w-full min-h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-base text-frost placeholder:text-mist/50 outline-none transition focus:border-passport-sky focus:ring-2 focus:ring-passport-sky/40 ${neumorphicInset}`;

function RoleInterestField() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("role") ?? "";

  return (
    <label className="block text-sm font-semibold text-frost">
      Which AI role interests you? (optional)
      <select name="role_interest" defaultValue={preselected} className={fieldClasses}>
        <option value="">Not sure yet</option>
        {aiWorkforceRoles.map((role) => (
          <option key={role.slug} value={role.title}>
            {role.title}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AiWorkforceInterestForm() {
  const [state, formAction, pending] = useActionState(
    submitAiWorkforceInterest,
    initialState
  );

  if (state.status === "sent") {
    return (
      <p className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-success backdrop-blur-sm">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm font-semibold text-frost">
        Business name
        <input name="business_name" required className={fieldClasses} />
      </label>
      <label className="block text-sm font-semibold text-frost">
        Your name
        <input name="contact_name" required className={fieldClasses} />
      </label>
      <label className="block text-sm font-semibold text-frost">
        Email
        <input name="email" type="email" required className={fieldClasses} />
      </label>

      <Suspense fallback={null}>
        <RoleInterestField />
      </Suspense>

      <label className="block text-sm font-semibold text-frost">
        What&apos;s eating up your time?
        <textarea
          name="pain_point"
          required
          rows={4}
          placeholder="Tell us about the workflow you'd want an AI teammate to take on."
          className={fieldClasses}
        />
      </label>

      <TurnstileWidget />

      {state.status === "error" && (
        <p className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-error backdrop-blur-sm">
          {state.message}
        </p>
      )}
      {state.status === "unconfigured" && (
        <p className="rounded-xl border border-alert/30 bg-alert/10 px-4 py-3 text-alert backdrop-blur-sm">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className={`${buttonPrimaryDark} w-full disabled:opacity-60`}>
        {pending ? "Sending…" : "Join Waitlist"}
      </button>
    </form>
  );
}
