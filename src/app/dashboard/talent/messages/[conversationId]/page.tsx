import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageThread } from "@/components/messaging/message-thread";

export default async function TalentConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, hirer_id, gig_id, talent_id")
    .eq("id", conversationId)
    .eq("talent_id", user.id)
    .single();
  if (!conversation) notFound();

  const [{ data: hirerProfile }, { data: gig }, { data: messages }, { count: matchCount }] = await Promise.all([
    supabase.from("hirer_profiles").select("company_name").eq("user_id", conversation.hirer_id).maybeSingle(),
    supabase.from("gigs").select("title").eq("id", conversation.gig_id).single(),
    supabase
      .from("messages")
      .select("id, sender_id, body, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true }),
    supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("hirer_id", conversation.hirer_id)
      .eq("talent_id", conversation.talent_id),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold text-ink-navy">
          {hirerProfile?.company_name ?? "Hirer"}
        </h1>
        <p className="text-xs text-slate">{gig?.title ?? "Job post"}</p>
      </div>
      <MessageThread
        conversationId={conversationId}
        messages={messages ?? []}
        currentUserId={user.id}
        matched={(matchCount ?? 0) > 0}
      />
    </div>
  );
}
