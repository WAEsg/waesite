"use client";

import { useActionState } from "react";
import { saveHirerProfile, type ProfileActionState } from "./actions";
import { FormField, FormError, SubmitButton } from "@/components/ui/form-field";
import { glassCardLight } from "@/components/ui/glass";

const initial: ProfileActionState = { error: null };

type Profile = {
  company_name: string | null;
  uen: string | null;
  company_size: string | null;
  industry: string | null;
  website: string | null;
  description: string | null;
} | null;

export function CompanyProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(saveHirerProfile, initial);

  return (
    <form action={formAction} className={`space-y-4 p-6 ${glassCardLight}`}>
      <FormField
        label="Company name"
        name="company_name"
        defaultValue={profile?.company_name ?? ""}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="UEN" name="uen" required={false} defaultValue={profile?.uen ?? ""} />
        <FormField
          label="Company size"
          name="company_size"
          required={false}
          defaultValue={profile?.company_size ?? ""}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Industry"
          name="industry"
          required={false}
          defaultValue={profile?.industry ?? ""}
        />
        <FormField
          label="Website"
          name="website"
          required={false}
          defaultValue={profile?.website ?? ""}
          urlField
        />
      </div>
      <label className="block text-sm font-semibold text-ink-navy">
        Description
        <textarea
          name="description"
          rows={4}
          defaultValue={profile?.description ?? ""}
          className="mt-1 w-full rounded-xl border border-line bg-paper-white px-4 py-2.5 text-base font-normal text-ink-navy outline-none transition focus:border-voyage-blue focus:ring-2 focus:ring-passport-sky/40"
        />
      </label>
      <FormError message={state.error} />
      <SubmitButton pending={pending}>Save</SubmitButton>
    </form>
  );
}
