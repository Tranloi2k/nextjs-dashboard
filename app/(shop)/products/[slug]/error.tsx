"use client";

import ErrorBoundaryUI from "@/app/ui/error-boundary";

export default function ProductDetailError({
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
      title="Couldn't load this product"
      description="We couldn't fetch product details. The item may have been removed or the link is invalid."
      showProducts
    />
  );
}
