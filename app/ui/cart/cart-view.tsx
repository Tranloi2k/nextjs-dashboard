"use client";

import {
  clearCart,
  removeFromCart,
  updateCartItem,
} from "@/app/lib/services/cart";
import { syncCartBadge } from "@/app/lib/cart-events";
import type { CartItem, CartSummary } from "@/app/lib/definitions";
import { ShopButton } from "@/app/ui/shop/button";
import {
  ArrowRightIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRequireAuth } from "@/app/ui/auth/use-require-auth";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function productHref(item: CartItem) {
  const slugName = item.product.name.replace(/ /g, "-");
  return `/products/${slugName}.${item.product.id}`;
}

function lineTotal(item: CartItem) {
  return Number(item.price) * item.quantity;
}

export default function CartView({
  initialSummary,
}: {
  initialSummary: CartSummary;
}) {
  const [summary, setSummary] = useState(initialSummary);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { requireAuth } = useRequireAuth();

  useEffect(() => {
    syncCartBadge(initialSummary.cart?.quantity ?? 0);
  }, [initialSummary]);

  const items = summary.cart?.items ?? [];
  const isEmpty = items.length === 0;

  const applySummary = (next: CartSummary) => {
    setSummary(next);
    syncCartBadge(next.cart?.quantity ?? 0);
  };

  const handleQuantityChange = (item: CartItem, nextQuantity: number) => {
    if (nextQuantity < 1) return;
    setError(null);

    startTransition(async () => {
      try {
        const next = await updateCartItem(item.id, nextQuantity);
        applySummary(next);
      } catch {
        setError("Could not update quantity. Please try again.");
      }
    });
  };

  const handleRemove = (cartItemId: number) => {
    setError(null);

    startTransition(async () => {
      try {
        const next = await removeFromCart(cartItemId);
        applySummary(next);
      } catch {
        setError("Could not remove item. Please try again.");
      }
    });
  };

  const handleClear = () => {
    if (!confirm("Remove all items from your bag?")) return;
    setError(null);

    startTransition(async () => {
      try {
        const next = await clearCart();
        applySummary(next);
      } catch {
        setError("Could not clear cart. Please try again.");
      }
    });
  };

  const handleCheckout = async () => {
    if (isEmpty) return;
    if (!requireAuth()) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout/cart", {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 401) {
        setIsCheckingOut(false);
        requireAuth();
        return;
      }

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not start checkout. Please try again.",
      );
      setIsCheckingOut(false);
    }
  };

  if (isEmpty) {
    return (
      <div className="shop-card flex flex-col items-center px-6 py-16 text-center">
        <ShoppingBagIcon
          className="h-12 w-12 text-shop-muted"
          strokeWidth={1}
        />
        <p className="mt-4 text-sm text-shop-secondary">
          Your bag is empty. Browse our catalog and add something you love.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-shop bg-shop-accent px-7 text-sm font-medium text-white transition-colors hover:bg-shop-accent-hover"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-10">
      <div className="lg:col-span-2">
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className={clsx(
                "shop-card flex gap-4 p-4 sm:gap-6 sm:p-6",
                isPending && "pointer-events-none opacity-60",
              )}
            >
              <Link
                href={productHref(item)}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-shop bg-shop-surface-muted sm:h-28 sm:w-28"
              >
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={productHref(item)}
                      className="text-sm font-medium text-shop-text hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-shop-secondary">
                      {formatPrice(Number(item.price))} each
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="rounded-shop p-2 text-shop-muted transition-colors hover:bg-shop-surface-muted hover:text-shop-error"
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <TrashIcon className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center overflow-hidden rounded-shop border border-shop-border">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center text-shop-secondary transition-colors hover:bg-shop-surface-muted disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="flex h-9 min-w-[2.5rem] items-center justify-center border-x border-shop-border text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                      className="flex h-9 w-9 items-center justify-center text-shop-secondary transition-colors hover:bg-shop-surface-muted"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-medium text-shop-text">
                    {formatPrice(lineTotal(item))}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleClear}
          disabled={isPending}
          className="mt-6 text-sm font-medium text-shop-error transition-opacity hover:underline disabled:opacity-50"
        >
          Clear bag
        </button>
      </div>

      <aside className="mt-10 lg:mt-0">
        <div className="shop-card sticky top-24 p-6">
          <h2 className="font-mono-label text-shop-muted">Order summary</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-shop-secondary">
              <dt>Subtotal</dt>
              <dd>{formatPrice(summary.totalPrice)}</dd>
            </div>
            {summary.totalDiscount > 0 && (
              <div className="flex justify-between text-shop-secondary">
                <dt>Discount</dt>
                <dd className="text-shop-error">
                  −{formatPrice(summary.totalDiscount)}
                </dd>
              </div>
            )}
            <div className="shop-divider flex justify-between pt-3 text-base font-medium text-shop-text">
              <dt>Total</dt>
              <dd>{formatPrice(summary.finalPrice)}</dd>
            </div>
          </dl>

          {error && (
            <p className="mt-4 text-sm text-shop-error" role="alert">
              {error}
            </p>
          )}

          <ShopButton
            type="button"
            size="lg"
            className="mt-6 w-full"
            disabled={isCheckingOut || isPending}
            onClick={handleCheckout}
          >
            {isCheckingOut ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing...
              </>
            ) : (
              <>
                Checkout
                <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
              </>
            )}
          </ShopButton>

          <p className="mt-4 text-center text-xs text-shop-muted">
            Secure Stripe checkout
          </p>
        </div>
      </aside>
    </div>
  );
}
