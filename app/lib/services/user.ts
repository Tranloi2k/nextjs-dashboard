"use server";
import { cookies } from "next/headers";

export const getUser = async () => {
  try {
    const cookieStore = await cookies();
    const id = cookieStore.get("user_id")?.value;
    const response = await fetch(`${process.env.EXTERNAL_API_URL}/user/${id}`, {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    if (!response.ok) {
      console.error("Failed to fetch user");
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
