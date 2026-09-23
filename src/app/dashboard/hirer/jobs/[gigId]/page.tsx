import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { closeJobPost } from "../actions";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { gigStatusLabel, gigStatusTone } from "@/lib/labels";
import { glassCardLight } from "@/components/ui/glass";
import { buttonSecondary } from "@/components/ui/button-classes";

export default async function JobPostDetailPage({
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
    .select("*")
    .eq("id", gigId)
    .eq("hirer_id", user.id)
    .single();

  if (!gig) notFound();

  const { count: applicantCount } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("gig_id", gig.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-navy">{gig.title}</h1>
          <p className="mt-1 text-xs text-slate">
            {gig.engagement_type === "ongoing" ? "Ongoing" : "Gig"} ·{" "}
            {gig.budget_type === "fixed" ? "Fixed" : "Hourly"} · SGD {gig.budget_amount}
          </p>
        </div>
        <StatusBadge label={gigStatusLabel[gig.status]} tone={gigStatusTone[gig.status]} />
      </div>

      <div className={`p-6 ${glassCardLight}`}>
        <p className="whitespace-pre-wrap text-sm text-slate">{gig.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/hirer/applicants/${gig.id}`}
          className="text-sm font-semibold font-bold text-voyage-blue hover:underline"
        >
          View applicants ({applicantCount ?? 0})
        </Link>

        {gig.status !== "cancelled" && (
          <form action={closeJobPost.bind(null, gig.id)}>
            <button type="submit" className={`text-sm ${buttonSecondary}`}>
              Close listing
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
