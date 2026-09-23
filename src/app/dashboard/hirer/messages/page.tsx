import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { glassCardLight, glassCardLightHover } from "@/components/ui/glass";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function HirerMessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, talent_id, gig_id, created_at")
    .eq("hirer_id", user.id)
    .order("created_at", { ascending: false });

  const talentIds = [...new Set((conversations ?? []).map((c) => c.talent_id))];
  const gigIds = [...new Set((conversations ?? []).map((c) => c.gig_id))];
  const conversationIds = (conversations ?? []).map((c) => c.id);

  const [{ data: talents }, { data: gigs }, { data: messages }] = await Promise.all([
    talentIds.length
      ? supabase.from("users").select("id, full_name").in("id", talentIds)
      : Promise.resolve({ data: [] }),
    gigIds.length
      ? supabase.from("gigs").select("id, title").in("id", gigIds)
      : Promise.resolve({ data: [] }),
    conversationIds.length
      ? supabase
          .from("messages")
          .select("conversation_id, body, created_at")
          .in("conversation_id", conversationIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  const talentById = new Map((talents ?? []).map((t) => [t.id, t.full_name]));
  const gigById = new Map((gigs ?? []).map((g) => [g.id, g.title]));
  const lastMessageByConversation = new Map<string, { body: string; created_at: string }>();
  for (const m of messages ?? []) {
    if (!lastMessageByConversation.has(m.conversation_id)) {
      lastMessageByConversation.set(m.conversation_id, m);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-navy">Messages</h1>

      {!conversations?.length ? (
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Once someone applies to your job post, you can message them from the Applicants tab."
        />
      ) : (
        <div className="space-y-3">
          {conversations.map((c) => {
            const last = lastMessageByConversation.get(c.id);
            return (
              <Link
                key={c.id}
                href={`/dashboard/hirer/messages/${c.id}`}
                className={`block p-5 ${glassCardLight} ${glassCardLightHover}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink-navy">{talentById.get(c.talent_id) ?? "Talent partner"}</p>
                  {last && (
                    <p className="text-xs text-slate">{new Date(last.created_at).toLocaleDateString()}</p>
                  )}
                </div>
                <p className="text-xs text-slate">{gigById.get(c.gig_id) ?? "Job post"}</p>
                {last && <p className="mt-1 truncate text-sm text-slate">{last.body}</p>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
