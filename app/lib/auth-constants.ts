export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";
export const ACCESS_EXPIRES_COOKIE = "access_token_expires_at";
export const USER_ID_COOKIE = "user_id";

export const ACCESS_TOKEN_MAX_AGE = 15 * 60;
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

export function isAccessTokenExpired(
  expiresAt: string | number | undefined,
): boolean {
  if (expiresAt === undefined || expiresAt === "") {
    return true;
  }
  const exp =
    typeof expiresAt === "string" ? parseInt(expiresAt, 10) : expiresAt;
  if (Number.isNaN(exp)) {
    return true;
  }
  return Math.floor(Date.now() / 1000) >= exp;
}
