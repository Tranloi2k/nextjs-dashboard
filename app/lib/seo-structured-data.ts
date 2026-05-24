import type { ProductListItem, ProductReview } from "@/app/lib/definitions";
import {
  absoluteImageUrl,
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  getSiteUrl,
  productPath,
  SITE_NAME,
} from "@/app/lib/seo";

type ProductDetail = {
  id: number | string;
  name: string;
  description?: string;
  images?: string;
  image?: string;
  price: number;
  discount?: number;
  reviews?: ProductReview[];
  rating?: number;
  reviewCount?: number;
};

export function websiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        logo: absoluteImageUrl("/hero-shop.jpg"),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        publisher: { "@id": `${siteUrl}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/products?query={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function productListJsonLd(products: ProductListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(productPath(product)),
      name: product.name,
    })),
  };
}

export function productDetailJsonLd(product: ProductDetail) {
  const path = productPath({ id: product.id, name: product.name });
  const images = product.images
    ? product.images.split(",").map((img) => absoluteImageUrl(img.trim()))
    : product.image
      ? [absoluteImageUrl(product.image)]
      : [];

  const rating =
    product.rating ??
    (product.reviews?.length
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : undefined);
  const reviewCount = product.reviewCount ?? product.reviews?.length ?? 0;

  const offerPrice =
    product.discount && product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: getSiteUrl() },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: absoluteUrl("/products"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: absoluteUrl(path),
          },
        ],
      },
      {
        "@type": "Product",
        name: product.name,
        description: product.description ?? product.name,
        image: images.length > 0 ? images : undefined,
        sku: String(product.id),
        offers: {
          "@type": "Offer",
          url: absoluteUrl(path),
          priceCurrency: "USD",
          price: offerPrice.toFixed(2),
          availability: "https://schema.org/InStock",
        },
        ...(rating && reviewCount > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: rating.toFixed(1),
                reviewCount,
              },
            }
          : {}),
      },
    ],
  };
}
