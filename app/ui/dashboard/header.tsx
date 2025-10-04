"use client";
import { usePathname } from "next/navigation";
import {
  ShoppingCartIcon,
  UserIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { getCart } from "@/app/lib/services/cart";
import { getUser } from "@/app/lib/services/user";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // Fetch cart items count from API
    const cartCountFromStorage = localStorage.getItem("cartItemsCount");
    if (cartCountFromStorage) {
      setCartItemsCount(parseInt(cartCountFromStorage));
    }

    const fetchData = async () => {
      try {
        const [cartResponse, userResponse] = await Promise.all([
          getCart(),
          getUser(),
        ]);
        // Set user info
        setUserInfo(userResponse);

        // Set cart count
        const cartQuantity = cartResponse?.quantity || 0;
        localStorage.setItem("cartItemsCount", cartQuantity.toString());
        setCartItemsCount(cartQuantity);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setCartItemsCount(0);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle user menu toggle
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // ✅ Handle logout
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
      setShowUserMenu(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showUserMenu]);

  // ✅ Function để format pathname
  const formatPathname = (path: string) => {
    const segments = path.replace(/^\//, "").split("/");

    const formattedSegments = segments.map((segment) => {
      if (segment.match(/^\d+$/) || segment.match(/^[a-f0-9-]{36}$/)) {
        return `ID: ${segment}`;
      }

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

  // ✅ Get user display info
  const displayUser = useMemo(() => {
    if (session?.user) {
      return {
        name: session.user.name || "User",
        email: session.user.email || "",
        avatar: session.user.image || null,
      };
    }

    if (userInfo) {
      return {
        name: userInfo.name || userInfo.username || "User",
        email: userInfo.email || "",
        avatar: userInfo.avatar || userInfo.image || null,
      };
    }

    return {
      name: "User",
      email: "",
      avatar: null,
    };
  }, [userInfo, session?.user]);

  return (
    <div className="flex items-center justify-between mb-4 px-4 py-2 bg-white shadow rounded-lg">
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

      {/* ✅ Right Side Icons */}
      <div className="flex items-center space-x-4">
        {/* ✅ Cart Icon */}
        <div className="relative">
          <button className="relative hover:bg-gray-100 p-2 rounded-full transition-colors duration-200">
            <ShoppingCartIcon className="h-6 w-6 text-gray-600" />

            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] animate-pulse">
                {cartItemsCount > 99 ? "99+" : cartItemsCount}
              </span>
            )}
          </button>
        </div>

        {/* ✅ User Menu */}
        <div className="relative user-menu-container">
          <button
            onClick={toggleUserMenu}
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
          >
            {/* ✅ User Avatar or Icon */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              {displayUser && displayUser.avatar ? (
                <img
                  src={displayUser.avatar}
                  alt={displayUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-5 h-5 text-white" />
              )}
            </div>

            {/* ✅ User Info */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                {displayUser?.name}
              </p>
              {displayUser && displayUser.email && (
                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                  {displayUser.email}
                </p>
              )}
            </div>

            {/* ✅ Dropdown Arrow */}
            <ChevronDownIcon
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* ✅ User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-1">
                {/* ✅ User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {displayUser?.name}
                  </p>
                  {displayUser && displayUser.email && (
                    <p className="text-xs text-gray-500 truncate">
                      {displayUser.email}
                    </p>
                  )}
                </div>

                {/* ✅ Menu Items */}
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  Account Settings
                </button>

                <div className="border-t border-gray-100 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
