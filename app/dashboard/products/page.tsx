import Link from "next/link";
import { FunnelIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import Pagination from "@/app/ui/invoices/pagination";
import ListProductsComponent from "./listProductsComponent";
import Search from "./search";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

//TODO : Add loading state for products page
export default async function ProductsPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  let viewMode = "grid";
  let sortOption = "popular";

  return (
    <div className=" min-h-screen">
      {/* Breadcrumb */}
      <nav className="py-4 shadow-sm">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-indigo-600 hover:text-indigo-800">
              Home
            </Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li className="text-gray-600">Products</li>
        </ol>
      </nav>

      {/* Main Content */}
      {/* Page Header */}
      <div className="flex py-2 justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Smartphones & Accessories
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex border rounded-md overflow-hidden">
            <button
              className={`p-2 ${
                viewMode === "grid" ? "bg-gray-200" : "bg-white"
              }`}
              title="Grid view"
            >
              <Squares2X2Icon className="h-5 w-5 text-gray-600" />
            </button>
            <button
              className={`p-2 ${
                viewMode === "list" ? "bg-gray-200" : "bg-white"
              }`}
              title="List view"
            >
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Search />

      {/* Filters and Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FunnelIcon className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <div className="relative">
            <select
              defaultValue={sortOption}
              className="appearance-none bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="popular">Sort by: Popular</option>
              <option value="rating">Sort by: Rating</option>
              <option value="price-low">Sort by: Price Low to High</option>
              <option value="price-high">Sort by: Price High to Low</option>
              <option value="newest">Sort by: Newest</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-2">
          <span className="text-sm text-gray-500">Category:</span>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Smartphones
          </button>
          <span className="text-gray-400">|</span>
          <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
            Tablets
          </button>
          <span className="text-gray-400">|</span>
          <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
            Wearables
          </button>
        </div>
      </div>

      <Suspense
        key={query + currentPage}
        fallback={<div>Loading products...</div>}
      >
        <ListProductsComponent query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={1} />
      </div>
      {/* Pagination */}
    </div>
  );
}
