import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight } from "@/components/ui/glass";
import { EmptyState } from "@/components/dashboard/empty-state";
import { RatingStars } from "@/components/dashboard/rating-stars";
import { getAggregateRatings } from "@/lib/reviews";
import { ApplyForm } from "./apply-form";

export default async function AvailableJobsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: gigs } = await supabase
    .from("gigs")
    .select("id, hirer_id, title, description, category, engagement_type, budget_type, budget_amount, urgent")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  const { data: myApplications } = await supabase
    .from("applications")
    .select("gig_id")
    .eq("talent_id", user.id);
  const appliedGigIds = new Set((myApplications ?? []).map((a) => a.gig_id));
  const hirerIds = [...new Set((gigs ?? []).map((g) => g.hirer_id))];
  const ratingById = await getAggregateRatings(supabase, hirerIds);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">Available jobs</h1>

      {!gigs?.length ? (
        <EmptyState
          icon={Search}
          title="No open jobs right now"
          description="Check back soon — new roles are posted regularly."
        />
      ) : (
        <div className="space-y-3">
          {gigs.map((gig) => (
            <div key={gig.id} className={`p-5 ${glassCardLight}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-ink-navy">
                    {gig.title}
                    {gig.urgent && <span className="ml-2 text-xs font-semibold text-alert">Urgent</span>}
                  </p>
                  <p className="mt-1 text-xs text-slate">
                    {gig.category ?? "General"} ·{" "}
                    {gig.engagement_type === "ongoing" ? "Ongoing" : "Gig"} ·{" "}
                    {gig.budget_type === "fixed" ? "Fixed" : "Hourly"} · SGD {gig.budget_amount}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm text-slate">{gig.description}</p>
                  <div className="mt-1">
                    <RatingStars
                      average={ratingById.get(gig.hirer_id)?.average ?? 0}
                      count={ratingById.get(gig.hirer_id)?.count ?? 0}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3">
                {appliedGigIds.has(gig.id) ? (
                  <span className="text-xs font-semibold text-passport-sky">Already applied</span>
                ) : (
                  <ApplyForm gigId={gig.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
