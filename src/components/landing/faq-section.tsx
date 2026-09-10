import { faqItems } from "@/lib/landing-data";
import { glassCard } from "@/components/ui/glass";

export function FaqSection() {
  return (
    <div className={`mx-auto max-w-3xl divide-y divide-white/10 ${glassCard}`}>
      {faqItems.map((item) => (
        <details key={item.question} className="group p-5 sm:p-6">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-frost">
            {item.question}
            <span
              aria-hidden="true"
              className="shrink-0 text-passport-sky transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 text-sm text-mist">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
