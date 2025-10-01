"use client";

import { useState } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";

interface BuyNowButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity?: number;
  customerEmail?: string;
}

export default function BuyNowButton({
  product,
  quantity = 1,
  customerEmail,
}: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          customerEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Error initiating checkout:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={isLoading}
      className={`
        flex items-center justify-center py-3 px-6 rounded-md font-medium transition-colors
        ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }
      `}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processing...
        </>
      ) : (
        <>
          <ShoppingBagIcon className="h-5 w-5 mr-2" />
          Buy Now - ${product.price.toFixed(2)}
        </>
      )}
    </button>
  );
}
