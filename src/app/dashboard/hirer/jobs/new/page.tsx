"use client";

import { useActionState } from "react";
import { createJobPost, type JobPostActionState } from "../actions";
import { FormField, FormError, SubmitButton } from "@/components/ui/form-field";
import { glassCardLight } from "@/components/ui/glass";

const initialState: JobPostActionState = { error: null };

export default function NewJobPostPage() {
  const [state, formAction, pending] = useActionState(createJobPost, initialState);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink-navy">Post a job</h1>
      <p className="mt-1 text-sm text-slate">
        Describe the work — talent partners will apply directly.
      </p>

      <form action={formAction} className={`mt-6 space-y-4 p-6 ${glassCardLight}`}>
        <FormField label="Title" name="title" />

        <label className="block text-sm font-semibold text-ink-navy">
          Description
          <textarea
            name="description"
            required
            rows={5}
            className="mt-1 w-full rounded-xl border border-line bg-paper-white px-4 py-2.5 text-base font-normal text-ink-navy outline-none transition focus:border-voyage-blue focus:ring-2 focus:ring-passport-sky/40"
          />
        </label>

        <FormField label="Category" name="category" required={false} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-ink-navy">
            Engagement type
            <select
              name="engagement_type"
              required
              className="mt-1 w-full min-h-11 rounded-xl border border-line bg-paper-white px-4 py-2.5 text-base text-ink-navy outline-none focus:border-voyage-blue focus:ring-2 focus:ring-passport-sky/40"
            >
              <option value="gig">One-off gig</option>
              <option value="ongoing">Ongoing / team extension</option>
            </select>
          </label>

          <label className="block text-sm font-semibold text-ink-navy">
            Budget type
            <select
              name="budget_type"
              required
              className="mt-1 w-full min-h-11 rounded-xl border border-line bg-paper-white px-4 py-2.5 text-base text-ink-navy outline-none focus:border-voyage-blue focus:ring-2 focus:ring-passport-sky/40"
            >
              <option value="fixed">Fixed price</option>
              <option value="hourly">Hourly</option>
            </select>
          </label>
        </div>

        <FormField label="Budget amount (SGD)" name="budget_amount" type="number" />

        <label className="flex items-center gap-2 text-sm text-slate">
          <input type="checkbox" name="urgent" className="h-4 w-4 rounded border-line" />
          Mark as urgent priority
          <span className="text-slate">— S$50–100 flat fee, for 24–48hr matching</span>
        </label>

        <FormError message={state.error} />
        <SubmitButton pending={pending}>Post job</SubmitButton>
      </form>
    </div>
  );
}
