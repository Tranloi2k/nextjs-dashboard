import ShopShell from "@/app/ui/shop/shop-shell";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <ShopShell>{children}</ShopShell>;
}
