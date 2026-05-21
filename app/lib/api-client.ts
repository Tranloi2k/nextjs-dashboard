import {
  ensureValidAccessToken,
  refreshTokens,
} from "@/app/lib/auth-tokens";
import { cookies } from "next/headers";

export async function getAuthHeaders(
  extra?: Record<string, string>,
): Promise<HeadersInit> {
  await ensureValidAccessToken();

  const cookieStore = await cookies();
  const headers: Record<string, string> = {
    Cookie: cookieStore.toString(),
    ...extra,
  };

  const accessToken = cookieStore.get("access_token")?.value;
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

export async function authFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  await ensureValidAccessToken();

  const extra =
    init?.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries())
      : (init?.headers as Record<string, string> | undefined);

  let response = await fetch(url, {
    ...init,
    headers: await getAuthHeaders(extra),
  });

  if (response.status === 401) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      response = await fetch(url, {
        ...init,
        headers: await getAuthHeaders(extra),
      });
    }
  }

  return response;
}
