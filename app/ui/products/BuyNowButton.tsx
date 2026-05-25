"use client";

import { useRequireAuth } from "@/app/ui/auth/use-require-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface BuyNowButtonProps {
  product: {
    id: string | number;
    name: string;
    price: number;
  };
  quantity?: number;
}

export default function BuyNowButton({
  product,
  quantity = 1,
}: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { requireAuth, isAuthLoading } = useRequireAuth();
  const { data: session } = useSession();

  const handleBuyNow = async () => {
    if (!requireAuth()) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: String(product.id),
          productName: product.name,
          price: product.price,
          quantity,
          customerEmail: session?.user?.email ?? undefined,
        }),
      });

      if (response.status === 401) {
        requireAuth();
        return;
      }

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Failed to create checkout session");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Error initiating checkout:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to start checkout. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const total = product.price * quantity;

  return (
    <button
      type="button"
      onClick={handleBuyNow}
      disabled={isLoading || isAuthLoading}
      className={clsx(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-shop text-sm font-medium tracking-wide transition-all duration-shop ease-shop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shop-text focus-visible:ring-offset-2",
        isLoading
          ? "cursor-not-allowed bg-shop-muted text-white"
          : "bg-shop-text text-white hover:bg-shop-accent-hover",
      )}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Processing...
        </>
      ) : (
        <>
          Buy now — ${total.toFixed(2)}
          <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
        </>
      )}
    </button>
  );
}
