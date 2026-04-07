import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const staticRoutes = [
  "",
  "/cars",
  "/articles",
  "/reviews",
  "/contact",
  "/order",
  "/credit-calculator",
  "/search",
];

const carSlugs = [
  "all-new-ertiga",
  "apv",
  "e-vitara",
  "espresso",
  "fronx",
  "grand-vitara",
  "jimny",
  "new-carry-pick-up",
  "new-xl7",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  const carEntries: MetadataRoute.Sitemap = carSlugs.map((slug) => ({
    url: `${siteUrl}/cars/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...carEntries];
}
