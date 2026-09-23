import Link from "next/link";
import { FileSignature } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight, glassCardLightHover } from "@/components/ui/glass";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { contractStatusLabel, contractStatusTone } from "@/lib/labels";

export default async function TalentContractsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: contracts } = await supabase
    .from("contracts")
    .select("id, hirer_id, type, rate_amount, rate_type, status, created_at")
    .eq("talent_id", user.id)
    .order("created_at", { ascending: false });

  const hirerIds = (contracts ?? []).map((c) => c.hirer_id);
  const { data: hirerProfiles } = hirerIds.length
    ? await supabase.from("hirer_profiles").select("user_id, company_name").in("user_id", hirerIds)
    : { data: [] };
  const companyById = new Map((hirerProfiles ?? []).map((h) => [h.user_id, h.company_name]));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">Current jobs</h1>

      {!contracts?.length ? (
        <EmptyState
          icon={FileSignature}
          title="No contracts yet"
          description="Once a hirer matches with your application, the contract shows up here."
        />
      ) : (
        <div className="space-y-3">
          {contracts.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/talent/contracts/${c.id}`}
              className={`flex items-center justify-between p-5 ${glassCardLight} ${glassCardLightHover}`}
            >
              <div>
                <p className="font-semibold text-ink-navy">{companyById.get(c.hirer_id) ?? "Hirer"}</p>
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
