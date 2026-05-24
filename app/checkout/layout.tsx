import ShopShell from "@/app/ui/shop/shop-shell";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/lib/seo";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

export const metadata: Metadata = buildPageMetadata({
  title: "Checkout",
  description: "Complete your NOVA purchase securely.",
  pathname: "/checkout",
  noIndex: true,
});

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ShopShell>{children}</ShopShell>;
}
