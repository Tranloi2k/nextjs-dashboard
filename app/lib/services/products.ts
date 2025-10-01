"use server";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";

const productsPerPage = 8;

export async function getProducts(query: string, page: number = 1) {
  const cookie = await cookies();
  const res = await fetch(
    `${process.env.EXTERNAL_API_URL}/products?` +
      (query ? `search=${query}&` : "") +
      `page=${page}&limit=${productsPerPage}`,
    {
      method: "GET",
      headers: {
        Cookie: cookie.toString(),
      },
    }
  );
  if (res.status === 401) {
    unauthorized();
  }
  const data = await res.json();
  return data.products;
}

export async function getProductById(id: string) {
  const cookie = await cookies();
  const res = await fetch(`${process.env.EXTERNAL_API_URL}/products/${id}`, {
    method: "GET",
    headers: {
      Cookie: cookie.toString(),
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  const data = await res.json();
  return data;
}
