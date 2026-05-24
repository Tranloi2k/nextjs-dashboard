import type { Metadata } from "next";
import type { ProductListItem } from "@/app/lib/definitions";

export const SITE_NAME = "NOVA";
export const SITE_TAGLINE = "Premium Tech Store";
export const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const DEFAULT_DESCRIPTION =
  "Discover premium smartphones, tablets, and wearables. Secure checkout and fast delivery.";

const DEFAULT_OG_IMAGE_PATH = "/hero-shop.jpg";

const SITE_URL_ENV_KEYS = [
  "NEXT_PUBLIC_APP_URL",
  "NEXTAUTH_URL",
] as const;

function originFromEnvValue(raw: string | undefined): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

function originFromVercel(): string | undefined {
  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionUrl) {
    const normalized = productionUrl.startsWith("http")
      ? productionUrl
      : `https://${productionUrl}`;
    const origin = originFromEnvValue(normalized);
    if (origin) return origin;
  }

  const host = process.env.VERCEL_URL?.trim();
  if (!host) return undefined;
  return originFromEnvValue(`https://${host}`);
}

/** `next build` / GitHub Actions often run without a public URL env yet. */
function isBuildWithoutPublicUrl(): boolean {
  return (
    process.env.CI === "true" ||
    process.env.NEXT_PHASE === "phase-production-build"
  );
}

function originForDevelopment(): string {
  const port = process.env.PORT?.trim() || "3000";
  return `http://127.0.0.1:${port}`;
}

/**
 * Canonical site origin.
 * Production runtime: set `NEXT_PUBLIC_APP_URL` (or deploy on Vercel for auto `VERCEL_URL`).
 * Development / CI build: falls back to `http://127.0.0.1:$PORT` when unset.
 */
export function getSiteUrl(): string {
  for (const key of SITE_URL_ENV_KEYS) {
    const origin = originFromEnvValue(process.env[key]);
    if (origin) return origin;
  }

  const vercelOrigin = originFromVercel();
  if (vercelOrigin) return vercelOrigin;

  if (process.env.NODE_ENV === "development" || isBuildWithoutPublicUrl()) {
    return originForDevelopment();
  }

  throw new Error(
    "[seo] Set NEXT_PUBLIC_APP_URL to your public site origin (e.g. https://shop.example.com).",
  );
}

export function absoluteUrl(pathname: string): string {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(path, base).toString();
}

export function absoluteImageUrl(src: string): string {
  if (!src) return absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const path = src.startsWith("/") ? src : `/${src}`;
  return new URL(path, getSiteUrl()).toString();
}

export function productSlug(name: string, id: number | string): string {
  return `${name.replace(/ /g, "-")}.${id}`;
}

export function productPath(
  product: Pick<ProductListItem, "name"> & { id: number | string },
): string {
  return `/products/${productSlug(product.name, product.id)}`;
}

/** Pages that must not appear in search results. */
export const NOINDEX_PATH_PREFIXES = [
  "/cart",
  "/login",
  "/checkout",
  "/customers",
  "/api",
] as const;

export function isNoIndexPath(pathname: string): boolean {
  return NOINDEX_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export const privateRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export function buildPageMetadata(options: {
  title: string;
  description: string;
  pathname: string;
  image?: string | null;
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(options.pathname);
  const ogImage = absoluteImageUrl(options.image ?? DEFAULT_OG_IMAGE_PATH);
  const fullTitle =
    options.title.includes(SITE_NAME) ? options.title : `${options.title} | ${SITE_NAME}`;

  return {
    title: options.title,
    description: options.description,
    alternates: { canonical },
    ...(options.noIndex ? { robots: privateRobots } : {}),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description: options.description,
      images: [{ url: ogImage, alt: options.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: options.description,
      images: [ogImage],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: DEFAULT_TITLE,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: absoluteImageUrl(DEFAULT_OG_IMAGE_PATH), alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [absoluteImageUrl(DEFAULT_OG_IMAGE_PATH)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
