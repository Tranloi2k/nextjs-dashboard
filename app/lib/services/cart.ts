"use server";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";

export async function getCart() {
  const cookie = await cookies();
  const res = await fetch(
    `${process.env.EXTERNAL_API_URL}/cart?` +
      `userId=${cookie.get("user_id")?.value}`,
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
  return data.cart;
}

export async function addToCart(
  productId: string,
  quantity: number,
  color: string,
  storage: string
) {
  const cookie = await cookies();
  console.log(productId, quantity, color, storage);
  const res = await fetch(`${process.env.EXTERNAL_API_URL}/cart`, {
    method: "POST",
    headers: {
      Cookie: cookie.toString(),
    },
    body: JSON.stringify({
      productId,
      quantity,
      color,
      storage,
    }),
  });

  console.log("Add to cart response status:", res);

  if (res.status === 401) {
    unauthorized();
  }
}
