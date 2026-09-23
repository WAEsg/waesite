"use client";

import { useActionState } from "react";
import { sendMessage, type MessagingActionState } from "@/app/dashboard/_shared/messaging-actions";
import { glassPanelLight } from "@/components/ui/glass";
import { buttonPrimarySm } from "@/components/ui/button-classes";

const initial: MessagingActionState = { error: null };

export type MessageRow = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export function MessageThread({
  conversationId,
  messages,
  currentUserId,
  matched,
}: {
  conversationId: string;
  messages: MessageRow[];
  currentUserId: string;
  matched: boolean;
}) {
  const [state, formAction, pending] = useActionState(sendMessage, initial);

  return (
    <div className="flex h-[600px] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-1">
        {messages.length === 0 && (
          <p className="text-sm text-ink-navy/60">No messages yet — say hello.</p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === currentUserId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  mine
                    ? "bg-voyage-blue text-paper-white"
                    : `${glassPanelLight} text-ink-navy`
                }`}
              >
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p className={`mt-1 text-[10px] ${mine ? "text-paper-white/70" : "text-ink-navy/50"}`}>
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {!matched && (
        <p className="mb-2 text-xs text-ink-navy/60">
          Phone numbers, emails, and social handles are hidden here until you&apos;re matched —
          keep the conversation on WaeWork for now.
        </p>
      )}

      <form action={formAction} className="flex items-end gap-2">
        <input type="hidden" name="conversation_id" value={conversationId} />
        <textarea
          name="body"
          required
          rows={2}
          placeholder="Write a message…"
          className="flex-1 rounded-xl border border-ink-navy/15 bg-paper-white px-3 py-2 text-sm text-ink-navy outline-none focus:border-voyage-blue"
        />
        <button type="submit" disabled={pending} className={`text-sm ${buttonPrimarySm}`}>
          {pending ? "Sending…" : "Send"}
        </button>
      </form>
      {state.error && <p className="mt-1 text-xs text-error">{state.error}</p>}
    </div>
  );
}
