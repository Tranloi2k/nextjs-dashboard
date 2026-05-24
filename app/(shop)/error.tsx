"use client";

import ErrorBoundaryUI from "@/app/ui/error-boundary";

export default function ShopError({
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
      title="Shop unavailable"
      description="We hit a problem loading this section. Your cart and account are safe — try refreshing the page."
    />
  );
}
