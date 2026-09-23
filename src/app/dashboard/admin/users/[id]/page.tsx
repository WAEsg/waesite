import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight, glassCardLightHover, glassPanelLight } from "@/components/ui/glass";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { contractStatusLabel, contractStatusTone } from "@/lib/labels";
import { FileSignature } from "lucide-react";
import type { BadgeTone } from "@/lib/labels";

const verificationLabel: Record<string, string> = {
  unverified: "Unverified",
  pending: "Pending",
  passed: "Verified",
  failed: "Failed",
};

const verificationTone: Record<string, BadgeTone> = {
  unverified: "neutral",
  pending: "warning",
  passed: "success",
  failed: "error",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: targetUser } = await supabase
    .from("users")
    .select("id, email, full_name, business_name, country, role, verification_status, no_show_count, created_at")
    .eq("id", id)
    .single();
  if (!targetUser) notFound();

  const [{ data: hirerProfile }, { data: talentProfile }] = await Promise.all([
    targetUser.role === "hirer"
      ? supabase
          .from("hirer_profiles")
          .select("company_name, uen, company_size, industry, website")
          .eq("user_id", id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    targetUser.role === "talent"
      ? supabase
          .from("talent_profiles")
          .select("headline, skills, years_experience, rate_amount, rate_unit")
          .eq("user_id", id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const { data: contracts } = await supabase
    .from("contracts")
    .select("id, hirer_id, talent_id, type, rate_amount, rate_type, status, created_at")
    .or(`hirer_id.eq.${id},talent_id.eq.${id}`)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-navy">
          {targetUser.full_name ?? targetUser.email}
        </h1>
        <p className="mt-1 text-sm text-slate">{targetUser.email}</p>
      </div>

      <div className={`space-y-4 p-6 ${glassCardLight}`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">Role</p>
            <p className="mt-1 text-sm text-ink-navy">{targetUser.role ?? "—"}</p>
          </div>
          <div>
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
              Verification
            </p>
            <div className="mt-1">
              <StatusBadge
                label={verificationLabel[targetUser.verification_status] ?? targetUser.verification_status}
                tone={verificationTone[targetUser.verification_status] ?? "neutral"}
              />
            </div>
          </div>
          <div>
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
              Business name
            </p>
            <p className="mt-1 text-sm text-ink-navy">{targetUser.business_name ?? "—"}</p>
          </div>
          <div>
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">Country</p>
            <p className="mt-1 text-sm text-ink-navy">{targetUser.country ?? "—"}</p>
          </div>
          <div>
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">Joined</p>
            <p className="mt-1 text-sm text-ink-navy">
              {new Date(targetUser.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
              Interview no-shows
            </p>
            <p className={`mt-1 text-sm ${targetUser.no_show_count > 1 ? "font-semibold text-alert" : "text-ink-navy"}`}>
              {targetUser.no_show_count}
            </p>
          </div>
        </div>

        {hirerProfile && (
          <div className={`p-4 ${glassPanelLight}`}>
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
              Hirer profile
            </p>
            <p className="mt-1 text-sm text-ink-navy">
              {hirerProfile.company_name ?? "—"}
              {hirerProfile.uen && ` · UEN ${hirerProfile.uen}`}
            </p>
            <p className="mt-1 text-xs text-slate">
              {hirerProfile.industry ?? "—"}
              {hirerProfile.company_size && ` · ${hirerProfile.company_size}`}
              {hirerProfile.website && ` · ${hirerProfile.website}`}
            </p>
          </div>
        )}

        {talentProfile && (
          <div className={`p-4 ${glassPanelLight}`}>
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">
              Talent profile
            </p>
            <p className="mt-1 text-sm text-ink-navy">{talentProfile.headline ?? "—"}</p>
            <p className="mt-1 text-xs text-slate">
              {talentProfile.years_experience != null && `${talentProfile.years_experience} yrs`}
              {talentProfile.rate_amount &&
                ` · SGD ${talentProfile.rate_amount}${talentProfile.rate_unit === "hourly" ? "/hr" : "/mo"}`}
            </p>
            {talentProfile.skills?.length ? (
              <p className="mt-1 text-xs text-passport-sky">{talentProfile.skills.join(" · ")}</p>
            ) : null}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-ink-navy">Contract history</h2>
        {!contracts?.length ? (
          <div className="mt-3">
            <EmptyState
              icon={FileSignature}
              title="No contracts"
              description="This user has no contracts on either side yet."
            />
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {contracts.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/admin/contracts/${c.id}`}
                className={`flex items-center justify-between p-4 ${glassCardLight} ${glassCardLightHover}`}
              >
                <div>
                  <p className="text-sm font-semibold text-ink-navy">
                    {c.hirer_id === id ? "As hirer" : "As talent"} ·{" "}
                    {c.type === "retainer" ? "Retainer" : "One-off"}
                  </p>
                  <p className="mt-1 text-xs text-slate">
                    SGD {c.rate_amount}
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
    </div>
  );
}
