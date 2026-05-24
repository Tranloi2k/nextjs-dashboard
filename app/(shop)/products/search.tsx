"use client";
import { ShopButton } from "@/app/ui/shop/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(
    searchParams.get("query")?.toString() || "",
  );

  async function search() {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <label htmlFor="search" className="sr-only">
          Search products
        </label>
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-shop-muted"
          strokeWidth={1.5}
        />
        <input
          id="search"
          name="query"
          className="shop-input pl-11"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
      </div>
      <ShopButton
        type="button"
        variant="primary"
        onClick={() => search()}
        className="shrink-0"
      >
        Search
      </ShopButton>
    </div>
  );
}
