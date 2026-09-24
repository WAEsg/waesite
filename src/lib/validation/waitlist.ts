import { z } from "zod";

// The "Founding Talent" pre-launch waitlist — deliberately more detailed
// than the AI Workforce lead-capture form, since these fields (skill,
// portfolio, availability, rate) are exactly what the eventual invite
// flow needs to pre-fill a real signup with.
export const waitlistSignupSchema = z.object({
  full_name: z.string().trim().min(1, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  skill_category: z.string().trim().min(1, "Choose the closest fit."),
  portfolio_link: z
    .string()
    .trim()
    .min(1, "Add a portfolio or work sample link.")
    .refine((v) => /^https?:\/\//.test(v), "Enter a full link starting with http:// or https://"),
  availability: z.string().trim().optional(),
  expected_rate: z.string().trim().optional(),
  intro_text: z.string().trim().max(600, "Keep it under 600 characters.").optional(),
});
