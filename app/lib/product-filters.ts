export const PRODUCT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "smartphones", label: "Smartphones" },
  { id: "tablets", label: "Tablets" },
  { id: "wearables", label: "Wearables" },
] as const;

export const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Rating" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["id"];
export type ProductSort = (typeof SORT_OPTIONS)[number]["value"];
export type ProductView = "grid" | "list";

export type ProductFilterParams = {
  query?: string;
  category?: string;
  sort?: string;
  view?: string;
  page?: string;
  minPrice?: string;
  maxPrice?: string;
  onSale?: string;
};

export function parseProductFilters(params: ProductFilterParams) {
  const category =
    params.category &&
    PRODUCT_CATEGORIES.some((c) => c.id === params.category && c.id !== "all")
      ? params.category
      : undefined;

  const sort = SORT_OPTIONS.some((o) => o.value === params.sort)
    ? params.sort
    : "popular";

  const view: ProductView = params.view === "list" ? "list" : "grid";
  const page = Math.max(1, Number(params.page) || 1);
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const onSale = params.onSale === "true";

  return {
    query: params.query?.trim() || "",
    category,
    sort: sort as ProductSort,
    view,
    page,
    minPrice: minPrice !== undefined && !Number.isNaN(minPrice) ? minPrice : undefined,
    maxPrice: maxPrice !== undefined && !Number.isNaN(maxPrice) ? maxPrice : undefined,
    onSale,
  };
}

export function buildProductsSearchParams(
  current: URLSearchParams,
  updates: Record<string, string | number | boolean | null | undefined>,
) {
  const next = new URLSearchParams(current.toString());

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === "") {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
  }

  return next;
}

export function productsHref(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== false) {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function categoryNavHref(category: string) {
  if (!category || category === "all") return "/products";
  return productsHref({ category });
}

export function isCategoryActive(
  activeCategory: string | undefined,
  linkCategory: string,
) {
  const current = activeCategory || "";
  if (linkCategory === "all" || linkCategory === "") {
    return current === "";
  }
  return current === linkCategory;
}
