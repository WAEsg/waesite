import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { glassCardLight } from "@/components/ui/glass";

const statusTone = { unverified: "neutral", pending: "info", passed: "success", failed: "error" } as const;
const statusLabel = { unverified: "Not started", pending: "In review", passed: "Verified", failed: "Failed" } as const;

export default async function TalentVerificationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("verification_status")
    .eq("id", user.id)
    .single();

  const { data: records } = await supabase
    .from("verification_records")
    .select("id, provider, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const status = profile?.verification_status ?? "unverified";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-navy">Verification</h1>
        <StatusBadge label={statusLabel[status]} tone={statusTone[status]} />
      </div>

      <div className={`p-6 ${glassCardLight}`}>
        <p className="text-sm text-slate">
          Your identity is verified via Stripe Identity. It&apos;s what lets hirers trust
          who they&apos;re working with — and it&apos;s what unlocks your public profile.
        </p>

        {records?.length ? (
          <div className="mt-4 space-y-2">
            {records.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm">
                <span className="text-slate">
                  {r.provider === "stripe_identity" ? "Stripe Identity" : "Singpass/MyInfo"} ·{" "}
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
                <StatusBadge label={statusLabel[r.status]} tone={statusTone[r.status]} />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate">No verification attempts recorded yet.</p>
        )}
      </div>
    </div>
  );
}
