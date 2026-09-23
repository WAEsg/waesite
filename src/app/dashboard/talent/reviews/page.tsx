import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight } from "@/components/ui/glass";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function TalentReviewsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rater_id, score, comment, created_at")
    .eq("ratee_id", user.id)
    .order("created_at", { ascending: false });

  const raterIds = [...new Set((reviews ?? []).map((r) => r.rater_id))];
  const { data: hirerProfiles } = raterIds.length
    ? await supabase.from("hirer_profiles").select("user_id, company_name").in("user_id", raterIds)
    : { data: [] };
  const companyByRater = new Map((hirerProfiles ?? []).map((h) => [h.user_id, h.company_name]));

  const average = reviews?.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length) * 10) / 10
    : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-navy">Reviews</h1>
        {reviews?.length ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink-navy">
            <Star className="h-4 w-4 fill-passport-sky text-passport-sky" />
            {average.toFixed(1)} average ({reviews.length})
          </span>
        ) : null}
      </div>

      {!reviews?.length ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Reviews appear here once a hirer rates you at the end of a completed contract."
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className={`p-5 ${glassCardLight}`}>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink-navy">{companyByRater.get(r.rater_id) ?? "Hirer"}</p>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-4 w-4 ${n <= r.score ? "fill-passport-sky text-passport-sky" : "text-ink-navy/20"}`}
                    />
                  ))}
                </div>
              </div>
              {r.comment && <p className="mt-2 text-sm text-slate">{r.comment}</p>}
              <p className="mt-1 text-xs text-slate">{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
