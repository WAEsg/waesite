import { redirect } from "next/navigation";
import { IdCard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SignupWizardShell } from "@/components/auth/signup-wizard-shell";
import { StartVerificationForm } from "./start-verification-form";

export default async function VerifyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, verification_status")
    .eq("id", user.id)
    .single();

  if (!profile?.role) {
    redirect("/onboarding");
  }

  if (profile.verification_status === "passed") {
    redirect(`/dashboard/${profile.role}`);
  }

  return (
    <SignupWizardShell
      step={3}
      role={profile.role === "hirer" || profile.role === "talent" ? profile.role : null}
      stepLabel="Step 3 of 3"
      title="Verify your identity"
      lede="A quick government-ID check with Stripe Identity. Every hirer and every Talent Partner completes it before they can post a role or apply to one."
    >
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-white p-6 shadow-1">
        <span className="badge-ico flex h-12 w-12 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
          <IdCard className="h-6 w-6" aria-hidden />
        </span>

        {profile.verification_status === "pending" && (
          <>
            <p className="text-slate">
              We&apos;re checking your verification now. This usually takes just a few minutes — refresh this page
              once you&apos;ve completed the steps.
            </p>
            <a href="/onboarding/verify" className="font-extrabold text-voyage-blue">
              Refresh status
            </a>
          </>
        )}

        {profile.verification_status === "failed" && (
          <>
            <p className="text-slate">
              We couldn&apos;t verify your identity with the details provided. You can try again below.
            </p>
            <StartVerificationForm label="Try again" />
          </>
        )}

        {profile.verification_status === "unverified" && (
          <>
            <p className="text-slate">
              Every WaeWork account is identity-verified before it can post or apply to work — it&apos;s what keeps
              both sides of the marketplace trustworthy. This only takes a couple of minutes.
            </p>
            <StartVerificationForm />
          </>
        )}
      </div>
    </SignupWizardShell>
  );
}
