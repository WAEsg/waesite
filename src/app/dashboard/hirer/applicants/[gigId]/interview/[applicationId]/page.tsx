import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InterviewScheduler } from "@/components/dashboard/interview-scheduler";
import { glassCardLight } from "@/components/ui/glass";
import { AcknowledgmentForm } from "./acknowledgment-form";

// This page is the hard gate: it checks server-side, on every load, for a
// non_circumvention_acknowledgments row for this exact (hirer, talent,
// gig) triple — there is no client-side redirect to bypass, and no way
// to reach the scheduling UI below by navigating straight to this URL
// without acknowledging first, since the acknowledgment check runs
// before anything else renders.
export default async function InterviewPage({
  params,
}: {
  params: Promise<{ gigId: string; applicationId: string }>;
}) {
  const { gigId, applicationId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: application } = await supabase
    .from("applications")
    .select("id, talent_id, gig_id")
    .eq("id", applicationId)
    .eq("gig_id", gigId)
    .single();
  if (!application) notFound();

  const { data: gig } = await supabase
    .from("gigs")
    .select("id, title, hirer_id")
    .eq("id", gigId)
    .eq("hirer_id", user.id)
    .single();
  if (!gig) notFound();

  const { data: talent } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", application.talent_id)
    .single();
  const talentName = talent?.full_name ?? "this Talent Partner";

  const { data: acknowledgment } = await supabase
    .from("non_circumvention_acknowledgments")
    .select("id")
    .eq("hirer_id", user.id)
    .eq("talent_id", application.talent_id)
    .eq("gig_id", gigId)
    .maybeSingle();

  if (!acknowledgment) {
    return (
      <div className="mx-auto max-w-lg">
        <div className={`p-8 ${glassCardLight}`}>
          <h1 className="font-display text-xl font-bold text-ink-navy">
            Before you connect with {talentName}
          </h1>
          <p className="mt-3 text-sm text-slate">
            By proceeding to interviews, you agree not to engage this talent
            directly outside WaeWork for 12 months from today. Doing so
            incurs a buyout fee as outlined in our Terms of Service.
          </p>
          <p className="mt-3 text-sm text-slate">
            Staying on WaeWork keeps this hire protected — escrow payments,
            the replacement guarantee, and dispute support all depend on
            the engagement running through the platform.
          </p>
          <AcknowledgmentForm applicationId={applicationId} />
        </div>
      </div>
    );
  }

  const { data: interview } = await supabase
    .from("interviews")
    .select(
      "id, status, proposed_by, proposed_slots, confirmed_slot, video_room_url, hirer_decision"
    )
    .eq("application_id", applicationId)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="font-display text-xl font-bold text-ink-navy">Interview — {talentName}</h1>
      <p className="text-sm text-slate">For &ldquo;{gig.title}&rdquo;</p>
      <div className={`p-6 ${glassCardLight}`}>
        <InterviewScheduler applicationId={applicationId} role="hirer" interview={interview} />
      </div>
    </div>
  );
}
