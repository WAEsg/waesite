"use server";

// Shared by both hirer and talent interview pages — same reasoning as
// contract-actions.ts: one set of actions, RLS decides who can do what.

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createInterviewRoom } from "@/lib/video/daily";
import { sendEmail } from "@/lib/notifications/send";

export type InterviewActionState = { error: string | null };
const ok: InterviewActionState = { error: null };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
const DECISION_REASONS = ["fit", "availability", "communication", "changed_requirements", "other"] as const;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user: user! };
}

// Looks up the hirer/talent/gig this application belongs to — the admin
// client is used for the email lookups specifically (same cross-role RLS
// gap documented throughout contract-actions.ts), not for authorization,
// which the caller's own RLS-scoped `supabase` client still governs.
async function loadApplicationContext(applicationId: string) {
  const admin = createAdminClient();
  const { data: application } = await admin
    .from("applications")
    .select("id, gig_id, talent_id")
    .eq("id", applicationId)
    .single();
  if (!application) return null;

  const { data: gig } = await admin
    .from("gigs")
    .select("id, hirer_id, title")
    .eq("id", application.gig_id)
    .single();
  if (!gig) return null;

  return { applicationId: application.id, gigId: gig.id, gigTitle: gig.title, hirerId: gig.hirer_id, talentId: application.talent_id };
}

function interviewUrl(role: "hirer" | "talent", gigId: string, applicationId: string): string {
  return role === "hirer"
    ? `${SITE_URL}/dashboard/hirer/applicants/${gigId}/interview/${applicationId}`
    : `${SITE_URL}/dashboard/talent/applications/interview/${applicationId}`;
}

async function notifyUser(userId: string, params: { subject: string; heading: string; body: string; ctaLabel: string; ctaUrl: string }) {
  const admin = createAdminClient();
  const { data: user } = await admin.from("users").select("email").eq("id", userId).single();
  if (!user?.email) return;
  await sendEmail({ to: user.email, ...params });
}

// ============================================================
// Non-circumvention acknowledgment — the hard gate
// ============================================================

export async function acknowledgeNonCircumvention(
  _prevState: InterviewActionState,
  formData: FormData
): Promise<InterviewActionState> {
  const { supabase, user } = await requireUser();
  const applicationId = formData.get("application_id");
  if (typeof applicationId !== "string") return { error: "Invalid request." };

  const ctx = await loadApplicationContext(applicationId);
  if (!ctx || ctx.hirerId !== user.id) return { error: "Application not found." };

  const { error } = await supabase.from("non_circumvention_acknowledgments").insert({
    hirer_id: user.id,
    talent_id: ctx.talentId,
    gig_id: ctx.gigId,
  });
  // A duplicate (already acknowledged) is fine — treat as success rather
  // than surfacing a unique-constraint error to the user.
  if (error && error.code !== "23505") return { error: error.message };

  revalidatePath(`/dashboard/hirer/applicants/${ctx.gigId}/interview/${applicationId}`);
  return ok;
}

// ============================================================
// Scheduling — simple ping-pong, no calendar sync
// ============================================================

export async function proposeInterviewSlots(
  _prevState: InterviewActionState,
  formData: FormData
): Promise<InterviewActionState> {
  const { supabase, user } = await requireUser();
  const applicationId = formData.get("application_id");
  const slots = formData.getAll("slot").filter((s): s is string => typeof s === "string" && s.length > 0);
  if (typeof applicationId !== "string" || slots.length < 1) {
    return { error: "Propose at least one time." };
  }

  const ctx = await loadApplicationContext(applicationId);
  if (!ctx) return { error: "Application not found." };

  const isHirer = user.id === ctx.hirerId;
  const isTalent = user.id === ctx.talentId;
  if (!isHirer && !isTalent) return { error: "Not authorized." };

  const proposedBy = isHirer ? "hirer" : "talent";
  const nextStatus = isHirer ? "awaiting_talent" : "awaiting_hirer";

  const { data: existing } = await supabase
    .from("interviews")
    .select("id")
    .eq("application_id", applicationId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("interviews")
      .update({ proposed_by: proposedBy, proposed_slots: slots, status: nextStatus, confirmed_slot: null })
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    if (!isHirer) return { error: "Only the hirer can start scheduling." };
    const { error } = await supabase.from("interviews").insert({
      application_id: applicationId,
      hirer_id: ctx.hirerId,
      talent_id: ctx.talentId,
      gig_id: ctx.gigId,
      proposed_by: "hirer",
      proposed_slots: slots,
      status: "awaiting_talent",
    });
    if (error) return { error: error.message };
  }

  const recipientId = isHirer ? ctx.talentId : ctx.hirerId;
  const recipientRole = isHirer ? "talent" : "hirer";
  await notifyUser(recipientId, {
    subject: "Interview times proposed on WaeWork",
    heading: "Pick an interview time",
    body: `A time has been proposed for your interview on "${ctx.gigTitle}".`,
    ctaLabel: "View times",
    ctaUrl: interviewUrl(recipientRole, ctx.gigId, applicationId),
  });

  revalidatePath(`/dashboard/hirer/applicants/${ctx.gigId}/interview/${applicationId}`);
  revalidatePath(`/dashboard/talent/applications/interview/${applicationId}`);
  return ok;
}

export async function confirmInterviewSlot(
  _prevState: InterviewActionState,
  formData: FormData
): Promise<InterviewActionState> {
  const { supabase, user } = await requireUser();
  const applicationId = formData.get("application_id");
  const slot = formData.get("slot");
  if (typeof applicationId !== "string" || typeof slot !== "string") {
    return { error: "Invalid request." };
  }

  const ctx = await loadApplicationContext(applicationId);
  if (!ctx) return { error: "Application not found." };

  const { data: interview } = await supabase
    .from("interviews")
    .select("id")
    .eq("application_id", applicationId)
    .single();
  if (!interview) return { error: "No scheduling in progress yet." };

  const roomUrl = await createInterviewRoom(interview.id);

  const { error } = await supabase
    .from("interviews")
    .update({ status: "confirmed", confirmed_slot: slot, video_room_url: roomUrl })
    .eq("id", interview.id);
  if (error) return { error: error.message };

  const isHirer = user.id === ctx.hirerId;
  const otherId = isHirer ? ctx.talentId : ctx.hirerId;
  const otherRole = isHirer ? "talent" : "hirer";
  await notifyUser(otherId, {
    subject: "Interview confirmed on WaeWork",
    heading: "Interview time confirmed",
    body: `Your interview for "${ctx.gigTitle}" is confirmed.`,
    ctaLabel: "View interview",
    ctaUrl: interviewUrl(otherRole, ctx.gigId, applicationId),
  });

  revalidatePath(`/dashboard/hirer/applicants/${ctx.gigId}/interview/${applicationId}`);
  revalidatePath(`/dashboard/talent/applications/interview/${applicationId}`);
  return ok;
}

// ============================================================
// The call itself — join tracking powers no-show detection
// ============================================================

export async function recordCallJoin(applicationId: string) {
  const { supabase, user } = await requireUser();
  const ctx = await loadApplicationContext(applicationId);
  if (!ctx) return;

  const now = new Date().toISOString();
  if (user.id === ctx.hirerId) {
    await supabase
      .from("interviews")
      .update({ hirer_joined_at: now })
      .eq("application_id", applicationId)
      .is("hirer_joined_at", null);
  } else if (user.id === ctx.talentId) {
    await supabase
      .from("interviews")
      .update({ talent_joined_at: now })
      .eq("application_id", applicationId)
      .is("talent_joined_at", null);
  }
}

export async function markInterviewComplete(
  _prevState: InterviewActionState,
  formData: FormData
): Promise<InterviewActionState> {
  const { supabase } = await requireUser();
  const applicationId = formData.get("application_id");
  if (typeof applicationId !== "string") return { error: "Invalid request." };

  const ctx = await loadApplicationContext(applicationId);
  if (!ctx) return { error: "Application not found." };

  const { data: interview } = await supabase
    .from("interviews")
    .select("id, hirer_joined_at, talent_joined_at")
    .eq("application_id", applicationId)
    .single();
  if (!interview) return { error: "No interview to complete." };

  const { error } = await supabase
    .from("interviews")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", interview.id);
  if (error) return { error: error.message };

  const admin = createAdminClient();
  const noShowUserIds = [
    !interview.hirer_joined_at ? ctx.hirerId : null,
    !interview.talent_joined_at ? ctx.talentId : null,
  ].filter((id): id is string => id !== null);

  for (const userId of noShowUserIds) {
    const { data: target } = await admin.from("users").select("no_show_count").eq("id", userId).single();
    await admin
      .from("users")
      .update({ no_show_count: (target?.no_show_count ?? 0) + 1 })
      .eq("id", userId);
  }

  revalidatePath(`/dashboard/hirer/applicants/${ctx.gigId}/interview/${applicationId}`);
  revalidatePath(`/dashboard/talent/applications/interview/${applicationId}`);
  return ok;
}

// ============================================================
// Hirer's post-call decision — unlocks "Match & create contract"
// ============================================================

export async function recordHirerDecision(
  _prevState: InterviewActionState,
  formData: FormData
): Promise<InterviewActionState> {
  const { supabase, user } = await requireUser();
  const applicationId = formData.get("application_id");
  const decision = formData.get("decision");
  const reasonRaw = formData.get("reason");
  const notes = formData.get("notes");

  if (
    typeof applicationId !== "string" ||
    (decision !== "confirm" && decision !== "decline")
  ) {
    return { error: "Invalid request." };
  }
  const reason =
    typeof reasonRaw === "string" && (DECISION_REASONS as readonly string[]).includes(reasonRaw)
      ? (reasonRaw as (typeof DECISION_REASONS)[number])
      : null;

  const ctx = await loadApplicationContext(applicationId);
  if (!ctx || ctx.hirerId !== user.id) return { error: "Not authorized." };

  const { data: interview } = await supabase
    .from("interviews")
    .select("id")
    .eq("application_id", applicationId)
    .single();
  if (!interview) return { error: "No interview on record." };

  const { error } = await supabase
    .from("interviews")
    .update({
      hirer_decision: decision,
      decision_reason: reason,
      decision_notes: typeof notes === "string" && notes ? notes : null,
      decided_at: new Date().toISOString(),
    })
    .eq("id", interview.id);
  if (error) return { error: error.message };

  if (decision === "decline") {
    await supabase.from("applications").update({ status: "rejected" }).eq("id", applicationId);
  }

  revalidatePath(`/dashboard/hirer/applicants/${ctx.gigId}`);
  revalidatePath(`/dashboard/hirer/applicants/${ctx.gigId}/interview/${applicationId}`);
  return ok;
}
