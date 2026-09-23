import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight, glassPanelLight } from "@/components/ui/glass";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  contractStatusLabel,
  contractStatusTone,
  milestoneStatusLabel,
  milestoneStatusTone,
} from "@/lib/labels";
import { CreditCard, ListChecks, AlertTriangle } from "lucide-react";

export default async function AdminContractDetailPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: contract } = await supabase
    .from("contracts")
    .select(
      "id, hirer_id, talent_id, type, rate_amount, rate_type, status, placement_fee_amount, monthly_pay, start_date, end_date, created_at"
    )
    .eq("id", contractId)
    .single();
  if (!contract) notFound();

  const [{ data: hirer }, { data: talent }, { data: milestones }, { data: paymentEvents }, { data: disputes }] =
    await Promise.all([
      supabase.from("users").select("id, full_name, email").eq("id", contract.hirer_id).single(),
      supabase.from("users").select("id, full_name, email").eq("id", contract.talent_id).single(),
      supabase
        .from("milestones")
        .select("id, title, amount, status, sequence_order, created_at")
        .eq("contract_id", contractId)
        .order("sequence_order", { ascending: true }),
      supabase
        .from("payment_events")
        .select("id, event_type, amount, fee_amount, pass_through_amount, is_simulated, created_at")
        .eq("contract_id", contractId)
        .order("created_at", { ascending: true }),
      supabase
        .from("disputes")
        .select("id, milestone_id, raised_by, reason, status, created_at, resolved_at")
        .eq("contract_id", contractId)
        .order("created_at", { ascending: false }),
    ]);

  const paidToTalent = (paymentEvents ?? [])
    .filter((e) => e.event_type === "release")
    .reduce((sum, e) => sum + Number(e.pass_through_amount ?? 0), 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-navy">
            {hirer?.full_name ?? hirer?.email ?? "Hirer"} → {talent?.full_name ?? talent?.email ?? "Talent"}
          </h1>
          <p className="mt-1 text-sm text-slate">
            {contract.type === "retainer" ? "Retainer" : "One-off"} contract
          </p>
        </div>
        <StatusBadge label={contractStatusLabel[contract.status]} tone={contractStatusTone[contract.status]} />
      </div>

      <div className={`grid gap-4 p-6 sm:grid-cols-2 ${glassCardLight}`}>
        <div>
          <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">Rate</p>
          <p className="mt-1 text-sm text-ink-navy">
            SGD {contract.rate_amount}
            {contract.rate_type === "hourly" ? "/hr" : contract.rate_type === "monthly" ? "/mo" : ""}
          </p>
        </div>
        <div>
          <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
            Placement fee
          </p>
          <p className="mt-1 text-sm text-ink-navy">
            {contract.placement_fee_amount != null ? `SGD ${contract.placement_fee_amount}` : "—"}
          </p>
        </div>
        <div>
          <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
            Monthly pay
          </p>
          <p className="mt-1 text-sm text-ink-navy">
            {contract.monthly_pay != null ? `SGD ${contract.monthly_pay}` : "—"}
          </p>
        </div>
        <div>
          <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">Started</p>
          <p className="mt-1 text-sm text-ink-navy">
            {new Date(contract.start_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <StatCard
        label="Paid to talent so far"
        value={`SGD ${paidToTalent.toLocaleString()}`}
        hint="Sum of pass-through amounts from released escrow"
        icon={CreditCard}
      />

      <div>
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-navy">
          <ListChecks className="h-4 w-4" /> Milestones
        </h2>
        {!milestones?.length ? (
          <div className="mt-3">
            <EmptyState icon={ListChecks} title="No milestones" description="No milestones on this contract." />
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {milestones.map((m) => (
              <div key={m.id} className={`flex items-center justify-between p-4 ${glassCardLight}`}>
                <div>
                  <p className="text-sm font-semibold text-ink-navy">{m.title}</p>
                  <p className="mt-1 text-xs text-slate">SGD {m.amount}</p>
                </div>
                <StatusBadge label={milestoneStatusLabel[m.status]} tone={milestoneStatusTone[m.status]} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-ink-navy">Payment events</h2>
        {!paymentEvents?.length ? (
          <div className="mt-3">
            <EmptyState
              icon={CreditCard}
              title="No payment events"
              description="No escrow activity has happened on this contract yet."
            />
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className={`w-full text-left text-sm ${glassPanelLight}`}>
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate">
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Pass-through</th>
                  <th className="px-4 py-3">Simulated</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {paymentEvents.map((e) => (
                  <tr key={e.id} className="border-t border-line">
                    <td className="px-4 py-3 text-ink-navy">{e.event_type}</td>
                    <td className="px-4 py-3 text-ink-navy">SGD {e.amount}</td>
                    <td className="px-4 py-3 text-ink-navy">
                      {e.fee_amount != null ? `SGD ${e.fee_amount}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-navy">
                      {e.pass_through_amount != null ? `SGD ${e.pass_through_amount}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-navy">{e.is_simulated ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-slate">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-navy">
          <AlertTriangle className="h-4 w-4" /> Disputes
        </h2>
        {!disputes?.length ? (
          <div className="mt-3">
            <EmptyState
              icon={AlertTriangle}
              title="No disputes"
              description="This contract has no dispute history."
            />
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {disputes.map((d) => (
              <div key={d.id} className={`p-4 ${glassCardLight}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink-navy">
                    Raised {new Date(d.created_at).toLocaleDateString()}
                  </p>
                  <StatusBadge
                    label={d.status === "open" ? "Open" : "Resolved"}
                    tone={d.status === "open" ? "warning" : "success"}
                  />
                </div>
                <p className="mt-2 text-sm text-slate">{d.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
