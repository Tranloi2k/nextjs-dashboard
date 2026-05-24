import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/app/lib/cache-tags";

export type RevalidateSource = "action" | "handler";

type RevalidateTagWithProfile = (
  tag: string,
  profile?: "max" | { expire?: number },
) => void;

type NextCacheExtensions = {
  updateTag?: (tag: string) => void;
  refresh?: () => void;
};

const revalidateTagCompat = revalidateTag as RevalidateTagWithProfile;

function getNextCacheExtensions(): NextCacheExtensions {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- runtime feature detect (Next 15 vs 16)
    return require("next/cache") as NextCacheExtensions;
  } catch {
    return {};
  }
}

/** Invalidate a tagged Data Cache entry (Next 15 single-arg / Next 16 profile API). */
function invalidateDataCacheTag(tag: string, source: RevalidateSource): void {
  const { updateTag } = getNextCacheExtensions();

  if (source === "action" && updateTag) {
    updateTag(tag);
    return;
  }

  if (updateTag) {
    revalidateTagCompat(
      tag,
      source === "handler" ? { expire: 0 } : "max",
    );
    return;
  }

  revalidateTag(tag);
}

function softRefreshCurrentRoute(): void {
  const { refresh } = getNextCacheExtensions();
  refresh?.();
}

export type RevalidateAfterCartOptions = {
  userId?: string;
  productId?: string | number;
  /**
   * Soft-refresh the current route's Server Components (`refresh()` when available).
   * @default true
   */
  refreshRoute?: boolean;
  /**
   * `action` — Server Action (`updateTag` on Next 16).
   * `handler` — Route Handler / webhook (`revalidateTag` with immediate expire).
   * @default "action"
   */
  source?: RevalidateSource;
};

/**
 * Invalidate caches and routes after cart mutations.
 */
export function revalidateAfterCartChange(
  options: RevalidateAfterCartOptions = {},
): void {
  const {
    userId,
    productId,
    refreshRoute = true,
    source = "action",
  } = options;

  invalidateDataCacheTag(CACHE_TAGS.cart, source);
  invalidateDataCacheTag(CACHE_TAGS.products, source);
  invalidateDataCacheTag(CACHE_TAGS.catalog, source);

  if (userId) {
    invalidateDataCacheTag(CACHE_TAGS.cartUser(userId), source);
    invalidateDataCacheTag(CACHE_TAGS.userId(userId), source);
  }

  if (productId !== undefined && productId !== "") {
    invalidateDataCacheTag(CACHE_TAGS.product(productId), source);
  }

  revalidatePath("/cart");
  revalidatePath("/products", "layout");
  revalidatePath("/", "layout");

  if (refreshRoute) {
    softRefreshCurrentRoute();
  }
}

/** Invalidate product catalog caches (e.g. after admin/product webhook). */
export function revalidateProductsCatalog(options?: {
  refreshRoute?: boolean;
  source?: RevalidateSource;
}): void {
  const source = options?.source ?? "action";

  invalidateDataCacheTag(CACHE_TAGS.products, source);
  invalidateDataCacheTag(CACHE_TAGS.catalog, source);

  revalidatePath("/products", "layout");
  revalidatePath("/", "layout");

  if (options?.refreshRoute !== false) {
    softRefreshCurrentRoute();
  }
}

/** Soft-refresh Server Components on the active route when supported. */
export function refreshShopRoute(): void {
  softRefreshCurrentRoute();
}
