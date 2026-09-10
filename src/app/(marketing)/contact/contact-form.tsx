"use client";

import { useActionState } from "react";
import { submitContact, type ContactActionState } from "./actions";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { buttonPrimaryDark, neumorphicInset } from "@/components/ui/glass";

const initialState: ContactActionState = { status: "idle", message: null };

const fieldClasses = `mt-1 w-full min-h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-base text-frost placeholder:text-mist/50 outline-none transition focus:border-passport-sky focus:ring-2 focus:ring-passport-sky/40 ${neumorphicInset}`;

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.status === "sent") {
    return (
      <p className="rounded-xl border border-success/30 bg-success/10 backdrop-blur-sm px-4 py-3 text-success">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm font-semibold text-frost">
        Name
        <input name="name" required className={fieldClasses} />
      </label>
      <label className="block text-sm font-semibold text-frost">
        Email
        <input name="email" type="email" required className={fieldClasses} />
      </label>
      <label className="block text-sm font-semibold text-frost">
        Message
        <textarea name="message" required rows={5} className={fieldClasses} />
      </label>

      <TurnstileWidget />

      {state.status === "error" && (
        <p className="rounded-xl border border-error/30 bg-error/10 backdrop-blur-sm px-4 py-3 text-error">
          {state.message}
        </p>
      )}
      {state.status === "unconfigured" && (
        <p className="rounded-xl border border-alert/30 bg-alert/10 backdrop-blur-sm px-4 py-3 text-alert">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className={`${buttonPrimaryDark} w-full disabled:opacity-60`}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
