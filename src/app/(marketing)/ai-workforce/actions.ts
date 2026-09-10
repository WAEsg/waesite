"use server";

import { Resend } from "resend";
import { aiWorkforceInterestSchema } from "@/lib/validation/ai-workforce";
import { verifyTurnstile } from "@/lib/turnstile";
import { aiStaffingTiers } from "@/lib/landing-data";

export type AiWorkforceActionState = {
  status: "idle" | "error" | "sent" | "unconfigured";
  message: string | null;
};

export async function submitAiWorkforceInterest(
  _prevState: AiWorkforceActionState,
  formData: FormData
): Promise<AiWorkforceActionState> {
  const verified = await verifyTurnstile(formData.get("cf-turnstile-response"));
  if (!verified) {
    return { status: "error", message: "Verification failed — please try again." };
  }

  const parsed = aiWorkforceInterestSchema.safeParse({
    business_name: formData.get("business_name"),
    contact_name: formData.get("contact_name"),
    email: formData.get("email"),
    role_interest: formData.get("role_interest") || undefined,
    pain_point: formData.get("pain_point"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "hello@waework.co";

  if (!apiKey) {
    return {
      status: "unconfigured",
      message: `This form isn't fully wired up yet — email us directly at ${to} and we'll add you to the AI Workforce waitlist.`,
    };
  }

  const { business_name, contact_name, email, role_interest, pain_point } = parsed.data;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "WaeWork AI Workforce <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `AI Workforce waitlist — ${business_name}`,
    text: [
      `Business: ${business_name}`,
      `Contact: ${contact_name} <${email}>`,
      role_interest ? `Interested in: ${role_interest}` : null,
      "",
      "What's eating up their time:",
      pain_point,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    return { status: "error", message: "Something went wrong sending your message. Please try again." };
  }

  const starterPrice = aiStaffingTiers.find((t) => t.founding)?.price;

  return {
    status: "sent",
    message: starterPrice
      ? `You're on the list — we'll be in touch as early access capacity opens up. As a Founding Member, your Starter plan locks in at ${starterPrice}.`
      : "You're on the list — we'll be in touch as early access capacity opens up.",
  };
}
