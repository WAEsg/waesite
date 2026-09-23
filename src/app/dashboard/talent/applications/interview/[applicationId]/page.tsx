import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InterviewScheduler } from "@/components/dashboard/interview-scheduler";
import { glassCardLight } from "@/components/ui/glass";

export default async function TalentInterviewPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: application } = await supabase
    .from("applications")
    .select("id, gig_id, talent_id")
    .eq("id", applicationId)
    .eq("talent_id", user.id)
    .single();
  if (!application) notFound();

  const { data: gig } = await supabase
    .from("gigs")
    .select("title")
    .eq("id", application.gig_id)
    .single();

  const { data: interview } = await supabase
    .from("interviews")
    .select(
      "id, status, proposed_by, proposed_slots, confirmed_slot, video_room_url, hirer_decision"
    )
    .eq("application_id", applicationId)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="font-display text-xl font-bold text-ink-navy">Interview</h1>
      <p className="text-sm text-slate">For &ldquo;{gig?.title ?? "this role"}&rdquo;</p>
      <div className={`p-6 ${glassCardLight}`}>
        <InterviewScheduler applicationId={applicationId} role="talent" interview={interview} />
      </div>
    </div>
  );
}
