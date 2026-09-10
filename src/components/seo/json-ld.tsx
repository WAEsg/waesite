import { faqItems } from "@/lib/landing-data";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WaeWork",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description:
      "WaeWork is a global marketplace connecting hirers with identity-verified remote talent worldwide, with payment protection built into every engagement.",
    parentOrganization: {
      "@type": "Organization",
      name: "WAE (We Are Everywhere)",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
