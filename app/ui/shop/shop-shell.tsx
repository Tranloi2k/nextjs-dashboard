import ShopNavbar from "@/app/ui/shop/navbar";
import ShopFooter from "@/app/ui/shop/footer";

export default function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-shop-bg">
      <ShopNavbar />
      <main className="flex-1">{children}</main>
      <ShopFooter />
    </div>
  );
}
