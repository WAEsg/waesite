import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight } from "@/components/ui/glass";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ResolveDisputeForm } from "./resolve-dispute-form";

export default async function AdminDisputesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: disputes } = await supabase
    .from("disputes")
    .select("id, contract_id, milestone_id, raised_by, reason, status, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: true });

  const contractIds = Array.from(new Set((disputes ?? []).map((d) => d.contract_id)));
  const milestoneIds = Array.from(
    new Set((disputes ?? []).map((d) => d.milestone_id).filter((id): id is string => !!id))
  );
  const raisedByIds = Array.from(new Set((disputes ?? []).map((d) => d.raised_by)));

  const [{ data: contracts }, { data: milestones }, { data: raisers }] = await Promise.all([
    contractIds.length
      ? supabase.from("contracts").select("id, hirer_id, talent_id").in("id", contractIds)
      : Promise.resolve({ data: [] }),
    milestoneIds.length
      ? supabase.from("milestones").select("id, title, amount").in("id", milestoneIds)
      : Promise.resolve({ data: [] }),
    raisedByIds.length
      ? supabase.from("users").select("id, full_name, email").in("id", raisedByIds)
      : Promise.resolve({ data: [] }),
  ]);

  const contractById = new Map((contracts ?? []).map((c) => [c.id, c]));
  const milestoneById = new Map((milestones ?? []).map((m) => [m.id, m]));

  const userIds = Array.from(
    new Set((contracts ?? []).flatMap((c) => [c.hirer_id, c.talent_id]))
  );
  const { data: contractUsers } = userIds.length
    ? await supabase.from("users").select("id, full_name, email").in("id", userIds)
    : { data: [] };
  const nameById = new Map(
    [...(contractUsers ?? []), ...(raisers ?? [])].map((u) => [u.id, u.full_name ?? u.email])
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">Disputes & MIA</h1>

      {!disputes?.length ? (
        <EmptyState
          icon={AlertTriangle}
          title="No open disputes"
          description="The queue is clear — nothing needs resolution right now."
        />
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => {
            const contract = contractById.get(d.contract_id);
            const milestone = d.milestone_id ? milestoneById.get(d.milestone_id) : undefined;

            return (
              <div key={d.id} className={`p-5 ${glassCardLight}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink-navy">
                      {contract
                        ? `${nameById.get(contract.hirer_id) ?? "Hirer"} vs ${
                            nameById.get(contract.talent_id) ?? "Talent"
                          }`
                        : "Contract"}
                    </p>
                    <p className="mt-1 text-xs text-slate">
                      Raised by {nameById.get(d.raised_by) ?? "unknown"} on{" "}
                      {new Date(d.created_at).toLocaleDateString()}
                      {milestone && ` · Milestone: ${milestone.title} (SGD ${milestone.amount})`}
                    </p>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate">{d.reason}</p>

                <ResolveDisputeForm disputeId={d.id} defaultAmount={milestone?.amount ?? null} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
