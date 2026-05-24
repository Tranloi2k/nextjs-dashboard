import type { MetadataRoute } from "next";
import { DEFAULT_DESCRIPTION, getSiteUrl, SITE_NAME, SITE_TAGLINE } from "@/app/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/hero-shop.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
    scope: getSiteUrl(),
  };
}
