import "server-only";
import { createClient } from "@/lib/supabase/server";

// Backs signup/login with a DB-side sliding window (see
// supabase/migrations/0006_auth_rate_limits.sql::check_rate_limit).
// Keyed by "<action>:<identifier>" so signup and login attempts, and
// different emails/IPs, don't share a bucket.
export async function checkRateLimit(
  action: "signup" | "login",
  identifier: string,
  { maxAttempts = 5, windowSeconds = 15 * 60 } = {}
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_key: `${action}:${identifier}`,
    p_max_attempts: maxAttempts,
    p_window_seconds: windowSeconds,
  });

  // Fail open: if the rate-limit check itself errors, don't block real
  // users from signing up/logging in over an infra hiccup.
  if (error) return true;
  return data ?? true;
}
