"use server";
import { authFetch } from "@/app/lib/api-client";
import { CACHE_TAGS } from "@/app/lib/cache-tags";
import type { ProductListItem } from "@/app/lib/definitions";
import { isNextNavigationError } from "@/app/lib/utils";
import { unauthorized } from "next/navigation";

const productsPerPage = 8;

export type ProductsQuery = {
  query?: string;
  page?: number;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
};

export type ProductsPageResult = {
  products: ProductListItem[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const EMPTY_RESULT: ProductsPageResult = {
  products: [],
  total: 0,
  page: 1,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
};

export async function getProducts(
  filters: ProductsQuery = {},
  options?: { authenticated?: boolean },
): Promise<ProductsPageResult> {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    console.error("NEXT_PUBLIC_EXTERNAL_API_URL is not configured");
    return EMPTY_RESULT;
  }

  const {
    query = "",
    page = 1,
    category,
    sort = "popular",
    minPrice,
    maxPrice,
    onSale,
  } = filters;

  const params = new URLSearchParams();
  if (query) params.set("search", query);
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);
  if (minPrice !== undefined) params.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));
  if (onSale) params.set("onSale", "true");
  params.set("page", String(page));
  params.set("limit", String(productsPerPage));

  const url = `${apiUrl}/products?${params.toString()}`;
  const authenticated = options?.authenticated ?? true;

  const productTags = [CACHE_TAGS.products, CACHE_TAGS.catalog];

  try {
    const res = authenticated
      ? await authFetch(url, {
          method: "GET",
          cache: "no-store",
          next: { tags: productTags },
        })
      : await fetch(url, {
          method: "GET",
          next: {
            tags: productTags,
            revalidate: 60,
          },
        });

    if (res.status === 401) {
      unauthorized();
    }

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status);
      return EMPTY_RESULT;
    }

    const data = await res.json();
    return {
      products: data.products ?? [],
      total: data.total ?? 0,
      page: data.page ?? page,
      totalPages: data.totalPages ?? 0,
      hasNextPage: data.hasNextPage ?? false,
      hasPrevPage: data.hasPrevPage ?? false,
    };
  } catch (error) {
    if (isNextNavigationError(error)) {
      throw error;
    }
    console.error("Error fetching products:", error);
    return EMPTY_RESULT;
  }
}

/** @deprecated Use getProducts() which returns pagination metadata */
export async function getProductsList(
  query: string,
  page: number = 1,
  options?: { authenticated?: boolean },
) {
  const result = await getProducts({ query, page }, options);
  return result.products;
}

export async function getProductById(
  id: string,
  options?: { authenticated?: boolean },
) {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_EXTERNAL_API_URL is not configured");
  }

  const authenticated = options?.authenticated ?? true;
  const url = `${apiUrl}/products/${id}`;
  const tags = [CACHE_TAGS.products, CACHE_TAGS.product(id)];

  const res = authenticated
    ? await authFetch(url, {
        method: "GET",
        cache: "no-store",
        next: { tags },
      })
    : await fetch(url, {
        method: "GET",
        next: { tags, revalidate: 60 },
      });

  if (res.status === 401) {
    unauthorized();
  }

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await res.json();
  return data;
}
