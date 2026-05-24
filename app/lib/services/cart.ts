"use server";

import { authFetch } from "@/app/lib/api-client";
import { CACHE_TAGS } from "@/app/lib/cache-tags";
import type { CartSummary } from "@/app/lib/definitions";
import { revalidateAfterCartChange } from "@/app/lib/revalidate-shop";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";

const EMPTY_CART: CartSummary = {
  cart: null,
  totalItems: 0,
  totalPrice: 0,
  totalDiscount: 0,
  finalPrice: 0,
};

async function revalidateCartCaches(options?: { productId?: string | number }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  revalidateAfterCartChange({
    userId,
    productId: options?.productId,
    refreshRoute: true,
  });
}

async function getApiUrl(): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_EXTERNAL_API_URL is not configured");
  }
  return apiUrl;
}

async function fetchCartResponse(): Promise<Response> {
  const apiUrl = await getApiUrl();
  const cookie = await cookies();
  const userId = cookie.get("user_id")?.value ?? "";

  const tags: string[] = [CACHE_TAGS.cart];
  if (userId) {
    tags.push(CACHE_TAGS.cartUser(userId));
  }

  return authFetch(`${apiUrl}/cart?userId=${userId}`, {
    method: "GET",
    cache: "no-store",
    next: { tags },
  });
}

export async function getCartSummary(): Promise<CartSummary> {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return EMPTY_CART;
  }

  const res = await fetchCartResponse();

  if (res.status === 401) {
    unauthorized();
  }

  if (res.status === 404) {
    return EMPTY_CART;
  }

  if (!res.ok) {
    console.error("Failed to fetch cart:", res.status);
    return EMPTY_CART;
  }

  return res.json();
}

/** @deprecated Prefer getCartSummary — kept for navbar badge */
export async function getCart() {
  const summary = await getCartSummary();
  return summary.cart;
}

export async function addToCart(
  productId: string,
  quantity: number,
  options?: { color?: string; storage?: string },
): Promise<CartSummary> {
  const apiUrl = await getApiUrl();

  const res = await authFetch(`${apiUrl}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: Number(productId),
      quantity,
      ...(options?.color ? { color: options.color } : {}),
      ...(options?.storage ? { storage: options.storage } : {}),
    }),
  });

  if (res.status === 401) {
    unauthorized();
  }

  if (!res.ok) {
    throw new Error("Failed to add to cart");
  }

  const data: CartSummary = await res.json();
  await revalidateCartCaches({ productId });
  return data;
}

export async function updateCartItem(
  cartItemId: number,
  quantity: number,
): Promise<CartSummary> {
  const apiUrl = await getApiUrl();

  const res = await authFetch(`${apiUrl}/cart/items/${cartItemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  if (res.status === 401) {
    unauthorized();
  }

  if (!res.ok) {
    throw new Error("Failed to update cart item");
  }

  const data: CartSummary = await res.json();
  await revalidateCartCaches();
  return data;
}

export async function removeFromCart(
  cartItemId: number,
): Promise<CartSummary> {
  const apiUrl = await getApiUrl();

  const res = await authFetch(`${apiUrl}/cart/items/${cartItemId}`, {
    method: "DELETE",
  });

  if (res.status === 401) {
    unauthorized();
  }

  if (!res.ok) {
    throw new Error("Failed to remove cart item");
  }

  const data: CartSummary = await res.json();
  await revalidateCartCaches();
  return data;
}

export async function clearCart(): Promise<CartSummary> {
  const apiUrl = await getApiUrl();

  const res = await authFetch(`${apiUrl}/cart/clear`, {
    method: "DELETE",
  });

  if (res.status === 401) {
    unauthorized();
  }

  if (!res.ok) {
    throw new Error("Failed to clear cart");
  }

  await revalidateCartCaches();
  return EMPTY_CART;
}
