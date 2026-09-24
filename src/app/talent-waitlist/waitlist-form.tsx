"use client";

import { useActionState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { submitWaitlistSignup, type WaitlistActionState } from "./actions";
import { skillClusters } from "@/lib/skills-data";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { buttonPrimary } from "@/components/ui/button-classes";

const initialState: WaitlistActionState = { status: "idle", message: null };
const fieldClasses =
  "mt-1.5 min-h-[50px] w-full rounded-[10px] border-[1.5px] border-field-line bg-white px-4 py-3 text-base text-ink-navy outline-none transition hover:border-voyage-blue focus:border-voyage-blue focus:ring-4 focus:ring-passport-sky/[0.22]";
const labelClasses = "flex flex-col font-extrabold text-ink-navy";

const AVAILABILITY_OPTIONS = ["Full-time", "Part-time", "Project-based only", "Not sure yet"];

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(submitWaitlistSignup, initialState);

  if (state.status === "sent" || state.status === "duplicate") {
    return (
      <div className="flex flex-col items-start gap-3 py-2">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-success-bg text-success">
          <Check className="h-6 w-6 stroke-[3]" aria-hidden />
        </span>
        <h2 className="font-display text-xl font-bold text-ink-navy">You&apos;re on the list</h2>
        <p className="text-slate">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className={labelClasses}>
        Full name
        <input name="full_name" required autoComplete="name" className={fieldClasses} />
      </label>

      <label className={labelClasses}>
        Email
        <input name="email" type="email" required autoComplete="email" inputMode="email" className={fieldClasses} />
      </label>

      <label className={labelClasses}>
        Skill category
        <select name="skill_category" required defaultValue="" className={fieldClasses}>
          <option value="" disabled>
            Choose the closest fit
          </option>
          {skillClusters.map((cluster) => (
            <option key={cluster.slug} value={cluster.label}>
              {cluster.label}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClasses}>
        Portfolio or work sample link
        <span className="mb-1.5 text-sm font-normal text-slate">A Drive folder, site, or LinkedIn works fine.</span>
        <input name="portfolio_link" type="url" required placeholder="https://" className={fieldClasses} />
      </label>

      <label className={labelClasses}>
        Availability
        <select name="availability" defaultValue="" className={fieldClasses}>
          <option value="">Choose one</option>
          {AVAILABILITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClasses}>
        Expected rate
        <span className="mb-1.5 text-sm font-normal text-slate">Optional — a rough figure is fine, e.g. &quot;S$20/hr&quot; or &quot;S$1,500/month&quot;.</span>
        <input name="expected_rate" className={fieldClasses} />
      </label>

      <label className={labelClasses}>
        A couple of lines about you
        <span className="mb-1.5 text-sm font-normal text-slate">Optional. What you do, and what kind of work you&apos;re looking for.</span>
        <textarea name="intro_text" rows={4} maxLength={600} className={fieldClasses} />
      </label>

      <TurnstileWidget />

      {state.status === "error" && <p className="rounded-lg bg-error-bg px-4 py-3 text-sm font-bold text-error">{state.message}</p>}

      <button type="submit" disabled={pending} className={`${buttonPrimary} w-full disabled:opacity-60`}>
        {pending ? "Joining…" : "Join the waitlist"}
        {!pending && <ArrowRight className="h-4 w-4" aria-hidden />}
      </button>
    </form>
  );
}
