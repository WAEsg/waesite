import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { buttonPrimary } from "@/components/ui/button-classes";

export function FaqStillStuck() {
  return (
    <div className="bg-frost px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="badge-ico flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-cloud-blue text-voyage-blue">
            <MessageCircle className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-ink-navy">Still stuck?</h2>
            <p className="text-slate">
              Send us your question, or email{" "}
              <a href="mailto:hello@waework.com" className="font-extrabold text-voyage-blue">
                hello@waework.com
              </a>{" "}
              directly.
            </p>
          </div>
        </div>
        <Link href="/contact" className={buttonPrimary}>
          Ask us directly
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
