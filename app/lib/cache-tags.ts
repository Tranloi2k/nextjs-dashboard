/**
 * Cache tags for Next.js Data Cache (`fetch` + `revalidateTag`).
 * @see https://nextjs.org/docs/app/guides/caching#revalidating
 */
export const CACHE_TAGS = {
  /** Product list / catalog (home featured, /products) */
  products: "products",
  catalog: "catalog",
  product: (id: string | number) => `product-${id}`,
  /** Cart summary (all users — use with user-specific tag when possible) */
  cart: "cart",
  cartUser: (userId: string | number) => `cart-user-${userId}`,
  user: "user",
  userId: (id: string | number) => `user-${id}`,
} as const;
