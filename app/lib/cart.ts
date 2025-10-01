// ✅ Constants
const CART_COUNT_KEY = "cart_count";

// ✅ Helper function để check localStorage availability
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === "undefined") return false;
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// ✅ Get cart count từ localStorage
export const getCartCount = (): number => {
  try {
    if (!isLocalStorageAvailable()) {
      return 0;
    }

    const count = localStorage.getItem(CART_COUNT_KEY);

    if (!count) {
      return 0;
    }

    const parsedCount = parseInt(count, 10);
    return isNaN(parsedCount) ? 0 : Math.max(0, parsedCount);
  } catch (error) {
    console.error("Error reading cart count from localStorage:", error);
    return 0;
  }
};

// ✅ Save cart count to localStorage
export const saveCartCount = (count: number): boolean => {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn("localStorage is not available");
      return false;
    }

    // Validate count
    if (typeof count !== "number" || isNaN(count)) {
      console.error("Invalid cart count");
      return false;
    }

    const validCount = Math.max(0, Math.floor(count)); // Ensure positive integer

    localStorage.setItem(CART_COUNT_KEY, validCount.toString());

    // ✅ Trigger custom event để update UI
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { count: validCount },
        })
      );
    }

    return true;
  } catch (error) {
    console.error("Error saving cart count to localStorage:", error);
    return false;
  }
};

// ✅ Add to cart (increase count)
export const addToCart = (quantity: number = 1): number => {
  try {
    const currentCount = getCartCount();
    const newCount = currentCount + Math.max(1, Math.floor(quantity));

    saveCartCount(newCount);
    return newCount;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return getCartCount();
  }
};

// ✅ Remove from cart (decrease count)
export const removeFromCart = (quantity: number = 1): number => {
  try {
    const currentCount = getCartCount();
    const newCount = Math.max(
      0,
      currentCount - Math.max(1, Math.floor(quantity))
    );

    saveCartCount(newCount);
    return newCount;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return getCartCount();
  }
};

// ✅ Update cart count directly
export const updateCartCount = (newCount: number): number => {
  try {
    const validCount = Math.max(0, Math.floor(newCount));
    saveCartCount(validCount);
    return validCount;
  } catch (error) {
    console.error("Error updating cart count:", error);
    return getCartCount();
  }
};

// ✅ Clear cart
export const clearCart = (): void => {
  try {
    saveCartCount(0);
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};

// ✅ Export functions
export default {
  getCartCount,
  saveCartCount,
  addToCart,
  removeFromCart,
  updateCartCount,
  clearCart,
};
