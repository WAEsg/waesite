import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContractDetail } from "@/components/contracts/contract-detail";

export default async function HirerContractDetailPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: contract } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", contractId)
    .eq("hirer_id", user.id)
    .single();
  if (!contract) notFound();

  const [{ data: talent }, { data: milestones }, { data: checkins }, { data: termination }, { data: myReview }] =
    await Promise.all([
      supabase.from("users").select("full_name").eq("id", contract.talent_id).single(),
      supabase
        .from("milestones")
        .select("id, title, description, amount, status, sequence_order, submission_link, due_date")
        .eq("contract_id", contractId),
      supabase
        .from("checkins")
        .select("id, day, talent_note, client_acknowledged, submitted_at")
        .eq("contract_id", contractId)
        .order("submitted_at", { ascending: false }),
      supabase.from("terminations").select("*").eq("contract_id", contractId).maybeSingle(),
      supabase
        .from("reviews")
        .select("score, comment")
        .eq("contract_id", contractId)
        .eq("rater_id", user.id)
        .maybeSingle(),
    ]);

  return (
    <ContractDetail
      contract={contract}
      counterpartName={talent?.full_name ?? "Talent partner"}
      role="hirer"
      milestones={milestones ?? []}
      checkins={checkins ?? []}
      termination={termination ?? null}
      myReview={myReview ?? null}
    />
  );
}
