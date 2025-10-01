import { getProducts } from "@/app/lib/products";
import { StarIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function ListProductsComponent({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const products: any[] = await getProducts(query, currentPage);
  const isFavoriteMap = {};
  let viewMode = "grid";
  let sortOption = "popular";
  const productsPerPage = 8;

  const toggleFavorite = (productId: number) => {};

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return b.reviewCount - a.reviewCount; // popular
    }
  });

  return (
    <>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <Link href={`/dashboard/products/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain p-4"
                  />
                </Link>
                <button className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100">
                  {/* {isFavoriteMap[product.id] ? (
                      <HeartIconSolid className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
                    )} */}
                </button>
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    New
                  </span>
                )}
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                )}
              </div>
              <div className="p-4">
                <Link
                  href={`/dashboard/products/${product.id}`}
                  className="block"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-1 hover:text-indigo-600">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={`h-4 w-4 ${
                          rating <= Math.floor(product.rate)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-gray-600">
                    ({product.rate})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {product.discount ? (
                      <>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(
                            calculateDiscountedPrice(
                              product.price,
                              product.discount
                            )
                          )}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  <button className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200">
                    <ShoppingBagIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 relative">
                  <Link href={`/dashboard/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-contain p-4"
                    />
                  </Link>
                  <button className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100">
                    {/* {isFavoriteMap[product.id] ? (
                        <HeartIconSolid className="h-6 w-6 text-red-500" />
                      ) : (
                        <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
                      )} */}
                  </button>
                  {product.isNew && (
                    <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      New
                    </span>
                  )}
                  {product.discount && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div className="md:w-3/4 p-4">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="block"
                      >
                        <h3 className="text-xl font-medium text-gray-900 mb-1 hover:text-indigo-600">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={`h-5 w-5 ${
                                rating <= Math.floor(product.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.discount ? (
                          <>
                            <span className="text-xl font-bold text-gray-900">
                              {formatPrice(
                                calculateDiscountedPrice(
                                  product.price,
                                  product.discount
                                )
                              )}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center">
                        <ShoppingBagIcon className="h-5 w-5 mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
