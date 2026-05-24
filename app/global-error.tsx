"use client";

import { inter, outfit } from "@/app/ui/fonts";
import ErrorBoundaryUI from "@/app/ui/error-boundary";

/**
 * Catches errors in the root layout. Must define its own <html> and <body>.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} bg-shop-bg font-sans text-shop-text antialiased`}
      >
        <ErrorBoundaryUI
          error={error}
          reset={reset}
          variant="full"
          title="Application error"
          description="A critical error occurred. Reload the page or return to the store homepage."
          showProducts
        />
      </body>
    </html>
  );
}
