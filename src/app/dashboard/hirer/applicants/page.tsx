import Link from "next/link";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight, glassCardLightHover } from "@/components/ui/glass";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function ApplicantsOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: gigs } = await supabase
    .from("gigs")
    .select("id, title, status")
    .eq("hirer_id", user.id)
    .order("created_at", { ascending: false });

  const gigIds = (gigs ?? []).map((g) => g.id);
  const { data: applications } = gigIds.length
    ? await supabase.from("applications").select("gig_id, status").in("gig_id", gigIds)
    : { data: [] };

  const countsByGig = new Map<string, number>();
  for (const app of applications ?? []) {
    if (app.status === "pending" || app.status === "shortlisted") {
      countsByGig.set(app.gig_id, (countsByGig.get(app.gig_id) ?? 0) + 1);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">Applicants</h1>

      {!gigs?.length ? (
        <EmptyState
          icon={Users}
          title="No job posts yet"
          description="Post a job to start receiving applications."
        />
      ) : (
        <div className="space-y-3">
          {gigs.map((gig) => (
            <Link
              key={gig.id}
              href={`/dashboard/hirer/applicants/${gig.id}`}
              className={`flex items-center justify-between p-5 ${glassCardLight} ${glassCardLightHover}`}
            >
              <p className="font-semibold text-ink-navy">{gig.title}</p>
              <p className="text-sm text-slate">
                {countsByGig.get(gig.id) ?? 0} to review
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
