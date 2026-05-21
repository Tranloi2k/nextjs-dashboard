import {
  ACCESS_EXPIRES_COOKIE,
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  isAccessTokenExpired,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  USER_ID_COOKIE,
} from "@/app/lib/auth-constants";
import { cookies } from "next/headers";

export {
  ACCESS_EXPIRES_COOKIE,
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  isAccessTokenExpired,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  USER_ID_COOKIE,
} from "@/app/lib/auth-constants";

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  userId?: string | number;
};

export async function setAuthCookies(tokens: TokenPair) {
  const cookieStore = await cookies();
  const expiresAt = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_MAX_AGE;
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set({
    name: ACCESS_TOKEN_COOKIE,
    value: tokens.accessToken,
    httpOnly: true,
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
    secure: isProd,
    sameSite: "lax",
  });

  cookieStore.set({
    name: REFRESH_TOKEN_COOKIE,
    value: tokens.refreshToken,
    httpOnly: true,
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE,
    secure: isProd,
    sameSite: "lax",
  });

  cookieStore.set({
    name: ACCESS_EXPIRES_COOKIE,
    value: expiresAt.toString(),
    httpOnly: true,
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
    secure: isProd,
    sameSite: "lax",
  });

  if (tokens.userId !== undefined) {
    cookieStore.set({
      name: USER_ID_COOKIE,
      value: String(tokens.userId),
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  const cookieNames = [
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    ACCESS_EXPIRES_COOKIE,
    USER_ID_COOKIE,
  ];

  for (const name of cookieNames) {
    cookieStore.set({
      name,
      value: "",
      path: "/",
      maxAge: 0,
      httpOnly: name !== USER_ID_COOKIE,
    });
  }
}

export async function refreshTokens(): Promise<boolean> {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return false;
  }

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    return false;
  }

  try {
    const res = await fetch(`${apiUrl}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return false;
    }

    const data = (await res.json()) as TokenPair;
    await setAuthCookies({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userId: data.userId,
    });
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
}

/** Refresh via /token when access token is missing or expired. */
export async function ensureValidAccessToken(): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const expiresAt = cookieStore.get(ACCESS_EXPIRES_COOKIE)?.value;

  if (accessToken && !isAccessTokenExpired(expiresAt)) {
    return true;
  }

  return refreshTokens();
}
