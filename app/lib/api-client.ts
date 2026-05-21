import { cookies } from "next/headers";

export async function getAuthHeaders(
  extra?: Record<string, string>,
): Promise<HeadersInit> {
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
