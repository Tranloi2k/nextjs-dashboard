"use client";

import ErrorBoundaryUI from "@/app/ui/error-boundary";

export default function CustomersError({
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
      title="Couldn't load customers"
      description="Customer data failed to load. Check your permissions and try again."
      showProducts={false}
    />
  );
}
