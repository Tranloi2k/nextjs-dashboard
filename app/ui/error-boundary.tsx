"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { ShopButton } from "@/app/ui/shop/button";

export type ErrorBoundaryUIProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  /** `embedded` — inside ShopShell main; `full` — standalone page */
  variant?: "embedded" | "full";
  showRetry?: boolean;
  showHome?: boolean;
  showProducts?: boolean;
};

export default function ErrorBoundaryUI({
  error,
  reset,
  title = "Something went wrong",
  description = "We couldn't load this page. Please try again or return to a safe page.",
  variant = "embedded",
  showRetry = true,
  showHome = true,
  showProducts = true,
}: ErrorBoundaryUIProps) {
  useEffect(() => {
    console.error("[Error boundary]", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  const card = (
    <div
      className={clsx(
        "shop-card mx-auto w-full max-w-lg px-6 py-12 text-center sm:px-10",
        variant === "full" && "shadow-shop-hover",
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-shop-surface-muted">
        <ExclamationTriangleIcon
          className="h-7 w-7 text-shop-text"
          aria-hidden
        />
      </div>

      <p className="font-mono-label mt-6 text-shop-muted">Error</p>
      <h1 className="shop-section-title mt-2 text-balance">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-shop-secondary">
        {description}
      </p>

      {error.digest ? (
        <p className="mt-4 font-mono text-xs text-shop-muted">
          Reference: {error.digest}
        </p>
      ) : null}

      {isDev ? (
        <details className="mt-6 w-full text-left">
          <summary className="cursor-pointer text-xs font-medium text-shop-secondary">
            Developer details
          </summary>
          <pre className="mt-2 max-h-40 overflow-auto rounded-shop border border-shop-border-subtle bg-shop-surface-muted p-3 text-left text-xs text-shop-text">
            {error.message}
            {error.stack ? `\n\n${error.stack}` : ""}
          </pre>
        </details>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {showRetry ? (
          <ShopButton type="button" onClick={reset} className="w-full sm:w-auto">
            <ArrowPathIcon className="h-4 w-4" aria-hidden />
            Try again
          </ShopButton>
        ) : null}

        {showProducts ? (
          <Link
            href="/products"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-shop border border-shop-border bg-transparent px-5 text-sm font-medium tracking-wide text-shop-text transition-all duration-shop ease-shop hover:border-shop-text hover:bg-shop-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shop-text focus-visible:ring-offset-2 sm:w-auto"
          >
            <ShoppingBagIcon className="h-4 w-4" aria-hidden />
            Browse products
          </Link>
        ) : null}
      </div>

      {showHome ? (
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-shop-secondary transition-colors hover:text-shop-text"
        >
          <HomeIcon className="h-4 w-4" aria-hidden />
          Back to home
        </Link>
      ) : null}
    </div>
  );

  if (variant === "full") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-shop-bg px-4 py-16">
        {card}
      </div>
    );
  }

  return (
    <div className="shop-content-wrap py-16 md:py-24">{card}</div>
  );
}
