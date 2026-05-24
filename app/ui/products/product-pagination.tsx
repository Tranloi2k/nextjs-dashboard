"use client";

import { buildProductsSearchParams } from "@/app/lib/product-filters";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProductPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const next = buildProductsSearchParams(searchParams, { page });
    router.replace(`${pathname}?${next.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 ||
      p === totalPages ||
      (p >= currentPage - 1 && p <= currentPage + 1),
  );

  return (
    <div className="mt-12 flex justify-center">
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
          className="flex h-10 min-w-10 items-center justify-center rounded-shop border border-shop-border px-3 text-sm font-medium text-shop-text transition-colors hover:bg-shop-surface-muted disabled:opacity-40"
        >
          Prev
        </button>

        {pages.map((page, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev !== undefined && page - prev > 1;

          return (
            <span key={page} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-1 text-shop-muted">…</span>
              )}
              <button
                type="button"
                onClick={() => goToPage(page)}
                className={clsx(
                  "flex h-10 w-10 items-center justify-center rounded-shop border text-sm font-medium transition-colors",
                  page === currentPage
                    ? "border-shop-text bg-shop-text text-white"
                    : "border-shop-border text-shop-text hover:bg-shop-surface-muted",
                )}
              >
                {page}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
          className="flex h-10 min-w-10 items-center justify-center rounded-shop border border-shop-border px-3 text-sm font-medium text-shop-text transition-colors hover:bg-shop-surface-muted disabled:opacity-40"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
