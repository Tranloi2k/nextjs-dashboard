"use client";

import ErrorBoundaryUI from "@/app/ui/error-boundary";

export default function ProductsError({
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
      title="Couldn't load products"
      description="The catalog failed to load. This may be a temporary connection issue with our servers."
      showProducts={false}
    />
  );
}
