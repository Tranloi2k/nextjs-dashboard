import { getCatalogAuthenticated } from "@/app/lib/catalog-auth";
import { getProductById } from "@/app/lib/services/products";
import { buildPageMetadata, productPath } from "@/app/lib/seo";
import { productDetailJsonLd } from "@/app/lib/seo-structured-data";
import JsonLd from "@/app/ui/seo/json-ld";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import SlideImage from "./slideImage";
import ProductForm from "./productForm";
import type { Metadata } from "next";
import type { ProductReview } from "@/app/lib/definitions";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const id = slug.split(".").pop() || "";
  const data = await getProductById(id, { authenticated: false });
  const description =
    typeof data.description === "string" && data.description.length > 0
      ? data.description.slice(0, 160)
      : `Buy ${data.name} at NOVA — premium tech with secure checkout.`;
  const image = data.images?.split(",")[0] ?? data.image;

  return buildPageMetadata({
    title: data.name,
    description,
    pathname: productPath({ id: data.id, name: data.name }),
    image,
  });
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const id = slug.split(".").pop() || "";
  const authenticated = await getCatalogAuthenticated();
  const data = await getProductById(id, { authenticated });
  const { reviews } = data;
  const isFavorite = false;

  const product = {
    ...data,
    colors: data.colors.split(","),
    storageOptions: data.storageOptions ? data.storageOptions.split(",") : [],
    images: data.images.split(","),
  };
  const cleanedDetailInformation = product.detailInformation;
  const prodDetail = JSON.parse(cleanedDetailInformation);
  const productDetail = JSON.parse(prodDetail);

  return (
    <div className="shop-content-wrap py-8 md:py-12">
      <JsonLd data={productDetailJsonLd(data)} />
      <nav className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-shop-secondary transition-colors hover:text-shop-text"
        >
          <ChevronLeftIcon className="h-4 w-4" strokeWidth={1.5} />
          Back to products
        </Link>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <SlideImage images={product.images} name={product.name} />

        <div className="mt-10 lg:mt-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono-label text-shop-muted">Product</p>
              <h1 className="font-display mt-2 text-display-md font-medium tracking-tight text-shop-text">
                {product.name}
              </h1>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((rating) =>
                    rating <= Math.floor(product.rate) ? (
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
                </div>
                <span className="text-sm text-shop-muted">
                  {product.rate} · {product.reviewCount} reviews
                </span>
              </div>
            </div>
            <button
              className="rounded-shop p-2 text-shop-muted transition-colors hover:bg-shop-surface-muted hover:text-shop-error"
              aria-label="Add to wishlist"
            >
              {isFavorite ? (
                <HeartIconSolid className="h-5 w-5 text-shop-error" />
              ) : (
                <HeartIcon className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-shop-secondary">
            {product.description}
          </p>

          <ProductForm product={{ ...product }} />
        </div>
      </div>

      <section className="mt-16 md:mt-20">
        <h2 className="shop-section-title">Product details</h2>
        {productDetail && (
          <div className="shop-card mt-6 grid gap-8 p-6 md:grid-cols-2 md:p-8">
            <div>
              <h3 className="font-mono-label text-shop-muted">Specifications</h3>
              <ul className="mt-4 space-y-3">
                {Object.entries(productDetail).map(([key, value]) => {
                  if (Array.isArray(value)) return null;
                  return (
                    <li
                      key={key}
                      className="flex justify-between gap-4 border-b border-shop-border-subtle pb-3 text-sm last:border-0"
                    >
                      <span className="capitalize text-shop-secondary">
                        {key}
                      </span>
                      <span className="font-medium text-shop-text">
                        {String(value)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h3 className="font-mono-label text-shop-muted">
                What&apos;s in the box
              </h3>
              <ul className="mt-4 space-y-2">
                {productDetail.accessories.map(
                  (item: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-shop-text"
                    >
                      <span className="h-1 w-1 rounded-full bg-shop-text" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        )}
      </section>

      <section className="mt-16 md:mt-20">
        <h2 className="shop-section-title">Customer reviews</h2>
        {reviews && (
          <div className="mt-6 space-y-0">
            {reviews.map((review: ProductReview, index: number) => (
              <div
                key={index}
                className="border-b border-shop-border-subtle py-6 last:border-0"
              >
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) =>
                    rating <= Math.floor(review.rating) ? (
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
                </div>
                <p className="mt-3 text-sm leading-relaxed text-shop-text">
                  {review.comment}
                </p>
                <p className="mt-2 text-xs text-shop-muted">
                  {review.name || "Anonymous"} · October 15, 2023
                </p>
              </div>
            ))}
          </div>
        )}
        <button className="mt-6 text-sm font-medium text-shop-text underline-offset-4 transition-opacity hover:underline">
          See all reviews
        </button>
      </section>
    </div>
  );
}
