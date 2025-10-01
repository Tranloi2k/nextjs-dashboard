"use client";
import BuyNowButton from "@/app/ui/products/BuyNowButton";
import { ShoppingBagIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

export default function ProductForm({ product }: any) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedStorage, setSelectedStorage] = useState(
    product.storageOptions[0] || ""
  );

  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };
  return (
    <form>
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Color</h2>
        <div className="flex space-x-2 mt-2">
          {product.colors.map((color: any) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedColor === color
                  ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
      {product.storageOptions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900">Storage</h2>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {product.storageOptions.map((storage: any) => (
              <button
                key={storage}
                type="button"
                onClick={() => setSelectedStorage(storage)}
                className={`px-3 py-2 rounded-md text-sm ${
                  selectedStorage === storage
                    ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {storage}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Quantity</h2>
        <div className="flex items-center mt-2">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 bg-gray-200 rounded-l-md text-gray-700 hover:bg-gray-300"
          >
            -
          </button>
          <span className="px-4 py-1 bg-gray-100 text-gray-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 bg-gray-200 rounded-r-md text-gray-700 hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Price</span>
          <span className="text-lg font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-xl font-bold text-indigo-600">
            {formatPrice(product.price * quantity)}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            //   onClick={handleAddToCart}
            className="flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            Add to Cart
          </button>
          {/* <button
            type="button"
            onClick={handleBuyNow}
            className="flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Buy Now
          </button> */}
          <BuyNowButton
            product={product}
            quantity={quantity}
            customerEmail={"customerEmail@example.com"}
          />
        </div>
      </div>
    </form>
  );
}
