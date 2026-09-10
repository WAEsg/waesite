export const metadata = { title: "Privacy Policy — WaeWork" };

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20">
      <div className="mb-6 rounded-xl border border-alert/30 bg-alert/10 backdrop-blur-sm px-4 py-3 text-sm font-medium text-frost">
        Placeholder content — needs real legal review before launch.
      </div>
      <h1 className="font-display text-3xl font-bold text-frost">
        Privacy Policy
      </h1>
      <div className="mt-6 space-y-4 text-mist">
        <p>
          WAE Pte. Ltd. (&ldquo;WaeWork,&rdquo; &ldquo;we&rdquo;) collects
          account information (name, email, business or professional
          details), identity verification results from Stripe Identity, and
          usage data needed to operate the platform.
        </p>
        <p>
          We share the minimum data necessary with Stripe (payments and
          identity verification), Supabase (data storage and
          authentication), and Resend (transactional email) to operate the
          service.
        </p>
        <p>
          We do not sell personal data. You can request access to or
          deletion of your data by contacting hello@waework.co.
        </p>
        <p>
          This is placeholder text for development purposes only and does
          not constitute a binding or complete Privacy Policy.
        </p>
      </div>
    </section>
  );
}
