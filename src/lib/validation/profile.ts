import { z } from "zod";
import { optionalUrlSchema } from "@/lib/url";

export const hirerProfileSchema = z.object({
  company_name: z.string().trim().min(1, "Enter your company name."),
  uen: z.string().trim().optional(),
  company_size: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  website: optionalUrlSchema,
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
  resume_url: optionalUrlSchema,
  portfolio_links: z.string().trim().optional(),
});
