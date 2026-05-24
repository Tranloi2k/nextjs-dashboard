"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ShoppingBagIcon,
  UserIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import type { ApiUserInfo } from "@/app/lib/definitions";
import { CART_UPDATED_EVENT } from "@/app/lib/cart-events";
import { getCart } from "@/app/lib/services/cart";
import { getUser } from "@/app/lib/services/user";
import ShopLogo from "@/app/ui/shop/logo";
import {
  categoryNavHref,
  isCategoryActive,
} from "@/app/lib/product-filters";
import clsx from "clsx";
import Image from "next/image";
const navLinks = [
  { name: "Shop", category: "all" },
  { name: "Smartphones", category: "smartphones" },
  { name: "Tablets", category: "tablets" },
  { name: "Wearables", category: "wearables" },
] as const;

export default function ShopNavbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const { data: session } = useSession();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userInfo, setUserInfo] = useState<ApiUserInfo | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("cartItemsCount");
    if (stored) {
      setCartItemsCount(parseInt(stored, 10));
    }

    const fetchData = async () => {
      try {
        const [cartResponse, userResponse] = await Promise.all([
          getCart(),
          getUser(),
        ]);
        setUserInfo(userResponse);
        const cartQuantity = cartResponse?.quantity || 0;
        localStorage.setItem("cartItemsCount", cartQuantity.toString());
        setCartItemsCount(cartQuantity);
      } catch {
        setCartItemsCount(0);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const onCartUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ count: number }>).detail;
      setCartItemsCount(detail.count);
    };

    window.addEventListener(CART_UPDATED_EVENT, onCartUpdated);
    return () => window.removeEventListener(CART_UPDATED_EVENT, onCartUpdated);
  }, []);

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

    return () => document.removeEventListener("click", handleClickOutside);
  }, [showUserMenu]);

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

    return { name: "Account", email: "", avatar: null };
  }, [userInfo, session?.user]);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
      setShowUserMenu(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b transition-all duration-shop ease-shop",
        scrolled
          ? "border-shop-border bg-shop-surface/95 shadow-shop backdrop-blur-md"
          : "border-transparent bg-shop-bg",
      )}
    >
      <div className="shop-content-wrap">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <div className="flex items-center gap-8">
            <ShopLogo />
            <nav className="hidden items-center gap-6 lg:flex">
              {navLinks.map((link) => {
                const href = categoryNavHref(link.category);
                const isActive =
                  pathname.startsWith("/products") &&
                  isCategoryActive(activeCategory, link.category);

                return (
                  <Link
                    key={link.name}
                    href={href}
                    className={clsx(
                      "text-sm font-medium transition-colors duration-shop ease-shop",
                      isActive
                        ? "text-shop-text"
                        : "text-shop-secondary hover:text-shop-text",
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/products"
              className="hidden rounded-shop p-2.5 text-shop-secondary transition-colors hover:bg-shop-surface-muted hover:text-shop-text sm:flex"
              aria-label="Search products"
            >
              <MagnifyingGlassIcon className="h-5 w-5" strokeWidth={1.5} />
            </Link>

            <Link
              href="/cart"
              className="relative rounded-shop p-2.5 text-shop-secondary transition-colors hover:bg-shop-surface-muted hover:text-shop-text"
              aria-label={`Cart, ${cartItemsCount} items`}
            >
              <ShoppingBagIcon className="h-5 w-5" strokeWidth={1.5} />
              {cartItemsCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-shop-text px-1 text-[10px] font-semibold text-white">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </Link>

            <div className="relative user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-shop p-1.5 pr-2.5 transition-colors hover:bg-shop-surface-muted"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-shop-surface-muted">
                  {displayUser.avatar ? (
                    <Image
                      src={displayUser.avatar}
                      alt={displayUser.name ?? "User"}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-4 w-4 text-shop-secondary" strokeWidth={1.5} />
                  )}
                </div>
                <ChevronDownIcon
                  className={clsx(
                    "hidden h-3.5 w-3.5 text-shop-muted transition-transform duration-shop sm:block",
                    showUserMenu && "rotate-180",
                  )}
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-shop-lg border border-shop-border bg-shop-surface shadow-shop-lg">
                  <div className="border-b border-shop-border-subtle px-4 py-3">
                    <p className="truncate text-sm font-medium text-shop-text">
                      {displayUser.name}
                    </p>
                    {displayUser.email && (
                      <p className="truncate text-xs text-shop-muted">
                        {displayUser.email}
                      </p>
                    )}
                  </div>
                  <div className="py-1">
                    <Link
                      href="/products"
                      className="block px-4 py-2 text-sm text-shop-secondary transition-colors hover:bg-shop-surface-muted hover:text-shop-text"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-shop-error transition-colors hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="rounded-shop p-2.5 text-shop-secondary transition-colors hover:bg-shop-surface-muted lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-shop-border-subtle py-4 lg:hidden">
            {navLinks.map((link) => {
              const href = categoryNavHref(link.category);
              const isActive =
                pathname.startsWith("/products") &&
                isCategoryActive(activeCategory, link.category);

              return (
                <Link
                  key={link.name}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "block py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-shop-text"
                      : "text-shop-secondary hover:text-shop-text",
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
