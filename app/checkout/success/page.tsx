import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { retrieveCheckoutSession } from "@/app/lib/checkout-sessions";
import { ShopButton } from "@/app/ui/shop/button";

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  let session = null;

  if (sessionId) {
    try {
      session = await retrieveCheckoutSession(sessionId);
    } catch (error) {
      console.error("Error retrieving session:", error);
    }
  }

  return (
    <div className="shop-content-wrap flex min-h-[60vh] items-center justify-center py-16 md:py-24">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircleIcon
            className="h-8 w-8 text-shop-success"
            strokeWidth={1.5}
          />
        </div>

        <h1 className="font-display mt-6 text-display-md font-medium tracking-tight text-shop-text">
          Payment successful
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-shop-secondary">
          Thank you for your purchase. Your order has been confirmed and will be
          processed shortly.
        </p>

        {session && (
          <div className="shop-card mt-8 p-5 text-left">
            <h3 className="font-mono-label text-shop-muted">Order details</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-shop-secondary">Session</dt>
                <dd className="truncate font-medium text-shop-text">
                  {session.id.slice(0, 20)}…
                </dd>
              </div>
              {session.customer_email && (
                <div className="flex justify-between gap-4">
                  <dt className="text-shop-secondary">Email</dt>
                  <dd className="font-medium text-shop-text">
                    {session.customer_email}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-shop-secondary">Amount</dt>
                <dd className="font-medium text-shop-text">
                  ${(session.amount_total! / 100).toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
        )}

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
      </div>
    </div>
  );
}
