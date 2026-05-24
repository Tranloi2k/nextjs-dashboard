"use server";
import { authFetch } from "@/app/lib/api-client";
import { CACHE_TAGS } from "@/app/lib/cache-tags";
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

    const response = await authFetch(`${apiUrl}/user/${id}`, {
      method: "GET",
      cache: "no-store",
      next: {
        tags: [CACHE_TAGS.user, CACHE_TAGS.userId(id)],
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch user:", response);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
