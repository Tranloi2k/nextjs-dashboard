"use client";

import ErrorBoundaryUI from "@/app/ui/error-boundary";

export default function LoginError({
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
      variant="full"
      title="Sign-in error"
      description="We couldn't load the sign-in page. Please try again or return to the store."
      showProducts={false}
    />
  );
}
