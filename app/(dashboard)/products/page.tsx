import { FunnelIcon, Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import ListProductsComponent from "./listProductsComponent";
import Search from "./search";
import { Suspense } from "react";
import { Metadata } from "next";
import { ProductGridSkeleton } from "@/app/ui/shop/skeletons";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const viewMode = "grid" as "grid" | "list";
  const sortOption = "popular";

  const categories = ["All", "Smartphones", "Tablets", "Wearables"];

  return (
    <div className="shop-content-wrap py-8 md:py-12">
      <div className="mb-8 md:mb-10">
        <p className="font-mono-label text-shop-muted">Catalog</p>
        <h1 className="shop-section-title mt-2">All products</h1>
        <p className="mt-2 max-w-lg text-sm text-shop-secondary">
          Explore our curated collection of premium devices.
        </p>
      </div>

      <Search />

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-shop ease-shop ${
              i === 0
                ? "bg-shop-text text-white"
                : "bg-shop-surface-muted text-shop-secondary hover:bg-shop-border-subtle hover:text-shop-text"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 border-y border-shop-border-subtle py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-shop border border-shop-border bg-shop-surface px-4 py-2 text-sm font-medium text-shop-text transition-colors hover:border-shop-text">
            <FunnelIcon className="h-4 w-4" strokeWidth={1.5} />
            Filters
          </button>
          <select
            defaultValue={sortOption}
            className="shop-input w-auto appearance-none pr-8"
          >
            <option value="popular">Sort: Popular</option>
            <option value="rating">Sort: Rating</option>
            <option value="price-low">Sort: Price Low to High</option>
            <option value="price-high">Sort: Price High to Low</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-shop-muted">View</span>
          <div className="flex overflow-hidden rounded-shop border border-shop-border">
            <button
              className={`p-2.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-shop-text text-white"
                  : "bg-shop-surface text-shop-secondary hover:text-shop-text"
              }`}
              title="Grid view"
            >
              <Squares2X2Icon className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              className={`p-2.5 transition-colors ${
                viewMode === "list"
                  ? "bg-shop-text text-white"
                  : "bg-shop-surface text-shop-secondary hover:text-shop-text"
              }`}
              title="List view"
            >
              <ListBulletIcon className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <Suspense
        key={query + currentPage}
        fallback={<ProductGridSkeleton count={8} />}
      >
        <ListProductsComponent query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-12 flex justify-center">
        <nav className="flex items-center gap-1">
          <button className="flex h-10 w-10 items-center justify-center rounded-shop border border-shop-border text-sm font-medium text-shop-text transition-colors hover:bg-shop-surface-muted">
            1
          </button>
        </nav>
      </div>
    </div>
  );
}
