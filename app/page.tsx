import {
  CategoryTiles,
  StorefrontCta,
  StorefrontHero,
  FeaturedProducts,
} from "@/app/ui/shop/storefront-hero";
import ShopShell from "@/app/ui/shop/shop-shell";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/lib/seo";
import { websiteJsonLd } from "@/app/lib/seo-structured-data";
import JsonLd from "@/app/ui/seo/json-ld";

/** Public landing — FeaturedProducts ISR (see app/lib/segment-config.ts) */
export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Home",
  description:
    "Shop premium smartphones, tablets, and wearables. Secure checkout and fast delivery.",
  pathname: "/",
});

export default function HomePage() {
  return (
    <ShopShell>
      <JsonLd data={websiteJsonLd()} />
      <StorefrontHero />
      <CategoryTiles />
      <FeaturedProducts />
      <StorefrontCta />
    </ShopShell>
  );
}
