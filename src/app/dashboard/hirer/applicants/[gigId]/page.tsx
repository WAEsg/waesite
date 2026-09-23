import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { decideApplicationForm } from "../actions";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { applicationStatusLabel, applicationStatusTone } from "@/lib/labels";
import { glassCardLight } from "@/components/ui/glass";
import { buttonPrimarySm, buttonSecondary } from "@/components/ui/button-classes";
import { RatingStars } from "@/components/dashboard/rating-stars";
import { getAggregateRatings } from "@/lib/reviews";
import { Users } from "lucide-react";

export default async function GigApplicantsPage({
  params,
}: {
  params: Promise<{ gigId: string }>;
}) {
  const { gigId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: gig } = await supabase
    .from("gigs")
    .select("id, title, hirer_id")
    .eq("id", gigId)
    .eq("hirer_id", user.id)
    .single();
  if (!gig) notFound();

  const { data: applications } = await supabase
    .from("applications")
    .select("id, talent_id, status, cover_letter, proposed_rate, created_at")
    .eq("gig_id", gigId)
    .order("created_at", { ascending: false });

  const talentIds = (applications ?? []).map((a) => a.talent_id);
  const applicationIds = (applications ?? []).map((a) => a.id);
  const [{ data: talentUsers }, { data: talentProfiles }, { data: interviews }] = talentIds.length
    ? await Promise.all([
        supabase.from("users").select("id, full_name, country").in("id", talentIds),
        supabase
          .from("talent_profiles")
          .select("user_id, headline, skills, years_experience")
          .in("user_id", talentIds),
        supabase.from("interviews").select("application_id, status, hirer_decision").in("application_id", applicationIds),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];

  const userById = new Map((talentUsers ?? []).map((u) => [u.id, u]));
  const profileById = new Map((talentProfiles ?? []).map((p) => [p.user_id, p]));
  const interviewByApplicationId = new Map((interviews ?? []).map((i) => [i.application_id, i]));
  const ratingById = await getAggregateRatings(supabase, talentIds);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">
        Applicants — {gig.title}
      </h1>

      {!applications?.length ? (
        <EmptyState
          icon={Users}
          title="No applicants yet"
          description="Check back once talent partners start applying to this job post."
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const talent = userById.get(app.talent_id);
            const profile = profileById.get(app.talent_id);

            return (
              <div key={app.id} className={`p-5 ${glassCardLight}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink-navy">
                      {talent?.full_name ?? "Talent partner"}
                    </p>
                    <p className="text-xs text-slate">
                      {profile?.headline ?? "No profile headline yet"}
                      {profile?.years_experience != null &&
                        ` · ${profile.years_experience} yrs experience`}
                      {talent?.country && ` · ${talent.country}`}
                    </p>
                    {profile?.skills?.length ? (
                      <p className="mt-1 text-xs text-passport-sky">
                        {profile.skills.join(" · ")}
                      </p>
                    ) : null}
                    <div className="mt-1">
                      <RatingStars
                        average={ratingById.get(app.talent_id)?.average ?? 0}
                        count={ratingById.get(app.talent_id)?.count ?? 0}
                      />
                    </div>
                  </div>
                  <StatusBadge
                    label={applicationStatusLabel[app.status]}
                    tone={applicationStatusTone[app.status]}
                  />
                </div>

                {app.cover_letter && (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-slate">
                    {app.cover_letter}
                  </p>
                )}

                <Link
                  href={`/dashboard/hirer/messages/start/${app.id}`}
                  className="mt-3 inline-block text-xs font-semibold text-voyage-blue hover:text-ink-navy"
                >
                  Message
                </Link>

                {app.status === "pending" && (
                  <div className="mt-4 flex gap-2">
                    <form action={decideApplicationForm}>
                      <input type="hidden" name="application_id" value={app.id} />
                      <input type="hidden" name="status" value="shortlisted" />
                      <button type="submit" className={`text-sm ${buttonSecondary}`}>
                        Shortlist
                      </button>
                    </form>
                    <form action={decideApplicationForm}>
                      <input type="hidden" name="application_id" value={app.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <button type="submit" className={`text-sm ${buttonSecondary}`}>
                        Decline
                      </button>
                    </form>
                  </div>
                )}

                {app.status === "shortlisted" && (() => {
                  const interview = interviewByApplicationId.get(app.id);
                  if (interview?.hirer_decision === "confirm") {
                    return (
                      <div className="mt-4 flex gap-2">
                        <form action={decideApplicationForm}>
                          <input type="hidden" name="application_id" value={app.id} />
                          <input type="hidden" name="status" value="accepted" />
                          <button type="submit" className={`text-sm ${buttonPrimarySm}`}>
                            Match & create contract
                          </button>
                        </form>
                        <form action={decideApplicationForm}>
                          <input type="hidden" name="application_id" value={app.id} />
                          <input type="hidden" name="status" value="rejected" />
                          <button type="submit" className={`text-sm ${buttonSecondary}`}>
                            Decline
                          </button>
                        </form>
                      </div>
                    );
                  }
                  return (
                    <div className="mt-4 flex items-center gap-3">
                      <Link
                        href={`/dashboard/hirer/applicants/${gigId}/interview/${app.id}`}
                        className={`text-sm ${buttonSecondary}`}
                      >
                        {interview ? "View interview" : "Schedule Interview"}
                      </Link>
                      {interview && (
                        <span className="text-xs text-slate">
                          {interview.status === "completed" ? "Awaiting your decision" : "Scheduling in progress"}
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
