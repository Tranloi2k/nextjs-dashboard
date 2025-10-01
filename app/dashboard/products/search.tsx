"use client";
import { Button } from "@/app/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(
    searchParams.get("query")?.toString() || ""
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
    <div className="flex justify-between items-center mb-2">
      <div className="relative flex flex-1 flex-shrink-0">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          name="query"
          className="peer mr-4 block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Button
        className="flex items-center justify-center flex-wrap"
        onClick={() => search()}
      >
        <MagnifyingGlassIcon className="h-[18px] w-[18px]  text-white peer-focus:text-gray-900" />
        <span className="ml-2">Search</span>
      </Button>
    </div>
  );
}
