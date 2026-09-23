"use client";

import Link from "next/link";
import { Suspense, useActionState, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, IdCard, Lock } from "lucide-react";
import { signUp, type AuthActionState } from "../(auth)/actions";
import { FormError, SubmitButton } from "@/components/ui/form-field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { trackClientEvent } from "@/lib/analytics-client";
import { useRolePreference } from "@/lib/use-role-preference";

const initialState: AuthActionState = { error: null };
const fieldClasses =
  "mt-1.5 min-h-[50px] w-full rounded-[10px] border-[1.5px] border-field-line bg-white px-4 py-3 text-base text-ink-navy outline-none transition hover:border-voyage-blue focus:border-voyage-blue focus:ring-4 focus:ring-passport-sky/[0.22]";

function strength(password: string): 0 | 1 | 2 | 3 {
  if (password.length < 8) return 0;
  let score = 1;
  if (password.length >= 12) score++;
  if (/[0-9]/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}
const STRENGTH_LABEL = ["Too short", "Weak", "Good", "Strong"];
const STRENGTH_COLOR = ["bg-line", "bg-alert", "bg-voyage-blue", "bg-success"];

function RoleFromQuery({ onDetect }: { onDetect: (role: "hirer" | "talent") => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const intended = searchParams.get("role");
    if (intended === "hirer" || intended === "talent") onDetect(intended);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [role, setRole] = useRolePreference();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roleTouched, setRoleTouched] = useState(false);
  const level = useMemo(() => strength(password), [password]);

  useEffect(() => {
    trackClientEvent("signup_started");
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <RoleFromQuery onDetect={setRole} />
      </Suspense>

      <form action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="font-extrabold text-ink-navy">First, which are you?</span>
          <SegmentedControl
            options={[
              { value: "hirer", label: "I'm hiring" },
              { value: "talent", label: "I'm looking for work" },
            ]}
            value={role}
            onChange={(v) => {
              setRole(v);
              setRoleTouched(true);
            }}
            className="!bg-cloud-blue"
          />
          <input type="hidden" name="role" value={role ?? ""} />
          <p className="text-sm text-slate">
            {role ? (
              <>
                Signing up as a <strong className="text-ink-navy">{role === "hirer" ? "Hirer" : "Talent Partner"}</strong>. Not you? Pick
                the other option.
              </>
            ) : (
              "Choose one to get the right setup"
            )}
          </p>
          {!role && roleTouched && <p className="text-sm font-bold text-error">Please choose one so we know what to show you next.</p>}
        </div>

        <label className="flex flex-col font-extrabold text-ink-navy">
          Email
          <input
            id="signup-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="name@company.com"
            className={fieldClasses}
          />
        </label>

        <div className="flex flex-col gap-2">
          <label htmlFor="signup-password" className="flex flex-col font-extrabold text-ink-navy">
            Password
            <div className="relative">
              <input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${fieldClasses} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg px-2.5 py-2 text-sm font-extrabold text-voyage-blue hover:bg-cloud-blue"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          <div className="flex min-h-5 items-center gap-3">
            <span className="grid max-w-[240px] flex-1 grid-cols-3 gap-1.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <i key={i} className={`block h-1.5 rounded-full transition-colors duration-300 ${i < level ? STRENGTH_COLOR[level] : "bg-line"}`} />
              ))}
            </span>
            {password.length > 0 && <span className="text-[0.8125rem] font-extrabold text-ink-navy">{STRENGTH_LABEL[level]}</span>}
          </div>
          <p className="text-sm text-slate">At least 8 characters</p>
        </div>

        <TurnstileWidget />

        <label className="flex items-start gap-2.5 text-sm text-slate">
          <input
            type="checkbox"
            name="terms_accepted"
            required
            className="mt-0.5 h-4 w-4 rounded border-field-line text-voyage-blue focus:ring-passport-sky/40"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" target="_blank" className="font-extrabold text-voyage-blue">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" target="_blank" className="font-extrabold text-voyage-blue">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <FormError message={state.error} />
        <SubmitButton pending={pending}>
          <span className="flex items-center justify-center gap-2.5">
            {role === "hirer" ? "Create hirer account" : role === "talent" ? "Create Talent Partner account" : "Create account"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </SubmitButton>
        <p className="-mt-1.5 flex items-start gap-2 text-sm text-slate">
          <IdCard className="mt-0.5 h-4 w-4 shrink-0 text-voyage-blue" aria-hidden />
          Next: a quick ID check with Stripe Identity.
        </p>
      </form>

      <p className="mt-6 text-slate">
        Already have an account?{" "}
        <Link href="/login" className="font-extrabold text-voyage-blue">
          Log in
        </Link>
      </p>
      <p className="mt-4 flex items-start gap-2 rounded-lg border border-dashed border-mist bg-frost p-3 text-[0.8125rem] text-slate">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        Your details are kept private and are never shown publicly.
      </p>
    </>
  );
}
