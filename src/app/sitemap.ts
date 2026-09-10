import type { MetadataRoute } from "next";
import { allLongTailRoles } from "@/lib/skills-data";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/how-it-works",
    "/for-hirers",
    "/for-talent",
    "/pricing",
    "/ai-workforce",
    "/about",
    "/faq",
    "/contact",
    "/terms",
    "/privacy",
    "/login",
    "/signup",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const roleRoutes = allLongTailRoles.map((role) => ({
    url: `${SITE_URL}/hire/${role.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...roleRoutes];
}
