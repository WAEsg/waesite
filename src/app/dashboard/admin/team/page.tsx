import { redirect } from "next/navigation";
import { UserCog } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight } from "@/components/ui/glass";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PromoteAdminForm } from "./promote-admin-form";

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: admins } = await supabase
    .from("users")
    .select("id, email, full_name, created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">Team</h1>

      <div>
        <h2 className="font-display text-lg font-bold text-ink-navy">Current admins</h2>
        {!admins?.length ? (
          <div className="mt-3">
            <EmptyState icon={UserCog} title="No admins" description="No admin accounts found." />
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {admins.map((a) => (
              <div key={a.id} className={`p-4 ${glassCardLight}`}>
                <p className="text-sm font-semibold text-ink-navy">{a.full_name ?? a.email}</p>
                <p className="mt-1 text-xs text-slate">{a.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`p-6 ${glassCardLight}`}>
        <h2 className="font-display text-lg font-bold text-ink-navy">Grant admin access</h2>
        <div className="mt-4">
          <PromoteAdminForm />
        </div>
      </div>
    </div>
  );
}
