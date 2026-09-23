import ReactMarkdown from "react-markdown";
import { readLegalDocument, LEGAL_VERSIONS } from "@/lib/legal";

export const metadata = { title: "Privacy Policy — WaeWork" };

export default async function PrivacyPage() {
  const content = await readLegalDocument("privacy");

  return (
    <section className="mx-auto max-w-2xl px-4 py-20">
      <div className="mb-6 rounded-xl border border-alert/30 bg-alert/10 backdrop-blur-sm px-4 py-3 text-sm font-medium text-ink-navy">
        Placeholder content — needs real legal review before launch.
      </div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate">
        Version {LEGAL_VERSIONS.privacy}
      </p>
      <article className="prose-legal text-slate [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-ink-navy [&_p]:mt-4">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </section>
  );
}
