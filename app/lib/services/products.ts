"use server";
import { getAuthHeaders } from "@/app/lib/api-client";
import { isNextNavigationError } from "@/app/lib/utils";
import { unauthorized } from "next/navigation";

const productsPerPage = 8;

export async function getProducts(query: string, page: number = 1) {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    console.error("NEXT_PUBLIC_EXTERNAL_API_URL is not configured");
    return [];
  }

  try {
    const res = await fetch(
      `${apiUrl}/products?` +
        (query ? `search=${query}&` : "") +
        `page=${page}&limit=${productsPerPage}`,
      {
        method: "GET",
        headers: await getAuthHeaders(),
      },
    );

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

  const res = await fetch(`${apiUrl}/products/${id}`, {
    method: "GET",
    headers: await getAuthHeaders(),
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
