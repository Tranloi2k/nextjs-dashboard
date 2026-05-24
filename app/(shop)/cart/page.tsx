import { getCartSummary } from "@/app/lib/services/cart";
import CartView from "@/app/ui/cart/cart-view";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { buildPageMetadata } from "@/app/lib/seo";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

export const metadata: Metadata = buildPageMetadata({
  title: "Your bag",
  description: "Review items in your shopping bag.",
  pathname: "/cart",
  noIndex: true,
});

export default async function CartPage() {
  const summary = await getCartSummary();

  return (
    <div className="shop-content-wrap py-8 md:py-12">
      <nav className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-shop-secondary transition-colors hover:text-shop-text"
        >
          <ChevronLeftIcon className="h-4 w-4" strokeWidth={1.5} />
          Continue shopping
        </Link>
      </nav>

      <div className="mb-8 md:mb-10">
        <p className="font-mono-label text-shop-muted">Cart</p>
        <h1 className="shop-section-title mt-2">Your bag</h1>
        <p className="mt-2 text-sm text-shop-secondary">
          {summary.totalItems > 0
            ? `${summary.totalItems} item${summary.totalItems === 1 ? "" : "s"}`
            : "Your bag is empty"}
        </p>
      </div>

      <CartView
        key={`${summary.cart?.id ?? "empty"}-${summary.totalItems}-${summary.finalPrice}`}
        initialSummary={summary}
      />
    </div>
  );
}
