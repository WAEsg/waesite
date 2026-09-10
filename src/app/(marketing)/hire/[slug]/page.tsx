import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allLongTailRoles,
  getClusterBySlug,
  getRoleBySlug,
} from "@/lib/skills-data";
import { buttonPrimaryDark, buttonSecondaryDark, glassCard } from "@/components/ui/glass";

export function generateStaticParams() {
  return allLongTailRoles.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = getRoleBySlug(slug);
  if (!role) return {};

  return {
    title: role.metaTitle,
    description: role.metaDescription,
  };
}

export default async function HireRolePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const role = getRoleBySlug(slug);
  if (!role) notFound();

  const cluster = getClusterBySlug(role.clusterSlug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {cluster && (
        <p className="text-sm font-semibold text-passport-sky">
          <Link href={`/for-talent#${cluster.slug}`} className="hover:underline">
            {cluster.label}
          </Link>
        </p>
      )}

      <h1 className="mt-2 font-display text-3xl font-bold text-frost sm:text-4xl">
        Hire a {role.title}
      </h1>
      <p className="mt-4 text-lg text-mist">{role.intro}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/signup?role=hirer" className={buttonPrimaryDark}>
          Post this role
        </Link>
        <Link href="/for-hirers" className={buttonSecondaryDark}>
          See how hiring works
        </Link>
      </div>

      <div className={`mt-10 p-6 sm:p-8 ${glassCard}`}>
        <h2 className="font-display text-xl font-semibold text-frost">
          What a {role.title.toLowerCase()} typically handles
        </h2>
        <ul className="mt-4 space-y-2">
          {role.commonTasks.map((task) => (
            <li key={task} className="flex items-start gap-2 text-mist">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-passport-sky" />
              {task}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold text-frost">
          Identity-verified, payment-protected
        </h2>
        <p className="mt-2 text-mist">
          Every {role.title.toLowerCase()} on WaeWork completes identity
          verification through Stripe Identity before they can apply. Funds
          are held via Stripe Connect and released on a schedule matched to
          how the engagement works, so you&apos;re never paying upfront for
          work that hasn&apos;t happened.
        </p>
      </div>
    </div>
  );
}
