import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight } from "@/components/ui/glass";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { applicationStatusLabel, applicationStatusTone } from "@/lib/labels";

export default async function MyApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: applications } = await supabase
    .from("applications")
    .select("id, gig_id, status, created_at")
    .eq("talent_id", user.id)
    .order("created_at", { ascending: false });

  const gigIds = (applications ?? []).map((a) => a.gig_id);
  const { data: gigs } = gigIds.length
    ? await supabase.from("gigs").select("id, title").in("id", gigIds)
    : { data: [] };
  const titleById = new Map((gigs ?? []).map((g) => [g.id, g.title]));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">My applications</h1>

      {!applications?.length ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Browse available jobs to apply for your first role."
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className={`flex items-center justify-between p-5 ${glassCardLight}`}>
              <div>
                <p className="font-semibold text-ink-navy">{titleById.get(app.gig_id) ?? "Job post"}</p>
                <p className="mt-1 text-xs text-slate">
                  Applied {new Date(app.created_at).toLocaleDateString()}
                </p>
                <Link
                  href={`/dashboard/talent/messages/start/${app.id}`}
                  className="mt-1 inline-block text-xs font-semibold text-voyage-blue hover:text-ink-navy"
                >
                  Message
                </Link>
              </div>
              <StatusBadge
                label={applicationStatusLabel[app.status]}
                tone={applicationStatusTone[app.status]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
