"use client";

import { useActionState } from "react";
import { saveTalentProfile, type ProfileActionState } from "./actions";
import { FormField, FormError, SubmitButton } from "@/components/ui/form-field";
import { glassCardLight } from "@/components/ui/glass";

const initial: ProfileActionState = { error: null };

type Profile = {
  headline: string | null;
  bio: string | null;
  skills: string[];
  rate_amount: number | null;
  rate_unit: "hourly" | "monthly" | null;
  years_experience: number | null;
  availability: string | null;
  resume_url: string | null;
  portfolio_links: string[];
} | null;

export function TalentProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(saveTalentProfile, initial);

  return (
    <form action={formAction} className={`space-y-4 p-6 ${glassCardLight}`}>
      <FormField label="Headline" name="headline" defaultValue={profile?.headline ?? ""} />

      <label className="block text-sm font-semibold text-ink-navy">
        Bio
        <textarea
          name="bio"
          rows={4}
          defaultValue={profile?.bio ?? ""}
          className="mt-1 w-full rounded-xl border border-line bg-paper-white px-4 py-2.5 text-base font-normal text-ink-navy outline-none transition focus:border-voyage-blue focus:ring-2 focus:ring-passport-sky/40"
        />
      </label>

      <FormField
        label="Skills (comma-separated)"
        name="skills"
        defaultValue={profile?.skills?.join(", ") ?? ""}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField
          label="Rate"
          name="rate_amount"
          type="number"
          required={false}
          defaultValue={profile?.rate_amount != null ? String(profile.rate_amount) : ""}
        />
        <label className="block text-sm font-semibold text-ink-navy">
          Per
          <select
            name="rate_unit"
            defaultValue={profile?.rate_unit ?? "hourly"}
            className="mt-1 w-full min-h-11 rounded-xl border border-line bg-paper-white px-4 py-2.5 text-base text-ink-navy outline-none focus:border-voyage-blue focus:ring-2 focus:ring-passport-sky/40"
          >
            <option value="hourly">Hour</option>
            <option value="monthly">Month</option>
          </select>
        </label>
        <FormField
          label="Years experience"
          name="years_experience"
          type="number"
          required={false}
          defaultValue={profile?.years_experience != null ? String(profile.years_experience) : ""}
        />
      </div>

      <FormField
        label="Availability"
        name="availability"
        required={false}
        defaultValue={profile?.availability ?? ""}
      />
      <FormField
        label="Resume URL"
        name="resume_url"
        required={false}
        defaultValue={profile?.resume_url ?? ""}
        urlField
      />
      <FormField
        label="Portfolio links (comma-separated)"
        name="portfolio_links"
        required={false}
        defaultValue={profile?.portfolio_links?.join(", ") ?? ""}
      />

      <FormError message={state.error} />
      <SubmitButton pending={pending}>Save</SubmitButton>
    </form>
  );
}
