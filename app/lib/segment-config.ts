/**
 * Reference values for Nova Shop Route Segment Config.
 *
 * Vai trò: quyết định static / ISR / dynamic cho **cả route segment**
 * (Full Route Cache), bổ sung cho `fetch()` (Data Cache) và
 * `revalidateTag` / `revalidatePath` / `refresh()` (invalidate sau mutation).
 *
 * Next.js requires **literal** `export const` in each page/layout/route file
 * (no re-export from this module). Docs: Become-A-Frontend-Developer/NextJS/
 * "5. Data Fetching va Cache.md" — mục 13.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
 */

/** Public home — matches `getProducts(..., { authenticated: false })` fetch TTL */
export const CATALOG_REVALIDATE_SECONDS = 60;

/** Auth / per-user pages — copy into page.tsx as literals */
export const AUTH_DYNAMIC = "force-dynamic" as const;
export const AUTH_FETCH_CACHE = "default-no-store" as const;

/** Stripe Route Handlers */
export const API_RUNTIME = "nodejs" as const;
