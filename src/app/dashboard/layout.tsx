import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../(auth)/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.role) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-ink-navy/10 bg-paper-white px-6 py-4">
        <Link href="/" className="font-display text-xl font-bold text-voyage-blue">
          WaeWork
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-ink-navy/70">
            {profile.full_name ?? user.email}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-xl border border-ink-navy/15 px-3 py-1.5 font-semibold text-ink-navy transition hover:border-voyage-blue hover:text-voyage-blue"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 bg-cloud-blue px-6 py-10">{children}</main>
    </div>
  );
}
