"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { sendWaitlistInvites, type WaitlistInviteActionState } from "../actions";
import { buttonPrimary } from "@/components/ui/button-classes";

const initial: WaitlistInviteActionState = { error: null, message: null };

export function SendInvitesButton({ pendingCount }: { pendingCount: number }) {
  const [state, formAction, pending] = useActionState(sendWaitlistInvites, initial);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(`Send an invite email to all ${pendingCount} waitlisted people right now?`)) {
          e.preventDefault();
        }
      }}
      className="flex flex-col items-start gap-2"
    >
      <button type="submit" disabled={pending || pendingCount === 0} className={`text-sm ${buttonPrimary}`}>
        <Send className="h-4 w-4" aria-hidden />
        {pending ? "Sending…" : `Invite all waitlisted (${pendingCount})`}
      </button>
      {state.error && <p className="text-xs font-bold text-error">{state.error}</p>}
      {state.message && <p className="text-xs font-bold text-success">{state.message}</p>}
    </form>
  );
}
