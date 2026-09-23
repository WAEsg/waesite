import Link from "next/link";
import { redirect } from "next/navigation";
import { Users as UsersIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight, glassCardLightHover } from "@/components/ui/glass";
import { buttonPrimarySm } from "@/components/ui/button-classes";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
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

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  let query = supabase
    .from("users")
    .select("id, email, full_name, role, verification_status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (q && q.trim()) {
    const term = q.trim();
    query = query.or(`email.ilike.%${term}%,full_name.ilike.%${term}%`);
  }

  const { data: users } = await query;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">Users</h1>

      <form action="/dashboard/admin/users" method="get" className={`flex gap-2 p-4 ${glassCardLight}`}>
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by email or name…"
          className="flex-1 rounded-xl border border-line bg-paper-white px-3 py-2 text-sm text-ink-navy outline-none focus:border-voyage-blue"
        />
        <button type="submit" className={buttonPrimarySm}>
          Search
        </button>
      </form>

      {!users?.length ? (
        <EmptyState
          icon={UsersIcon}
          title="No users found"
          description="Try a different search term."
        />
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <Link
              key={u.id}
              href={`/dashboard/admin/users/${u.id}`}
              className={`flex items-center justify-between gap-4 p-4 ${glassCardLight} ${glassCardLightHover}`}
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink-navy">{u.full_name ?? u.email}</p>
                <p className="truncate text-xs text-slate">
                  {u.email} · {u.role ?? "no role"} ·{" "}
                  {new Date(u.created_at).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge
                label={verificationLabel[u.verification_status] ?? u.verification_status}
                tone={verificationTone[u.verification_status] ?? "neutral"}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
