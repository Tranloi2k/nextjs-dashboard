import type { MetadataRoute } from "next";
import { getProducts } from "@/app/lib/services/products";
import { absoluteUrl, getSiteUrl, productPath } from "@/app/lib/seo";

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

  const productRoutes: MetadataRoute.Sitemap = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const result = await getProducts({ page }, { authenticated: false });
    for (const product of result.products) {
      productRoutes.push({
        url: absoluteUrl(productPath(product)),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    hasNext = result.hasNextPage;
    page += 1;
    if (page > 500) break;
  }

  return [...staticRoutes, ...productRoutes];
}
