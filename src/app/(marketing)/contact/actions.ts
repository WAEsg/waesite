"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/validation/contact";
import { verifyTurnstile } from "@/lib/turnstile";

export type ContactActionState = { status: "idle" | "error" | "sent" | "unconfigured"; message: string | null };

export async function submitContact(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const verified = await verifyTurnstile(formData.get("cf-turnstile-response"));
  if (!verified) {
    return { status: "error", message: "Verification failed — please try again." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "hello@waework.co";

  if (!apiKey) {
    return {
      status: "unconfigured",
      message: `This form isn't fully wired up yet — email us directly at ${to} and we'll get back to you.`,
    };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "WaeWork Contact <onboarding@resend.dev>",
    to,
    replyTo: parsed.data.email,
    subject: `New contact form message from ${parsed.data.name}`,
    text: parsed.data.message,
  });

  if (error) {
    return { status: "error", message: "Something went wrong sending your message. Please try again." };
  }

  return { status: "sent", message: "Thanks — we'll be in touch soon." };
}
