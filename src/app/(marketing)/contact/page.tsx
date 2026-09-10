import type { Metadata } from "next";
import { glassCard } from "@/components/ui/glass";
import { footerContact } from "@/lib/landing-data";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact WaeWork",
  description:
    "Get in touch with WaeWork — questions about hiring, applying, or partnering with us.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-center font-display text-3xl font-bold text-frost sm:text-4xl">
        Get in touch
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-mist">
        Questions about hiring, applying, or partnering with WaeWork? Send
        us a message, or email {footerContact.email} directly.
      </p>

      <div className={`mt-8 p-6 sm:p-8 ${glassCard}`}>
        <ContactForm />
      </div>
    </div>
  );
}
