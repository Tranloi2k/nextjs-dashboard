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
