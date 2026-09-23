import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getAdminEmails(): Promise<string[]> {
  const admin = createAdminClient();
  const { data } = await admin.from("users").select("email").eq("role", "admin");
  return (data ?? []).map((u) => u.email);
}
