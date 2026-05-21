"use server";
import { getAuthHeaders } from "@/app/lib/api-client";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";

export async function getCart() {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return null;
  }

  const cookie = await cookies();
  const res = await fetch(
    `${apiUrl}/cart?` + `userId=${cookie.get("user_id")?.value}`,
    {
      method: "GET",
      headers: await getAuthHeaders(),
    },
  );

  if (res.status === 401) {
    unauthorized();
  }

  if (!res.ok) {
    console.error("Failed to fetch cart:", res.status);
    return null;
  }

  const data = await res.json();
  return data.cart;
}

export async function addToCart(
  productId: string,
  quantity: number,
  color: string,
  storage: string,
) {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_EXTERNAL_API_URL is not configured");
  }

  const res = await fetch(`${apiUrl}/cart`, {
    method: "POST",
    headers: await getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      productId,
      quantity,
      color,
      storage,
    }),
  });

  if (res.status === 401) {
    unauthorized();
  }

  if (!res.ok) {
    throw new Error("Failed to add to cart");
  }
}
