import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowRight, Briefcase, Clock, MessageCircle, Wallet } from "lucide-react";
import { readLegalDocument, LEGAL_VERSIONS } from "@/lib/legal";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LinkArrow } from "@/components/ui/link-arrow";
import { WhereToNextSection } from "@/components/landing/where-to-next-section";

export const metadata = { title: "Terms of Service — WaeWork" };

const CROSS_LINKS = [
  { icon: Briefcase, title: "See how it works", note: "Verification, held payments, disputes", href: "/how-it-works" },
  { icon: Wallet, title: "See pricing", note: "Every fee, plan and add-on", href: "/pricing" },
  { icon: MessageCircle, title: "Read the FAQ", note: "Short answers to common questions", href: "/faq" },
];

export default async function TermsPage() {
  const raw = await readLegalDocument("tos");
  // The page's own header already renders "Terms of Service" (paired
  // with the status line and stamp) — drop the doc's redundant leading
  // "## Terms of Service" so it isn't repeated inside the card.
  const content = raw.replace(/^##\s+.+\n/, "");

  return (
    <div>
      <div className="px-4 pt-16 pb-16 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <EyebrowLabel dash>Legal</EyebrowLabel>
          <h1 className="mt-3 text-balance font-display text-display leading-[1.02] font-extrabold tracking-[-0.03em] text-ink-navy">
            Terms of <span className="text-voyage-blue">Service</span>
          </h1>
          <p className="mt-3 text-lede leading-[1.55] text-slate">
            Our Terms of Service haven&apos;t had a formal legal review yet — the draft below is what governs the
            platform in the meantime, and will be replaced with the reviewed version before a full public launch.
          </p>

          <div className="mt-8 rounded-2xl border border-line bg-white p-[clamp(22px,3.4vw,40px)] shadow-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink-navy">Terms of Service</h2>
                <p className="mt-1 font-mono text-xs font-bold tracking-[0.12em] text-alert uppercase">
                  Status · draft, pending legal review
                </p>
              </div>
              <span
                className="mt-1 mr-2.5 inline-flex shrink-0 flex-col items-center gap-0.5 rounded-[10px] border-[2.5px] px-3.5 py-2 font-mono text-xs font-bold tracking-[0.16em] text-alert uppercase [border-style:double] [mix-blend-mode:multiply]"
                style={{ borderColor: "#9A5B00", transform: "rotate(-7deg)", background: "rgba(255,255,255,.6)" }}
              >
                Pending
                <span className="text-[0.625rem] tracking-[0.12em]">Before launch</span>
              </span>
            </div>

            <p className="mt-5 flex items-start gap-3 rounded-lg bg-alert-bg p-3.5 text-ink-navy shadow-[inset_0_0_0_1px_#F5C56B]">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-alert" aria-hidden />
              This is a working draft, not final legal text. It needs review by a lawyer before this becomes a real
              launch.
            </p>

            <p className="mt-6 font-mono text-xs font-bold tracking-[0.1em] text-slate uppercase">
              Version {LEGAL_VERSIONS.tos}
            </p>
            <article className="prose-legal mt-2 text-slate [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink-navy [&_p]:mt-4 [&_em]:text-sm [&_em]:text-slate">
              <ReactMarkdown>{content}</ReactMarkdown>
            </article>

            <p className="mt-6 border-t border-dashed border-mist pt-5 text-slate">
              Questions about our terms?{" "}
              <Link href="/contact?topic=other" className="font-extrabold text-voyage-blue">
                Contact us
              </Link>{" "}
              or email{" "}
              <a href="mailto:hello@waework.com" className="font-extrabold text-voyage-blue">
                hello@waework.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="bg-frost px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-xl">
            <EyebrowLabel>In the meantime</EyebrowLabel>
            <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
              The plain-English version is already here
            </h2>
            <p className="mt-2 text-lede leading-[1.55] text-slate">
              How verification, payment protection and fees work is explained on these pages today.
            </p>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {CROSS_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-white p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-[3px] hover:border-mist hover:shadow-1"
                  >
                    <span className="badge-ico flex h-11 w-11 items-center justify-center rounded-xl bg-cloud-blue text-voyage-blue">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="flex-1 font-display font-bold text-ink-navy">{item.title}</span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate">
                      {item.note}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <WhereToNextSection
        heading="The legal text is on its way. Everything else is ready."
        subheading="Pick your side, or ask us anything the outline doesn't answer."
        cards={[
          { label: "I'm hiring", description: "Post a role and get matched with verified talent.", href: "/signup?role=hirer" },
          { label: "I'm looking for work", description: "Free to join. Get matched with verified hirers.", href: "/signup?role=talent" },
          { label: "Ask us a question", description: "Opens the contact form with the topic filled in.", href: "/contact?topic=other" },
        ]}
      />
    </div>
  );
}
