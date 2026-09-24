import { z } from "zod";
import { normalizeUrl, isValidUrl } from "@/lib/url";

// Optional "paste a link" field — accepts blank, and normalizes
// protocol-less input (see src/lib/url.ts) before validating.
const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? normalizeUrl(v) : v))
  .refine((v) => !v || isValidUrl(v), "Enter a valid URL, e.g. waework.com");

export const hirerProfileSchema = z.object({
  company_name: z.string().trim().min(1, "Enter your company name."),
  uen: z.string().trim().optional(),
  company_size: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  website: optionalUrl,
  description: z.string().trim().max(2000).optional(),
});

export const talentProfileSchema = z.object({
  headline: z.string().trim().min(1, "Enter a headline."),
  bio: z.string().trim().max(2000).optional(),
  skills: z.string().trim().min(1, "Enter at least one skill."),
  rate_amount: z.coerce.number().min(0, "Enter a valid rate.").optional(),
  rate_unit: z.enum(["hourly", "monthly"]).optional(),
  years_experience: z.coerce.number().int().min(0).optional(),
  availability: z.string().trim().optional(),
  resume_url: optionalUrl,
  portfolio_links: z.string().trim().optional(),
});
