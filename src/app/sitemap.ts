import type { MetadataRoute } from "next";
import { allLongTailRoles } from "@/lib/skills-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://waework.co";

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
