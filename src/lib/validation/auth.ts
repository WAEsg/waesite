import { z } from "zod";
import { optionalUrlSchema } from "@/lib/url";

export const signUpSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const logInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const requestPasswordResetSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const onboardingSchema = z.object({
  role: z.enum(["hirer", "talent"], {
    error: "Choose whether you're hiring or looking for work.",
  }),
  full_name: z.string().trim().min(1, "Enter your name."),
  country: z.string().trim().min(1, "Enter your country."),
  business_name: z.string().trim().optional(),
  // Talent-only, all optional — asked here so signup completion doesn't
  // dump someone into an empty dashboard, but none of these should block
  // finishing signup if left blank (they're editable later on the full
  // profile page either way).
  avatar_url: z.string().trim().optional(),
  bio: z.string().trim().max(2000).optional(),
  portfolio_link: optionalUrlSchema,
  resume_url: optionalUrlSchema,
});
