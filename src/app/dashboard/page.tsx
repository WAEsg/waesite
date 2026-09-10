import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Role router — /dashboard always forwards to the role-specific dashboard.
export default async function DashboardIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(profile?.role === "hirer" ? "/dashboard/hirer" : "/dashboard/talent");
}
