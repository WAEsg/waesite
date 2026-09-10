import { z } from "zod";

// A short lead-capture form — deliberately separate from the full
// hiring flow used for human placements, since AI Workforce is a
// newer, early-access offering.
export const aiWorkforceInterestSchema = z.object({
  business_name: z.string().trim().min(1, "Enter your business name."),
  contact_name: z.string().trim().min(1, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  role_interest: z.string().trim().optional(),
  pain_point: z
    .string()
    .trim()
    .min(10, "Tell us a bit more (at least 10 characters)."),
});
