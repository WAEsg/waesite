import { redirect, notFound } from "next/navigation";
import { getOrCreateConversation } from "@/app/dashboard/_shared/messaging-actions";

export default async function StartHirerConversationPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const conversation = await getOrCreateConversation(applicationId);
  if (!conversation) notFound();
  redirect(`/dashboard/hirer/messages/${conversation.id}`);
}
