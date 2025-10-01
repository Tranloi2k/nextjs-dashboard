"use client";
import { usePathname } from "next/navigation";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { getCart } from "@/app/lib/services/cart";

export default function Header() {
  const pathname = usePathname();
  const [cartItemsCount, setCartItemsCount] = useState(0); // Giả sử có 3 items trong giỏ hàng

  useEffect(() => {
    // Fetch cart items count from API
    const cartCountFromStorage = localStorage.getItem("cartItemsCount");
    if (cartCountFromStorage) {
      setCartItemsCount(parseInt(cartCountFromStorage));
    }
    const fetchData = async () => {
      try {
        const response = await getCart();
        localStorage.setItem("cartItemsCount", response.quantity);
        setCartItemsCount(response.quantity);
      } catch (error) {
        console.error("Failed to fetch cart items count:", error);
        setCartItemsCount(0);
      }
    };

    fetchData();
  }, []);

  // ✅ Function để format pathname
  const formatPathname = (path: string) => {
    const segments = path.replace(/^\//, "").split("/");

    // Format each segment
    const formattedSegments = segments.map((segment) => {
      if (segment.match(/^\d+$/) || segment.match(/^[a-f0-9-]{36}$/)) {
        return `ID: ${segment}`;
      }

      // Capitalize first letter and replace hyphens with spaces
      return segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    });

    return formattedSegments.join(" › ");
  };

  // ✅ Get page title from pathname
  const getPageTitle = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (!lastSegment || lastSegment === "dashboard") {
      return "Dashboard";
    }

    // Handle dynamic routes
    if (lastSegment.match(/^\d+$/) || lastSegment.match(/^[a-f0-9-]{36}$/)) {
      const parentSegment = segments[segments.length - 2];
      return parentSegment
        ? `${
            parentSegment.charAt(0).toUpperCase() + parentSegment.slice(1)
          } Details`
        : "Details";
    }

    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex items-center justify-between mb-4 px-4 py-2 shadow rounded-lg">
      <div className="flex flex-col">
        {/* ✅ Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {getPageTitle(pathname)}
        </h1>

        {/* ✅ Breadcrumb */}
        <div className="text-sm text-gray-500">
          <span className="text-indigo-600">Dashboard</span>
          {pathname !== "/dashboard" && (
            <>
              <span className="mx-2">›</span>
              <span>{formatPathname(pathname.replace("/dashboard", ""))}</span>
            </>
          )}
        </div>
      </div>

      <div className="p-4">
        <button className="relative hover:bg-gray-100 p-2 rounded-full transition-colors duration-200">
          <ShoppingCartIcon className="h-6 w-6 text-gray-600" />

          {/* ✅ Cart Badge - chỉ hiển thị khi có items */}
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] animate-pulse">
              {cartItemsCount > 99 ? "99+" : cartItemsCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
