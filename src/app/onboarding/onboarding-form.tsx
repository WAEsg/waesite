"use client";

import { useActionState, useState } from "react";
import { completeOnboarding, type OnboardingActionState } from "./actions";
import { FormField, FormError, SubmitButton } from "@/components/ui/form-field";

const initialState: OnboardingActionState = { error: null };

const roles = [
  {
    value: "hirer",
    title: "I'm hiring",
    description: "Post gigs and retainers, browse vetted talent.",
  },
  {
    value: "talent",
    title: "I'm looking for work",
    description: "Apply to roles and manage your contracts.",
  },
] as const;

export function OnboardingForm({
  defaultRole = null,
}: {
  defaultRole?: "hirer" | "talent" | null;
}) {
  const [state, formAction, pending] = useActionState(
    completeOnboarding,
    initialState
  );
  const [role, setRole] = useState<"hirer" | "talent" | null>(defaultRole);

  return (
    <form action={formAction} className="mt-6 space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {roles.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer rounded-2xl border-2 p-4 transition ${
              role === option.value
                ? "border-voyage-blue bg-cloud-blue"
                : "border-ink-navy/10 hover:border-passport-sky/60"
            }`}
          >
            <input
              type="radio"
              name="role"
              value={option.value}
              required
              defaultChecked={defaultRole === option.value}
              className="sr-only"
              onChange={() => setRole(option.value)}
            />
            <span className="block font-display font-semibold text-ink-navy">
              {option.title}
            </span>
            <span className="mt-1 block text-sm text-ink-navy/70">
              {option.description}
            </span>
          </label>
        ))}
      </div>

      <FormField label="Full name" name="full_name" autoComplete="name" />

      <FormField label="Country" name="country" autoComplete="country-name" />

      {role === "hirer" && (
        <FormField label="Business name" name="business_name" />
      )}

      <FormError message={state.error} />
      <SubmitButton pending={pending}>Continue</SubmitButton>
    </form>
  );
}
