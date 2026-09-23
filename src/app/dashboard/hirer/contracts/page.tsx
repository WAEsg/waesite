import Link from "next/link";
import { FileSignature } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight, glassCardLightHover } from "@/components/ui/glass";
import { buttonSecondary } from "@/components/ui/button-classes";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { contractStatusLabel, contractStatusTone } from "@/lib/labels";
import { reviewOverdueMilestones } from "@/app/dashboard/_shared/contract-actions";

export default async function HirerContractsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: contracts } = await supabase
    .from("contracts")
    .select("id, talent_id, type, rate_amount, rate_type, status, created_at")
    .eq("hirer_id", user.id)
    .order("created_at", { ascending: false });

  const talentIds = (contracts ?? []).map((c) => c.talent_id);
  const { data: talents } = talentIds.length
    ? await supabase.from("users").select("id, full_name").in("id", talentIds)
    : { data: [] };
  const nameById = new Map((talents ?? []).map((t) => [t.id, t.full_name]));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-navy">Active contracts</h1>
        <form action={reviewOverdueMilestones}>
          <button type="submit" className={`text-xs ${buttonSecondary}`}>
            Review overdue milestones
          </button>
        </form>
      </div>

      {!contracts?.length ? (
        <EmptyState
          icon={FileSignature}
          title="No contracts yet"
          description="Once you match with an applicant, the contract shows up here."
        />
      ) : (
        <div className="space-y-3">
          {contracts.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/hirer/contracts/${c.id}`}
              className={`flex items-center justify-between p-5 ${glassCardLight} ${glassCardLightHover}`}
            >
              <div>
                <p className="font-semibold text-ink-navy">{nameById.get(c.talent_id) ?? "Talent partner"}</p>
                <p className="mt-1 text-xs text-slate">
                  {c.type === "retainer" ? "Retainer" : "One-off"} · SGD {c.rate_amount}
                  {c.rate_type === "hourly" ? "/hr" : c.rate_type === "monthly" ? "/mo" : ""}
                </p>
              </div>
              <StatusBadge label={contractStatusLabel[c.status]} tone={contractStatusTone[c.status]} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
