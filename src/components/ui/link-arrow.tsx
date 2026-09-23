import Link from "next/link";
import { ArrowRight } from "lucide-react";

// The prototype's `.link-arrow` — a bold inline link with an arrow that
// nudges right on hover. Used constantly across the site ("See all N
// roles", "Post a role", "Read all FAQs", "See fees for…"). `quiet` is
// `.hw-after__quiet` — same shape, slate instead of voyage-blue.
export function LinkArrow({
  href,
  children,
  quiet = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  quiet?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-11 items-center gap-2 font-extrabold ${quiet ? "text-slate" : "text-voyage-blue"} ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[5px]" aria-hidden />
    </Link>
  );
}
