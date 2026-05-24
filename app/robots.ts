import type { MetadataRoute } from "next";
import { getSiteUrl, NOINDEX_PATH_PREFIXES } from "@/app/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    ...NOINDEX_PATH_PREFIXES,
    "/_next/",
  ];

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
