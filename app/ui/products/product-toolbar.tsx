"use client";

import {
  PRODUCT_CATEGORIES,
  SORT_OPTIONS,
  buildProductsSearchParams,
  type ProductView,
} from "@/app/lib/product-filters";
import {
  FunnelIcon,
  ListBulletIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftMin, setDraftMin] = useState("");
  const [draftMax, setDraftMax] = useState("");
  const [draftOnSale, setDraftOnSale] = useState(false);

  const activeCategory = searchParams.get("category") || "all";
  const activeSort = searchParams.get("sort") || "popular";
  const activeView = (searchParams.get("view") || "grid") as ProductView;

  useEffect(() => {
    setDraftMin(searchParams.get("minPrice") || "");
    setDraftMax(searchParams.get("maxPrice") || "");
    setDraftOnSale(searchParams.get("onSale") === "true");
  }, [searchParams]);

  const pushParams = (
    updates: Record<string, string | number | boolean | null | undefined>,
  ) => {
    const next = buildProductsSearchParams(searchParams, {
      page: 1,
      ...updates,
    });
    router.replace(`${pathname}?${next.toString()}`);
  };

  const applyFilters = () => {
    pushParams({
      minPrice: draftMin || null,
      maxPrice: draftMax || null,
      onSale: draftOnSale ? "true" : null,
    });
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setDraftMin("");
    setDraftMax("");
    setDraftOnSale(false);
    pushParams({
      minPrice: null,
      maxPrice: null,
      onSale: null,
    });
    setFiltersOpen(false);
  };

  const hasActiveFilters =
    !!searchParams.get("minPrice") ||
    !!searchParams.get("maxPrice") ||
    searchParams.get("onSale") === "true";

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() =>
              pushParams({
                category: cat.id === "all" ? null : cat.id,
              })
            }
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-shop ease-shop",
              activeCategory === cat.id
                ? "bg-shop-text text-white"
                : "bg-shop-surface-muted text-shop-secondary hover:bg-shop-border-subtle hover:text-shop-text",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 border-y border-shop-border-subtle py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={clsx(
              "inline-flex items-center gap-2 rounded-shop border px-4 py-2 text-sm font-medium transition-colors",
              filtersOpen || hasActiveFilters
                ? "border-shop-text bg-shop-text text-white"
                : "border-shop-border bg-shop-surface text-shop-text hover:border-shop-text",
            )}
          >
            <FunnelIcon className="h-4 w-4" strokeWidth={1.5} />
            Filters
            {hasActiveFilters && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-[10px]">
                •
              </span>
            )}
          </button>

          <select
            value={activeSort}
            onChange={(e) => pushParams({ sort: e.target.value })}
            className="shop-input w-auto appearance-none pr-8"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-shop-muted">View</span>
          <div className="flex overflow-hidden rounded-shop border border-shop-border">
            <button
              type="button"
              onClick={() => pushParams({ view: "grid" })}
              className={clsx(
                "p-2.5 transition-colors",
                activeView === "grid"
                  ? "bg-shop-text text-white"
                  : "bg-shop-surface text-shop-secondary hover:text-shop-text",
              )}
              title="Grid view"
            >
              <Squares2X2Icon className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => pushParams({ view: "list" })}
              className={clsx(
                "p-2.5 transition-colors",
                activeView === "list"
                  ? "bg-shop-text text-white"
                  : "bg-shop-surface text-shop-secondary hover:text-shop-text",
              )}
              title="List view"
            >
              <ListBulletIcon className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="shop-card mt-4 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-shop-text">Filter products</h3>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="rounded-shop p-1 text-shop-muted hover:bg-shop-surface-muted"
              aria-label="Close filters"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono-label text-shop-muted">Min price</span>
              <input
                type="number"
                min={0}
                className="shop-input mt-1.5"
                placeholder="0"
                value={draftMin}
                onChange={(e) => setDraftMin(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="font-mono-label text-shop-muted">Max price</span>
              <input
                type="number"
                min={0}
                className="shop-input mt-1.5"
                placeholder="Any"
                value={draftMax}
                onChange={(e) => setDraftMax(e.target.value)}
              />
            </label>
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-shop-text">
            <input
              type="checkbox"
              checked={draftOnSale}
              onChange={(e) => setDraftOnSale(e.target.checked)}
              className="h-4 w-4 rounded border-shop-border"
            />
            On sale only
          </label>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="rounded-shop bg-shop-text px-4 py-2 text-sm font-medium text-white hover:bg-shop-accent-hover"
            >
              Apply filters
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-shop border border-shop-border px-4 py-2 text-sm font-medium text-shop-secondary hover:text-shop-text"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
