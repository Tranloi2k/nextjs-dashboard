"use server";
import { authFetch } from "@/app/lib/api-client";
import { isNextNavigationError } from "@/app/lib/utils";
import { unauthorized } from "next/navigation";

const productsPerPage = 8;

export async function getProducts(
  query: string,
  page: number = 1,
  options?: { authenticated?: boolean },
) {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    console.error("NEXT_PUBLIC_EXTERNAL_API_URL is not configured");
    return [];
  }

  const authenticated = options?.authenticated ?? true;
  const url =
    `${apiUrl}/products?` +
    (query ? `search=${query}&` : "") +
    `page=${page}&limit=${productsPerPage}`;

  try {
    const res = authenticated
      ? await authFetch(url, { method: "GET" })
      : await fetch(url, {
          method: "GET",
          next: { revalidate: 60 },
        });

    if (res.status === 401) {
      unauthorized();
    }

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status);
      return [];
    }

    const data = await res.json();
    return data.products ?? [];
  } catch (error) {
    if (isNextNavigationError(error)) {
      throw error;
    }
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_EXTERNAL_API_URL is not configured");
  }

  const res = await authFetch(`${apiUrl}/products/${id}`, {
    method: "GET",
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
