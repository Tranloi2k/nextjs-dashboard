export const CART_UPDATED_EVENT = "cart-updated";

export function syncCartBadge(count: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cartItemsCount", count.toString());
  window.dispatchEvent(
    new CustomEvent(CART_UPDATED_EVENT, { detail: { count } }),
  );
}
