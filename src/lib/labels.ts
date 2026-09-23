// UI labels for DB enum values that don't map 1:1 to spec terminology —
// see the plan's reconciliation notes (e.g. applications.status keeps its
// existing "accepted"/"pending" values in the DB, but reads as
// "Matched"/"Submitted" everywhere in the UI). One place to edit instead
// of duplicating strings across hirer/talent components.

export const applicationStatusLabel: Record<string, string> = {
  pending: "Submitted",
  shortlisted: "Shortlisted",
  accepted: "Matched",
  rejected: "Declined",
  withdrawn: "Withdrawn",
};

export const milestoneStatusLabel: Record<string, string> = {
  pending: "Not started",
  submitted: "Awaiting review",
  approved: "Approved",
  rejected: "Rejected",
  paid: "Paid",
  disputed: "Disputed",
};

export const contractStatusLabel: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  cancelled: "Cancelled",
  terminated: "Terminated",
};

export const gigStatusLabel: Record<string, string> = {
  draft: "Draft",
  open: "Open",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export type BadgeTone = "neutral" | "success" | "warning" | "error" | "info";

export const applicationStatusTone: Record<string, BadgeTone> = {
  pending: "neutral",
  shortlisted: "info",
  accepted: "success",
  rejected: "error",
  withdrawn: "neutral",
};

export const milestoneStatusTone: Record<string, BadgeTone> = {
  pending: "neutral",
  submitted: "info",
  approved: "success",
  rejected: "error",
  paid: "success",
  disputed: "warning",
};

export const contractStatusTone: Record<string, BadgeTone> = {
  active: "success",
  paused: "warning",
  completed: "info",
  cancelled: "neutral",
  terminated: "error",
};

export const gigStatusTone: Record<string, BadgeTone> = {
  draft: "neutral",
  open: "success",
  in_progress: "info",
  completed: "info",
  cancelled: "neutral",
};
