"use client";

import ErrorBoundaryUI from "@/app/ui/error-boundary";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundaryUI
      error={error}
      reset={reset}
      variant="embedded"
      title="Checkout error"
      description="Something went wrong during checkout. No payment was taken if you didn't complete Stripe — return to your cart and try again."
      showProducts={false}
    />
  );
}
