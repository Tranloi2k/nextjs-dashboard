"use client";
import { syncCartBadge } from "@/app/lib/cart-events";
import { addToCart } from "@/app/lib/services/cart";
import type { ProductFormProduct } from "@/app/lib/definitions";
import BuyNowButton from "@/app/ui/products/BuyNowButton";
import { ShopButton } from "@/app/ui/shop/button";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import clsx from "clsx";

export default function ProductForm({
  product,
}: {
  product: ProductFormProduct;
}) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedStorage, setSelectedStorage] = useState(
    product.storageOptions[0] || "",
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const handleAddToCart = async () => {
    setIsAdding(true);
    setCartMessage(null);

    try {
      const summary = await addToCart(
        product.id,
        quantity,
        selectedColor,
        selectedStorage,
      );
      syncCartBadge(summary.cart?.quantity ?? 0);
      setCartMessage("Added to your bag");
    } catch {
      setCartMessage("Could not add to bag. Please sign in and try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const optionClass = (selected: boolean) =>
    clsx(
      "rounded-shop border px-4 py-2.5 text-sm font-medium transition-all duration-shop ease-shop",
      selected
        ? "border-shop-text bg-shop-text text-white"
        : "border-shop-border bg-shop-surface text-shop-secondary hover:border-shop-text hover:text-shop-text",
    );

  return (
    <form className="mt-8">
      <div>
        <h2 className="font-mono-label text-shop-muted">Color</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((color: string) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={optionClass(selectedColor === color)}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {product.storageOptions.length > 0 && (
        <div className="mt-6">
          <h2 className="font-mono-label text-shop-muted">Storage</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {product.storageOptions.map((storage: string) => (
              <button
                key={storage}
                type="button"
                onClick={() => setSelectedStorage(storage)}
                className={optionClass(selectedStorage === storage)}
              >
                {storage}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="font-mono-label text-shop-muted">Quantity</h2>
        <div className="mt-3 inline-flex items-center overflow-hidden rounded-shop border border-shop-border">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-11 w-11 items-center justify-center text-shop-secondary transition-colors hover:bg-shop-surface-muted hover:text-shop-text"
          >
            −
          </button>
          <span className="flex h-11 min-w-[3rem] items-center justify-center border-x border-shop-border text-sm font-medium text-shop-text">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-11 w-11 items-center justify-center text-shop-secondary transition-colors hover:bg-shop-surface-muted hover:text-shop-text"
          >
            +
          </button>
        </div>
      </div>

      <div className="shop-divider mt-8 pt-8">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-shop-secondary">Unit price</span>
          <span className="text-sm font-medium text-shop-text">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-sm font-medium text-shop-text">Total</span>
          <span className="font-display text-xl font-medium text-shop-text">
            {formatPrice(product.price * quantity)}
          </span>
        </div>

        {cartMessage && (
          <p
            className={clsx(
              "mt-4 text-sm",
              cartMessage.startsWith("Added")
                ? "text-shop-text"
                : "text-shop-error",
            )}
            role="status"
          >
            {cartMessage}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <ShopButton
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            disabled={isAdding}
            onClick={handleAddToCart}
          >
            {isAdding ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-shop-text/30 border-t-shop-text" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingBagIcon className="h-5 w-5" strokeWidth={1.5} />
                Add to bag
              </>
            )}
          </ShopButton>
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
