import { auth } from "@/auth";

/** Authenticated API when signed in; otherwise public catalog (SEO-friendly for crawlers). */
export async function getCatalogAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}
