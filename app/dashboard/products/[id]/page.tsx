import { getProductById } from "@/app/lib/services/products";
import {
  ArrowLeftIcon,
  HeartIcon,
  ShoppingBagIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import SlideImage from "./slideImage";
import ProductForm from "./productForm";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const data = await getProductById(id);

  return {
    title: `${data.name}`,
    description: `${data.name} - ${data.description}`,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const data = await getProductById(id);
  const { reviews } = data;
  const currentImageIndex = 0;
  const isFavorite = false;
  const quantity = 1;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const product = {
    ...data,
    colors: data.colors.split(","),
    storageOptions: data.storageOptions ? data.storageOptions.split(",") : [],
    images: data.images.split(","),
  };
  const cleanedDetailInformation = product.detailInformation;
  const prodDetail = JSON.parse(cleanedDetailInformation);
  const productDetail = JSON.parse(prodDetail);
  const selectedColor = product.colors[0];
  const selectedStorage = product.storageOptions[0];
  const totalPrice = 100;

  return (
    <div className="bg-gray-50 rounded-lg p-4 min-h-screen">
      {/* Navigation/Header */}
      <nav className="flex pb-4 items-center">
        <button className="mr-4">
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        {/* <h1 className="text-xl font-semibold text-gray-900">Product Details</h1> */}
      </nav>

      <div className="w-full">
        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          {/* Product Images */}
          <SlideImage images={product.images} name={product.name} />

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={`h-5 w-5 ${
                          rating <= Math.floor(product.rate)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rate} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <button
                // onClick={() => setIsFavorite(!isFavorite)}
                className="text-gray-400 hover:text-red-500"
              >
                {isFavorite ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
              </button>
            </div>

            <p className="mt-4 text-gray-600">{product.description}</p>

            <ProductForm product={{ ...product }} />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Product Details
          </h2>
          {productDetail && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Specifications
                </h3>
                <ul className="space-y-2">
                  {Object.entries(productDetail).map(([key, value]) => {
                    if (Array.isArray(value)) return null; // Skip arrays like accessories here
                    return (
                      <li key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{key}</span>
                        <span className="text-gray-900">{String(value)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  What is in the Box
                </h3>
                <ul className="space-y-2">
                  {productDetail.accessories.map((item: any, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="text-gray-900">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Customer Reviews
          </h2>
          {reviews && (
            <div className="space-y-6">
              {reviews.map((review: any, index: number) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={`h-5 w-5 ${
                            rating <= Math.floor(review.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {Math.floor(review.rating)}
                    </span>
                  </div>
                  <h3 className="text-md font-medium text-gray-900 mt-2">
                    {review.comment}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    By {review.name || "Unknown"} • October 15, 2023
                  </p>
                </div>
              ))}
            </div>
          )}
          <button className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium">
            See all reviews
          </button>
        </div>
      </div>
    </div>
  );
}
