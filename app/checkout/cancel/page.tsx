import Link from "next/link";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { ShopButton } from "@/app/ui/shop/button";
export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

export default function CheckoutCancel() {
  return (
    <div className="shop-content-wrap flex min-h-[60vh] items-center justify-center py-16 md:py-24">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <XCircleIcon className="h-8 w-8 text-shop-error" strokeWidth={1.5} />
        </div>

        <h1 className="font-display mt-6 text-display-md font-medium tracking-tight text-shop-text">
          Payment cancelled
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-shop-secondary">
          Your payment was cancelled. No charges were made to your account.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link href="/products">
            <ShopButton variant="primary" size="lg" className="w-full">
              Continue shopping
            </ShopButton>
          </Link>
          <Link href="/">
            <ShopButton variant="outline" size="lg" className="w-full">
              Back to home
            </ShopButton>
          </Link>
        </div>

        <p className="mt-8 text-xs text-shop-muted">
          Need help?{" "}
          <a
            href="#"
            className="font-medium text-shop-text underline-offset-4 hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
