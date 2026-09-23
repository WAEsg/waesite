import Link from "next/link";
import { redirect } from "next/navigation";
import { FileSignature } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight, glassCardLightHover } from "@/components/ui/glass";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { contractStatusLabel, contractStatusTone } from "@/lib/labels";
import type { ContractStatus } from "@/lib/supabase/database.types";

const statusOptions: { value: ContractStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "terminated", label: "Terminated" },
  { value: "cancelled", label: "Cancelled" },
  { value: "paused", label: "Paused" },
];

export default async function AdminContractsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  let query = supabase
    .from("contracts")
    .select("id, hirer_id, talent_id, type, rate_amount, rate_type, status, created_at")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status as ContractStatus);
  }

  const { data: contracts } = await query;

  const userIds = Array.from(
    new Set((contracts ?? []).flatMap((c) => [c.hirer_id, c.talent_id]))
  );
  const { data: users } = userIds.length
    ? await supabase.from("users").select("id, full_name, email").in("id", userIds)
    : { data: [] };
  const nameById = new Map((users ?? []).map((u) => [u.id, u.full_name ?? u.email]));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">Contracts</h1>

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((opt) => {
          const active = (status ?? "all") === opt.value;
          const href =
            opt.value === "all" ? "/dashboard/admin/contracts" : `/dashboard/admin/contracts?status=${opt.value}`;
          return (
            <Link
              key={opt.value}
              href={href}
              className={`rounded-full border-[1.5px] px-4 py-1.5 text-sm font-bold transition ${
                active
                  ? "border-voyage-blue bg-voyage-blue text-white"
                  : "border-line bg-white text-slate hover:border-passport-sky"
              }`}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      {!contracts?.length ? (
        <EmptyState
          icon={FileSignature}
          title="No contracts found"
          description="No contracts match this filter."
        />
      ) : (
        <div className="space-y-2">
          {contracts.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/admin/contracts/${c.id}`}
              className={`flex items-center justify-between gap-4 p-4 ${glassCardLight} ${glassCardLightHover}`}
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink-navy">
                  {nameById.get(c.hirer_id) ?? "Hirer"} → {nameById.get(c.talent_id) ?? "Talent"}
                </p>
                <p className="mt-1 text-xs text-slate">
                  {c.type === "retainer" ? "Retainer" : "One-off"} · SGD {c.rate_amount}
                  {c.rate_type === "hourly" ? "/hr" : c.rate_type === "monthly" ? "/mo" : ""} ·{" "}
                  {new Date(c.created_at).toLocaleDateString()}
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
