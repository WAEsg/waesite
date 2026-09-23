import { DemoShell } from "../../demo-shell";

// The real HirerDashboardPage now queries live Supabase data for a signed
// -in user, so it can't be embedded here anymore — this stays a static
// preview, same as before the real dashboard existed. Re-theming the demo
// to match the dashboard's new dark look is a separate follow-up.
export default function DemoHirerDashboardPage() {
  return (
    <DemoShell name="Alex Tan" subtitle="Tan & Co Studio">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-ink-navy">Hirer dashboard</h1>
        <p className="mt-2 text-ink-navy/70">
          This is a preview. Sign up to post jobs, review applicants, and manage
          contracts with real data.
        </p>
      </div>
    </DemoShell>
  );
}
