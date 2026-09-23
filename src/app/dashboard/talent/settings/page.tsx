import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight } from "@/components/ui/glass";

export default async function TalentSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">Settings</h1>

      <div className={`space-y-4 p-6 ${glassCardLight}`}>
        <div>
          <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">Email</p>
          <p className="mt-1 text-sm text-ink-navy">{user.email}</p>
        </div>
        <div>
          <p className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">Password</p>
          <Link
            href="/reset-password"
            className="mt-1 inline-block text-sm font-bold text-voyage-blue hover:underline"
          >
            Send a password reset link
          </Link>
        </div>
      </div>
    </div>
  );
}
