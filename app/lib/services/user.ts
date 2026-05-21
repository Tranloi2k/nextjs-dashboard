"use server";
import { getAuthHeaders } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export const getUser = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return null;
  }

  try {
    const cookieStore = await cookies();
    const id = cookieStore.get("user_id")?.value;
    if (!id) {
      return null;
    }

    const response = await fetch(`${apiUrl}/user/${id}`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      console.error("Failed to fetch user:", response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
