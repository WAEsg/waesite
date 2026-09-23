import { DemoShell } from "../../demo-shell";

// See the comment in ../hirer/page.tsx — the real TalentDashboardPage now
// requires a signed-in user's live data, so the demo gets its own static
// preview instead of embedding it directly.
export default function DemoTalentDashboardPage() {
  return (
    <DemoShell name="Dina Putri" subtitle="Talent">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-ink-navy">Talent dashboard</h1>
        <p className="mt-2 text-ink-navy/70">
          This is a preview. Sign up to browse jobs, apply, and manage contracts
          with real data.
        </p>
      </div>
    </DemoShell>
  );
}
