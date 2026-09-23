import Link from "next/link";
import { Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight, glassCardLightHover } from "@/components/ui/glass";
import { buttonPrimarySm } from "@/components/ui/button-classes";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { gigStatusLabel, gigStatusTone } from "@/lib/labels";

export default async function JobPostsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: gigs } = await supabase
    .from("gigs")
    .select("id, title, status, engagement_type, budget_type, budget_amount, urgent, created_at")
    .eq("hirer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-navy">My job posts</h1>
        <Link href="/dashboard/hirer/jobs/new" className={buttonPrimarySm}>
          Post a job
        </Link>
      </div>

      {!gigs?.length ? (
        <EmptyState
          icon={Briefcase}
          title="No job posts yet"
          description="Post your first role to start receiving applications from verified talent partners."
        />
      ) : (
        <div className="space-y-3">
          {gigs.map((gig) => (
            <Link
              key={gig.id}
              href={`/dashboard/hirer/jobs/${gig.id}`}
              className={`flex items-center justify-between p-5 ${glassCardLight} ${glassCardLightHover}`}
            >
              <div>
                <p className="font-semibold text-ink-navy">
                  {gig.title}
                  {gig.urgent && (
                    <span className="ml-2 text-xs font-semibold text-alert">Urgent</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-slate">
                  {gig.engagement_type === "ongoing" ? "Ongoing" : "Gig"} ·{" "}
                  {gig.budget_type === "fixed" ? "Fixed" : "Hourly"} · SGD {gig.budget_amount}
                </p>
              </div>
              <StatusBadge
                label={gigStatusLabel[gig.status]}
                tone={gigStatusTone[gig.status]}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
