"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Redirects guests to `/login?callbackUrl=…` before purchase actions.
 * Returns true when the user may continue.
 */
export function useRequireAuth() {
  const { status } = useSession();
  const router = useRouter();

  const requireAuth = useCallback((): boolean => {
    if (status === "authenticated") {
      return true;
    }

    if (status === "loading") {
      return false;
    }

    const returnTo =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : "/products";

    router.push(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);
    return false;
  }, [status, router]);

  return {
    requireAuth,
    isAuthenticated: status === "authenticated",
    isAuthLoading: status === "loading",
  };
}
