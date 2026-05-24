"use server";

import { signIn } from "@/auth";
import { refreshShopRoute } from "@/app/lib/revalidate-shop";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: formData.get("redirectTo")?.toString() ?? "/products",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

// Google Login function
export async function googleLogin(userData: { idToken: string }) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_EXTERNAL_API_URL}/google`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      },
    );

    if (!response.ok) {
      throw new Error(`Google login failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
}

/**
 * Soft-refresh Server Components on the current route (`refresh()` from `next/cache`).
 * Callable from Client Components after operations that don't return full RSC payload.
 */
export async function refreshShopData() {
  refreshShopRoute();
}
