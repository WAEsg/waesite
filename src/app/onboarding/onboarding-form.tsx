"use client";

import { useActionState, useState } from "react";
import { ArrowRight } from "lucide-react";
import { completeOnboarding, type OnboardingActionState } from "./actions";
import { FormError, SubmitButton } from "@/components/ui/form-field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { AvatarUpload } from "@/components/forms/avatar-upload";
import { handleUrlBlur } from "@/lib/url";
import { useRolePreference } from "@/lib/use-role-preference";

const initialState: OnboardingActionState = { error: null };
const fieldClasses =
  "mt-1.5 min-h-[50px] w-full rounded-[10px] border-[1.5px] border-field-line bg-white px-4 py-3 text-base text-ink-navy outline-none transition hover:border-voyage-blue focus:border-voyage-blue focus:ring-4 focus:ring-passport-sky/[0.22]";

export function OnboardingForm({
  defaultRole = null,
  userId,
}: {
  defaultRole?: "hirer" | "talent" | null;
  userId: string;
}) {
  const [state, formAction, pending] = useActionState(completeOnboarding, initialState);
  const [role, setRole] = useRolePreference();
  const [localRole] = useState(role ?? defaultRole);

  // If the site-wide role preference was never set (e.g. the visitor
  // jumped straight to /onboarding), seed it from what step 1 recorded.
  const current = role ?? localRole;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-slate">Signing up as</span>
        <SegmentedControl
          options={[
            { value: "hirer", label: "Hirer" },
            { value: "talent", label: "Talent Partner" },
          ]}
          value={current}
          onChange={setRole}
          className="!w-fit !bg-cloud-blue"
        />
        <input type="hidden" name="role" value={current ?? ""} />
      </div>

      <label className="flex flex-col font-extrabold text-ink-navy">
        Full name
        <input name="full_name" required autoComplete="name" className={fieldClasses} />
      </label>

      <label className="flex flex-col font-extrabold text-ink-navy">
        Country
        <input name="country" required autoComplete="country-name" className={fieldClasses} />
      </label>

      {current === "hirer" && (
        <label className="flex flex-col font-extrabold text-ink-navy">
          Business name
          <input name="business_name" required className={fieldClasses} />
        </label>
      )}

      {current === "talent" && (
        <>
          <div className="flex flex-col gap-2">
            <span className="font-extrabold text-ink-navy">Profile photo</span>
            <AvatarUpload userId={userId} />
          </div>

          <label className="flex flex-col font-extrabold text-ink-navy">
            A couple of lines about you
            <span className="mb-1.5 text-sm font-normal text-slate">Optional. What you do, and what you&apos;re looking for.</span>
            <textarea name="bio" rows={3} maxLength={2000} className={fieldClasses} />
          </label>

          <label className="flex flex-col font-extrabold text-ink-navy">
            Portfolio or work sample link
            <span className="mb-1.5 text-sm font-normal text-slate">Optional — a Drive folder, site, or LinkedIn works fine.</span>
            <input name="portfolio_link" type="text" inputMode="url" placeholder="waework.com" onBlur={handleUrlBlur} className={fieldClasses} />
          </label>

          <label className="flex flex-col font-extrabold text-ink-navy">
            Resume link
            <span className="mb-1.5 text-sm font-normal text-slate">Optional — a link to your resume (Drive, Dropbox, etc.).</span>
            <input name="resume_url" type="text" inputMode="url" placeholder="waework.com" onBlur={handleUrlBlur} className={fieldClasses} />
          </label>
        </>
      )}

      <FormError message={state.error} />
      <SubmitButton pending={pending}>
        <span className="flex items-center justify-center gap-2.5">
          Continue
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </SubmitButton>
    </form>
  );
}
