"use client";

import ErrorBoundaryUI from "@/app/ui/error-boundary";

export default function CartError({
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
      title="Couldn't load your cart"
      description="We couldn't retrieve your cart. Sign in again if needed, or try reloading."
      showProducts
    />
  );
}
