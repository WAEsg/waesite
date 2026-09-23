"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { maskContactInfo } from "@/lib/messaging/mask";
import { sendEmail } from "@/lib/notifications/send";

export type MessagingActionState = { error: string | null };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user: user! };
}

// Lazily creates the conversation for an application on first visit —
// called directly from Server Components (inbox/thread pages), not
// bound to a form. Messaging is available from application submission
// through contract confirmation (and after), so any application can
// have a conversation.
export async function getOrCreateConversation(applicationId: string) {
  const { supabase } = await requireUser();

  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("application_id", applicationId)
    .maybeSingle();
  if (existing) return existing;

  const { data: application } = await supabase
    .from("applications")
    .select("gig_id, talent_id")
    .eq("id", applicationId)
    .single();
  if (!application) return null;

  const { data: gig } = await supabase
    .from("gigs")
    .select("hirer_id")
    .eq("id", application.gig_id)
    .single();
  if (!gig) return null;

  const { data: created } = await supabase
    .from("conversations")
    .insert({
      application_id: applicationId,
      gig_id: application.gig_id,
      hirer_id: gig.hirer_id,
      talent_id: application.talent_id,
    })
    .select("*")
    .single();

  return created;
}

// Full masking applies only pre-match — once a contract exists between
// the two parties, restrictions lift (spec D).
async function isMatched(
  supabase: Awaited<ReturnType<typeof createClient>>,
  hirerId: string,
  talentId: string
) {
  const { count } = await supabase
    .from("contracts")
    .select("id", { count: "exact", head: true })
    .eq("hirer_id", hirerId)
    .eq("talent_id", talentId);
  return (count ?? 0) > 0;
}

export async function sendMessage(
  _prevState: MessagingActionState,
  formData: FormData
): Promise<MessagingActionState> {
  const { supabase, user } = await requireUser();
  const conversationId = formData.get("conversation_id");
  const body = formData.get("body");

  if (typeof conversationId !== "string" || typeof body !== "string" || !body.trim()) {
    return { error: "Write a message first." };
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("hirer_id, talent_id")
    .eq("id", conversationId)
    .single();
  if (!conversation) return { error: "Conversation not found." };

  const matched = await isMatched(supabase, conversation.hirer_id, conversation.talent_id);
  const finalBody = matched ? body.trim() : maskContactInfo(body.trim());

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: finalBody,
  });
  if (error) return { error: error.message };

  const recipientId = user.id === conversation.hirer_id ? conversation.talent_id : conversation.hirer_id;
  // A talent's own RLS-scoped session can't read an arbitrary hirer's
  // `users` row (only hirer->talent visibility exists on this table, via
  // an application relationship) — admin client is the trusted
  // server-side path for this notification lookup, same rule as every
  // other cross-role notification lookup in this pass.
  const admin = createAdminClient();
  const { data: recipient } = await admin
    .from("users")
    .select("email, role")
    .eq("id", recipientId)
    .single();

  if (recipient?.email && recipient.role) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
    await sendEmail({
      to: recipient.email,
      subject: "New message on WaeWork",
      heading: "You have a new message",
      body: "Someone you're working with on WaeWork just sent you a message.",
      ctaLabel: "View message",
      ctaUrl: `${siteUrl}/dashboard/${recipient.role}/messages/${conversationId}`,
    });
  }

  revalidatePath(`/dashboard/hirer/messages/${conversationId}`);
  revalidatePath(`/dashboard/talent/messages/${conversationId}`);
  return { error: null };
}
