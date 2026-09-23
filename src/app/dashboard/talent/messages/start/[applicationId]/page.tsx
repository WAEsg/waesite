import { redirect, notFound } from "next/navigation";
import { getOrCreateConversation } from "@/app/dashboard/_shared/messaging-actions";

export default async function StartTalentConversationPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const conversation = await getOrCreateConversation(applicationId);
  if (!conversation) notFound();
  redirect(`/dashboard/talent/messages/${conversation.id}`);
}
