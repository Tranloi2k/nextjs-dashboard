import ShopShell from "@/app/ui/shop/shop-shell";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <ShopShell>{children}</ShopShell>;
}
