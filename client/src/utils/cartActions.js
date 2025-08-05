import Cookies from "js-cookie";

export const getCart = () => {
  const cart = Cookies.get("cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product) => {
  try {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      // Include everything except ingredients (which can be very long)
      const { ingredients, ...productWithoutIngredients } = product;
      
      cart.push({
        ...productWithoutIngredients,
        quantity: 1
      });
    }

    Cookies.set("cart", JSON.stringify(cart), { expires: 30 });
    console.log("Added to cart:", product.name);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};
export const subtractFromCart = (productId) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing && existing.quantity > 1) {
    existing.quantity -= 1;
  } else if (existing) {
    const updatedCart = cart.filter((item) => item.id !== productId);
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 30 });
    return;
  }

  Cookies.set("cart", JSON.stringify(cart), { expires: 30 });
};

export const removeFromCart = (productId) => {
  const cart = getCart().filter((item) => item.id !== productId);
  Cookies.set("cart", JSON.stringify(cart), { expires: 30 });
};
