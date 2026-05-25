import { auth } from "@/auth";
import { USER_ID_COOKIE } from "@/app/lib/auth-constants";
import { ensureValidAccessToken } from "@/app/lib/auth-tokens";
import { cookies } from "next/headers";

export type CheckoutAuth = {
  authorized: boolean;
  customerEmail?: string;
};

/** Matches cart API auth: NextAuth session or valid backend token cookies. */
export async function getCheckoutAuth(): Promise<CheckoutAuth> {
  const session = await auth();
  if (session?.user) {
    return {
      authorized: true,
      customerEmail: session.user.email ?? undefined,
    };
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_ID_COOKIE)?.value;
  const hasToken = await ensureValidAccessToken();

  if (hasToken && userId) {
    return { authorized: true };
  }

  return { authorized: false };
}
