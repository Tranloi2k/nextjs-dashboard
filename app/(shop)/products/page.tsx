import ListProductsComponent from "./listProductsComponent";
import Search from "./search";
import ProductToolbar from "@/app/ui/products/product-toolbar";
import ProductPagination from "@/app/ui/products/product-pagination";
import { parseProductFilters } from "@/app/lib/product-filters";
import { getCatalogAuthenticated } from "@/app/lib/catalog-auth";
import { getProducts } from "@/app/lib/services/products";
import { buildPageMetadata } from "@/app/lib/seo";
import { productListJsonLd } from "@/app/lib/seo-structured-data";
import JsonLd from "@/app/ui/seo/json-ld";
import { Suspense } from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

function getPageTitle(category?: string, query?: string) {
  if (query) return `Results for "${query}"`;
  switch (category) {
    case "smartphones":
      return "Smartphones";
    case "tablets":
      return "Tablets";
    case "wearables":
      return "Wearables";
    default:
      return "All products";
  }
}

function getCatalogDescription(category?: string, query?: string) {
  if (query) {
    return `Search results for "${query}" at NOVA — premium tech and accessories.`;
  }
  switch (category) {
    case "smartphones":
      return "Browse the latest smartphones — flagship performance, premium design.";
    case "tablets":
      return "Shop tablets for work and creativity with vivid displays.";
    case "wearables":
      return "Discover smartwatches and wearables that keep you connected.";
    default:
      return "Browse our full catalog of premium smartphones, tablets, and wearables.";
  }
}

export async function generateMetadata(props: {
  searchParams?: Promise<Record<string, string | undefined>>;
}): Promise<Metadata> {
  const rawParams = (await props.searchParams) ?? {};
  const filters = parseProductFilters(rawParams);
  const title = getPageTitle(filters.category, filters.query);
  const pathname =
    filters.query || filters.category || filters.page > 1
      ? `/products?${new URLSearchParams(
          Object.entries(rawParams).filter(([, v]) => v != null) as [string, string][],
        ).toString()}`
      : "/products";

  return buildPageMetadata({
    title,
    description: getCatalogDescription(filters.category, filters.query),
    pathname,
  });
}

export default async function ProductsPage(props: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const rawParams = (await props.searchParams) ?? {};
  const filters = parseProductFilters(rawParams);
  const pageTitle = getPageTitle(filters.category, filters.query);
  const authenticated = await getCatalogAuthenticated();

  const result = await getProducts(
    {
      query: filters.query,
      page: filters.page,
      category: filters.category,
      sort: filters.sort,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      onSale: filters.onSale,
    },
    { authenticated },
  );

  return (
    <div className="shop-content-wrap py-8 md:py-12">
      {result.products.length > 0 ? (
        <JsonLd data={productListJsonLd(result.products)} />
      ) : null}
      <div className="mb-8 md:mb-10">
        <p className="font-mono-label text-shop-muted">Catalog</p>
        <h1 className="shop-section-title mt-2">{pageTitle}</h1>
        <p className="mt-2 max-w-lg text-sm text-shop-secondary">
          Explore our curated collection of premium devices.
        </p>
      </div>

      <Search />

      <Suspense fallback={null}>
        <ProductToolbar />
      </Suspense>

      <ListProductsComponent
        products={result.products}
        viewMode={filters.view}
      />

      <Suspense fallback={null}>
        <ProductPagination
          currentPage={result.page}
          totalPages={result.totalPages}
        />
      </Suspense>
    </div>
  );
}
