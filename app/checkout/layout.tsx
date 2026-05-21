import ShopShell from "@/app/ui/shop/shop-shell";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ShopShell>{children}</ShopShell>;
}
