import { revalidatePath, revalidateTag, refresh } from "next/cache";
import { CACHE_TAGS } from "@/app/lib/cache-tags";

export type RevalidateAfterCartOptions = {
  userId?: string;
  productId?: string | number;
  /**
   * Soft-refresh the current route's Server Components (Next.js `refresh()`).
   * @default true
   */
  refreshRoute?: boolean;
};

/**
 * Invalidate caches and routes after cart mutations.
 * Combines `revalidateTag`, `revalidatePath`, and `refresh()` per Next.js guidance:
 * - tags → shared Data Cache entries (e.g. public catalog)
 * - paths → layout/page RSC payloads
 * - refresh → current route tree without a full navigation
 */
export function revalidateAfterCartChange(
  options: RevalidateAfterCartOptions = {},
): void {
  const { userId, productId, refreshRoute = true } = options;

  revalidateTag(CACHE_TAGS.cart);
  revalidateTag(CACHE_TAGS.products);
  revalidateTag(CACHE_TAGS.catalog);

  if (userId) {
    revalidateTag(CACHE_TAGS.cartUser(userId));
    revalidateTag(CACHE_TAGS.userId(userId));
  }

  if (productId !== undefined && productId !== "") {
    revalidateTag(CACHE_TAGS.product(productId));
  }

  revalidatePath("/cart");
  revalidatePath("/products", "layout");
  revalidatePath("/", "layout");

  if (refreshRoute) {
    refresh();
  }
}

/** Invalidate product catalog caches (e.g. after admin/product webhook). */
export function revalidateProductsCatalog(options?: {
  refreshRoute?: boolean;
}): void {
  revalidateTag(CACHE_TAGS.products);
  revalidateTag(CACHE_TAGS.catalog);

  revalidatePath("/products", "layout");
  revalidatePath("/", "layout");

  if (options?.refreshRoute !== false) {
    refresh();
  }
}

/**
 * Soft-refresh Server Components on the active route.
 * Use from Server Actions when the client already has mutation result
 * but parent RSC (e.g. layout) should re-fetch.
 */
export function refreshShopRoute(): void {
  refresh();
}
