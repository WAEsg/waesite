import { z } from "zod";

export const CONTACT_TOPICS = [
  "Hiring",
  "Applying for work",
  "Partnering",
  "Hiring at scale",
  "AI Staffing",
  "Something else",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  topic: z.enum(CONTACT_TOPICS).optional(),
  message: z.string().trim().min(10, "Tell us a bit more (at least 10 characters)."),
});
