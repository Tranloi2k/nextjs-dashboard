import type { MetadataRoute } from "next";
import { getAllProductSlugParams } from "@/app/lib/services/products";
import { absoluteUrl, getSiteUrl } from "@/app/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/products"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const slugParams = await getAllProductSlugParams();
  const productRoutes: MetadataRoute.Sitemap = slugParams.map(({ slug }) => ({
    url: absoluteUrl(`/products/${slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
