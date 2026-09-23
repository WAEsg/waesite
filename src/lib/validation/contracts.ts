import { z } from "zod";

export const jobPostSchema = z.object({
  title: z.string().trim().min(1, "Enter a title."),
  description: z.string().trim().min(20, "Add a bit more detail (20+ characters)."),
  category: z.string().trim().optional(),
  engagement_type: z.enum(["ongoing", "gig"], { error: "Choose an engagement type." }),
  budget_type: z.enum(["fixed", "hourly"], { error: "Choose a budget type." }),
  budget_amount: z.coerce.number().min(0, "Enter a valid budget."),
  urgent: z.coerce.boolean().optional(),
});

export const applicationDecisionSchema = z.object({
  application_id: z.string().uuid(),
  status: z.enum(["shortlisted", "accepted", "rejected"], { error: "Choose a decision." }),
});

export const milestoneCreateSchema = z.object({
  contract_id: z.string().uuid(),
  title: z.string().trim().min(1, "Enter a title."),
  description: z.string().trim().optional(),
  amount: z.coerce.number().min(0, "Enter a valid amount."),
  sequence_order: z.coerce.number().int().min(1),
  due_date: z.string().trim().optional(),
});

export const milestoneSubmitSchema = z.object({
  milestone_id: z.string().uuid(),
  submission_link: z.string().trim().url("Enter a valid link to your deliverable."),
});

export const milestoneReviewSchema = z.object({
  milestone_id: z.string().uuid(),
  decision: z.enum(["approve", "dispute"], { error: "Choose approve or dispute." }),
  dispute_reason: z.string().trim().optional(),
});

export const checkinSubmitSchema = z.object({
  contract_id: z.string().uuid(),
  talent_note: z.string().trim().min(1, "Add a short note."),
});

export const checkinAcknowledgeSchema = z.object({
  checkin_id: z.string().uuid(),
});
