import { DemoBanner } from "@/components/demo-banner";
import { RouteLine } from "@/components/route-line";
import { OnboardingDemoForm } from "./onboarding-demo-form";

export default function DemoOnboardingPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <DemoBanner />
      <div className="flex flex-1 items-center justify-center bg-cloud-blue px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl bg-paper-white p-8 shadow-sm">
          <RouteLine className="mx-auto h-8 w-40" />
          <h1 className="mt-4 text-center text-2xl font-bold text-ink-navy">
            Tell us a bit about you
          </h1>
          <p className="mt-1 text-center text-sm text-ink-navy/70">
            This sets up the right dashboard for you.
          </p>
          <OnboardingDemoForm />
        </div>
      </div>
    </div>
  );
}
