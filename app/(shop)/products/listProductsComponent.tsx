import type { ProductListItem } from "@/app/lib/definitions";
import type { ProductView } from "@/app/lib/product-filters";
import { productPath } from "@/app/lib/seo";
import { StarIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

export default function ListProductsComponent({
  products,
  viewMode,
}: {
  products: ProductListItem[];
  viewMode: ProductView;
}) {

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  if (products.length === 0) {
    return (
      <div className="shop-card flex flex-col items-center justify-center px-8 py-16 text-center">
        <p className="font-display text-lg font-medium text-shop-text">
          No products found
        </p>
        <p className="mt-2 max-w-sm text-sm text-shop-secondary">
          Sign in and ensure the backend API is running at{" "}
          <code className="rounded-sm bg-shop-surface-muted px-1.5 py-0.5 text-xs text-shop-text">
            {process.env.NEXT_PUBLIC_EXTERNAL_API_URL ??
              "NEXT_PUBLIC_EXTERNAL_API_URL"}
          </code>
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
        {products.map((product) => (
          <article
            key={product.id}
            className="group shop-card-interactive flex flex-col overflow-hidden"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-shop-surface-muted">
              <Link href={productPath(product)} className="block h-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6 transition-transform duration-500 ease-shop group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </Link>
              <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                {product.isNew && <span className="shop-badge">New</span>}
                {product.discount && (
                  <span className="shop-badge-sale">-{product.discount}%</span>
                )}
              </div>
              <button
                className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-shop-text text-white opacity-0 shadow-shop-md transition-all duration-shop ease-shop group-hover:translate-y-0 group-hover:opacity-100"
                aria-label="Add to bag"
              >
                <ShoppingBagIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <Link href={productPath(product)} className="block">
                <h3 className="text-sm font-medium leading-snug text-shop-text transition-colors group-hover:text-shop-secondary">
                  {product.name}
                </h3>
              </Link>

              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((rating) =>
                  rating <= Math.floor(product.rate ?? 0) ? (
                    <StarIcon
                      key={rating}
                      className="h-3.5 w-3.5 text-shop-text"
                    />
                  ) : (
                    <StarOutlineIcon
                      key={rating}
                      className="h-3.5 w-3.5 text-shop-border"
                    />
                  ),
                )}
                <span className="ml-1 text-xs text-shop-muted">
                  ({product.rate})
                </span>
              </div>

              <div className="mt-auto pt-3">
                {product.discount ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-shop-text">
                      {formatPrice(
                        calculateDiscountedPrice(
                          product.price,
                          product.discount,
                        ),
                      )}
                    </span>
                    <span className="text-xs text-shop-muted line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-shop-text">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {products.map((product) => (
        <article
          key={product.id}
          className="group shop-card-interactive overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-shop-surface-muted sm:w-48 md:w-56">
              <Link href={productPath(product)} className="relative block h-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 640px) 100vw, 224px"
                />
              </Link>
              {product.isNew && (
                <span className="shop-badge absolute left-3 top-3">New</span>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
              <div>
                <Link href={productPath(product)}>
                  <h3 className="font-display text-lg font-medium text-shop-text transition-colors hover:text-shop-secondary">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) =>
                    rating <=
                    Math.floor(product.rating ?? product.rate ?? 0) ? (
                      <StarIcon
                        key={rating}
                        className="h-4 w-4 text-shop-text"
                      />
                    ) : (
                      <StarOutlineIcon
                        key={rating}
                        className="h-4 w-4 text-shop-border"
                      />
                    ),
                  )}
                  <span className="ml-1 text-xs text-shop-muted">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-base font-semibold text-shop-text">
                  {formatPrice(product.price)}
                </span>
                <button className="inline-flex items-center gap-2 rounded-shop bg-shop-text px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-shop-accent-hover">
                  <ShoppingBagIcon className="h-4 w-4" />
                  Add to bag
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
