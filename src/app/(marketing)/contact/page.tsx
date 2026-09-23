import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Mail, User, Wallet } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { footerContact } from "@/lib/landing-data";
import { WhereToNextSection } from "@/components/landing/where-to-next-section";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact WaeWork",
  description: "Get in touch with WaeWork — questions about hiring, applying, or partnering with us.",
};

const ROUTES = [
  { icon: Briefcase, title: "I want to hire", note: "See how hiring works, step by step", href: "/for-hirers" },
  { icon: User, title: "I want to work", note: "Become a Talent Partner. Free to join", href: "/for-talent" },
  { icon: Wallet, title: "Pricing questions", note: "Every fee, plan and add-on on one page", href: "/pricing" },
];

const QUICK_ANSWERS = [
  { icon: Wallet, q: "How does payment protection work?", href: "/faq" },
  { icon: Wallet, q: "How much does WaeWork cost?", href: "/faq" },
  { icon: User, q: "How are hirers and talent verified?", href: "/faq" },
];

export default function ContactPage() {
  return (
    <div>
      <div className="px-4 pt-16 pb-16 sm:pt-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr_0.9fr] lg:items-start">
          <div>
            <EyebrowLabel dash>Contact</EyebrowLabel>
            <h1 className="mt-3 text-balance font-display text-display leading-[1.02] font-extrabold tracking-[-0.03em] text-ink-navy">
              Get in <span className="text-voyage-blue">touch</span>
            </h1>
            <p className="mt-3 text-lede leading-[1.55] text-slate">
              Questions about hiring, applying, or partnering with WaeWork? Send us a message, or email{" "}
              <a href={`mailto:${footerContact.email}`} className="font-extrabold text-voyage-blue">
                {footerContact.email}
              </a>{" "}
              directly.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6 shadow-1 sm:p-8">
            <ContactForm />
          </div>

          <div className="flex flex-col gap-7">
            <div className="flex overflow-hidden rounded-2xl border border-line bg-white shadow-1">
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-line pb-3">
                  <span className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">Email us directly</span>
                  <a href={`mailto:${footerContact.email}`} className="font-extrabold text-voyage-blue">
                    {footerContact.email}
                  </a>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[0.6875rem] font-bold tracking-[0.1em] text-slate uppercase">Base</span>
                  <span className="font-bold text-ink-navy">{footerContact.location}</span>
                </div>
              </div>
              <div className="flex w-16 shrink-0 flex-col items-center justify-center gap-2 border-l-2 border-dashed border-mist bg-frost text-voyage-blue">
                <Mail className="h-5 w-5" aria-hidden />
                <span className="font-mono text-[0.625rem] font-bold tracking-[0.1em]">SIN</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="font-mono text-xs font-bold tracking-[0.14em] text-slate uppercase">Not a question? Go straight there</h2>
              <ul className="flex flex-col gap-2">
                {ROUTES.map((route) => {
                  const Icon = route.icon;
                  return (
                    <li key={route.title}>
                      <Link
                        href={route.href}
                        className="group flex items-center gap-3.5 rounded-2xl border border-line bg-white p-4 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-[3px] hover:border-mist hover:shadow-1"
                      >
                        <span className="badge-ico flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cloud-blue text-voyage-blue">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-extrabold text-ink-navy">{route.title}</span>
                          <span className="block text-sm text-slate">{route.note}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-mist transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-voyage-blue" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-frost px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-xl">
            <EyebrowLabel>Quick answers</EyebrowLabel>
            <h2 className="mt-3 text-balance font-display text-h2 leading-[1.08] font-bold tracking-tight text-ink-navy">
              Your question may already be answered
            </h2>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {QUICK_ANSWERS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.q}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-white p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-[3px] hover:border-mist hover:shadow-1"
                  >
                    <span className="badge-ico flex h-11 w-11 items-center justify-center rounded-xl bg-cloud-blue text-voyage-blue">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="flex-1 font-display font-bold text-ink-navy">{item.q}</span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate">
                      Open this answer in the FAQ
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
        heading="Not ready to write yet?"
        subheading="Have a look around first. Pick your side and every page will speak to you."
        cards={[
          { label: "I'm hiring", description: "Post a role and get matched with verified talent.", href: "/signup?role=hirer" },
          { label: "I'm looking for work", description: "Free to join. Get matched with verified hirers.", href: "/signup?role=talent" },
          { label: "See how it works", description: "Three steps, and the protections behind them.", href: "/how-it-works" },
        ]}
      />
    </div>
  );
}
