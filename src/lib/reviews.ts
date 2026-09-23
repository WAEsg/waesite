import type { createClient } from "@/lib/supabase/server";

export type AggregateRating = { average: number; count: number };

// Used on both sides of the "reputation-based trust mechanic": a
// talent's aggregate rating shown to hirers reviewing applications, and
// a hirer's aggregate rating shown to talent considering an application.
// RLS on `reviews` already gates who can actually see these rows (see
// migration 0010) — this just aggregates whatever the caller's session
// is allowed to read.
export async function getAggregateRatings(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userIds: string[]
): Promise<Map<string, AggregateRating>> {
  const result = new Map<string, AggregateRating>();
  if (!userIds.length) return result;

  const { data } = await supabase.from("reviews").select("ratee_id, score").in("ratee_id", userIds);

  for (const row of data ?? []) {
    const existing = result.get(row.ratee_id) ?? { average: 0, count: 0 };
    const total = existing.average * existing.count + row.score;
    const count = existing.count + 1;
    result.set(row.ratee_id, { average: Math.round((total / count) * 10) / 10, count });
  }

  return result;
}
