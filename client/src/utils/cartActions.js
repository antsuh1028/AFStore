import Cookies from "js-cookie";

const readCartsBucket = () => {
  try {
    const raw = localStorage.getItem("carts");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("Failed to read carts from localStorage:", e);
    return {};
  }
};

const writeCartsBucket = (obj) => {
  try {
    localStorage.setItem("carts", JSON.stringify(obj));
  } catch (e) {
    console.warn("Failed to write carts to localStorage:", e);
  }
};

export const getCart = (identifier) => {
  try {
    if (identifier) {
      const buckets = readCartsBucket();
      return (buckets[identifier] && Array.isArray(buckets[identifier].items))
        ? buckets[identifier].items
        : [];
    }
    const cart = Cookies.get("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (err) {
    console.error("Error getting cart:", err);
    return [];
  }
};

export const addToCart = (product, identifier) => {
  try {
    if (identifier) {
      const buckets = readCartsBucket();
      if (!buckets[identifier]) buckets[identifier] = { items: [] };
      const items = buckets[identifier].items;
      const existing = items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        const { ingredients, ...productWithoutIngredients } = product;
        items.push({
          ...productWithoutIngredients,
          quantity: 1,
        });
      }

      buckets[identifier].items = items;
      writeCartsBucket(buckets);
      return;
    }

    // cookie fallback
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      const { ingredients, ...productWithoutIngredients } = product;
      cart.push({
        ...productWithoutIngredients,
        quantity: 1,
      });
    }
    Cookies.set("cart", JSON.stringify(cart), { expires: 30 });
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

export const subtractFromCart = (productId, identifier) => {
  try {
    if (identifier) {
      const buckets = readCartsBucket();
      const items = (buckets[identifier] && buckets[identifier].items) || [];
      const existing = items.find((item) => item.id === productId);

      if (existing && existing.quantity > 1) {
        existing.quantity -= 1;
        buckets[identifier].items = items;
      } else if (existing) {
        buckets[identifier].items = items.filter((i) => i.id !== productId);
      }
      writeCartsBucket(buckets);
      return;
    }

    // cookie fallback
    const cart = getCart();
    const existing = cart.find((item) => item.id === productId);

    if (existing && existing.quantity > 1) {
      existing.quantity -= 1;
      Cookies.set("cart", JSON.stringify(cart), { expires: 30 });
      return;
    } else if (existing) {
      const updatedCart = cart.filter((item) => item.id !== productId);
      Cookies.set("cart", JSON.stringify(updatedCart), { expires: 30 });
      return;
    }
  } catch (err) {
    console.error("Error subtracting from cart:", err);
  }
};

export const removeFromCart = (productId, identifier) => {
  try {
    if (identifier) {
      const buckets = readCartsBucket();
      const items = (buckets[identifier] && buckets[identifier].items) || [];
      buckets[identifier] = { items: items.filter((i) => i.id !== productId) };
      writeCartsBucket(buckets);
      return;
    }

    // cookie fallback
    const cart = getCart().filter((item) => item.id !== productId);
    Cookies.set("cart", JSON.stringify(cart), { expires: 30 });
  } catch (err) {
    console.error("Error removing from cart:", err);
  }
};

// optional helper to clear an identifier's cart
export const clearCart = (identifier) => {
  try {
    if (identifier) {
      const buckets = readCartsBucket();
      delete buckets[identifier];
      writeCartsBucket(buckets);
      return;
    }
    Cookies.remove("cart");
  } catch (err) {
    console.error("Error clearing cart:", err);
  }
};
