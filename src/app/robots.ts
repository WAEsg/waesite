import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://waework.co";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/onboarding", "/demo"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
