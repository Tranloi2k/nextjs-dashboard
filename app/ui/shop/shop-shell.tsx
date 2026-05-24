import ShopNavbar from "@/app/ui/shop/navbar";
import ShopFooter from "@/app/ui/shop/footer";
import { Suspense } from "react";

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-shop-bg">
      <div className="shop-content-wrap flex h-16 items-center lg:h-[4.5rem]" />
    </header>
  );
}

export default function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-shop-bg">
      <Suspense fallback={<NavbarFallback />}>
        <ShopNavbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <ShopFooter />
    </div>
  );
}
