"use client";

import { useActionState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { submitContact, type ContactActionState } from "./actions";
import { CONTACT_TOPICS } from "@/lib/validation/contact";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { buttonPrimary } from "@/components/ui/button-classes";

const initialState: ContactActionState = { status: "idle", message: null };

const fieldClasses =
  "mt-1.5 min-h-[50px] w-full rounded-[10px] border-[1.5px] border-field-line bg-white px-4 py-3 text-base text-ink-navy outline-none transition hover:border-voyage-blue focus:border-voyage-blue focus:ring-4 focus:ring-passport-sky/[0.22]";
const labelClasses = "flex flex-col font-extrabold text-ink-navy";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.status === "sent") {
    return (
      <div className="flex flex-col items-start gap-3 py-4">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-success-bg text-success">
          <Check className="h-6 w-6 stroke-[3]" aria-hidden />
        </span>
        <h2 className="font-display text-xl font-bold text-ink-navy">Message sent</h2>
        <p className="text-slate">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-xl font-bold text-ink-navy">Send us a message</h2>
        <p className="mt-1 text-sm text-slate">Four short fields. If anything&apos;s missing, we&apos;ll point to it in plain English.</p>
      </div>
      <label className={labelClasses}>
        Name
        <input name="name" required autoComplete="name" className={fieldClasses} />
      </label>
      <label className={labelClasses}>
        Email
        <input name="email" type="email" required autoComplete="email" inputMode="email" className={fieldClasses} />
      </label>
      <label className={labelClasses}>
        What&apos;s this about?
        <select name="topic" defaultValue="" required className={fieldClasses}>
          <option value="">Choose a topic</option>
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClasses}>
        Message
        <textarea name="message" required rows={5} minLength={10} className={fieldClasses} />
        <span className="mt-1.5 text-sm font-normal text-slate">A sentence or two is plenty. At least 10 characters.</span>
      </label>

      <TurnstileWidget />

      {state.status === "error" && (
        <p className="rounded-lg bg-error-bg px-4 py-3 text-error">{state.message}</p>
      )}
      {state.status === "unconfigured" && (
        <p className="rounded-lg bg-alert-bg px-4 py-3 text-alert shadow-[inset_0_0_0_1px_#F5C56B]">{state.message}</p>
      )}

      <button type="submit" disabled={pending} className={`${buttonPrimary} w-full disabled:opacity-60`}>
        {pending ? "Sending…" : "Send message"}
        {!pending && <ArrowRight className="h-4 w-4" aria-hidden />}
      </button>
    </form>
  );
}
