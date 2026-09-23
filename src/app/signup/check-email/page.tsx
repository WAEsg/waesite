"use client";

import { Mail } from "lucide-react";
import { SignupWizardShell } from "@/components/auth/signup-wizard-shell";
import { useRolePreference } from "@/lib/use-role-preference";

export default function CheckEmailPage() {
  const [role] = useRolePreference();

  return (
    <SignupWizardShell
      step={1}
      role={role}
      stepLabel="Step 1 of 3"
      title="Check your email"
      lede="We've sent you a confirmation link. Click it to finish setting up your account."
    >
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-white p-6 shadow-1">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-cloud-blue text-voyage-blue">
          <Mail className="h-6 w-6" aria-hidden />
        </span>
        <p className="text-slate">
          Once you confirm your email, you&apos;ll land on step 2 to finish setting up your profile.
        </p>
      </div>
    </SignupWizardShell>
  );
}
