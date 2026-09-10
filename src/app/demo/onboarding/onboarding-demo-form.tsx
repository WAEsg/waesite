"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormField, FormError, SubmitButton } from "@/components/ui/form-field";

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

export function OnboardingDemoForm() {
  const router = useRouter();
  const [role, setRole] = useState<"hirer" | "talent" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!role) {
      setError("Choose whether you're hiring or looking for work.");
      return;
    }
    router.push(`/demo/dashboard/${role}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
              className="sr-only"
              onChange={() => {
                setRole(option.value);
                setError(null);
              }}
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

      <FormField label="Full name" name="full_name" required={false} />

      <FormField label="Country" name="country" required={false} />

      {role === "hirer" && (
        <FormField label="Business name" name="business_name" required={false} />
      )}

      <FormError message={error} />
      <SubmitButton>Continue</SubmitButton>
    </form>
  );
}
