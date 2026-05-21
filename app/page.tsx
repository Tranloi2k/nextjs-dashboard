import {
  CategoryTiles,
  StorefrontCta,
  StorefrontHero,
  FeaturedProducts,
} from "@/app/ui/shop/storefront-hero";
import ShopShell from "@/app/ui/shop/shop-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Premium ecommerce — smartphones, tablets, wearables. Secure checkout and fast delivery.",
};

export default function HomePage() {
  return (
    <ShopShell>
      <StorefrontHero />
      <CategoryTiles />
      <FeaturedProducts />
      <StorefrontCta />
    </ShopShell>
  );
}
