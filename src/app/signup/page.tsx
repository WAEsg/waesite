"use client";

import { SignupWizardShell } from "@/components/auth/signup-wizard-shell";
import { useRolePreference } from "@/lib/use-role-preference";
import { SignupForm } from "./signup-form";

export default function SignUpPage() {
  const [role] = useRolePreference();

  return (
    <SignupWizardShell
      step={1}
      role={role}
      stepLabel="Step 1 of 3"
      title="Create your account"
      lede="Takes about a minute. Tell us which side you're on first, so every step after this fits you."
    >
      <SignupForm />
    </SignupWizardShell>
  );
}
