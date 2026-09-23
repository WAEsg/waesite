import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../(auth)/actions";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { glassCardLight } from "@/components/ui/glass";
import { buttonSecondarySm } from "@/components/ui/button-classes";
import { Logo } from "@/components/ui/logo";

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
    .select("role, full_name, verification_status")
    .eq("id", user.id)
    .single();

  if (!profile?.role) {
    redirect("/onboarding");
  }

  // Mirrors the proxy.ts redirect — defense in depth, same pattern the
  // role check already used before this change. Admins are exempt: an
  // internally-promoted team member isn't going through the same
  // Stripe-Identity flow a hirer/talent account uses.
  if (profile.role !== "admin" && profile.verification_status !== "passed") {
    redirect("/onboarding/verify");
  }

  const navRole = profile.role === "admin" ? "admin" : profile.role === "talent" ? "talent" : "hirer";

  return (
    <div className="relative flex min-h-full flex-1 bg-paper-white text-ink-navy">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-cloud-blue/40 via-paper-white to-paper-white"
        aria-hidden="true"
      />

      <aside className={`hidden w-64 shrink-0 flex-col p-4 lg:flex ${glassCardLight} m-4 mr-0`}>
        <Link href="/" className="px-2 py-2">
          <Logo />
        </Link>
        <div className="mt-6 flex-1 overflow-y-auto">
          <SidebarNav role={navRole} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <span className="font-bold text-ink-navy">{profile.full_name ?? user.email}</span>
          <form action={signOut}>
            <button type="submit" className={buttonSecondarySm}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </form>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
