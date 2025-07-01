import Cookies from "js-cookie";

export const getCart = () => {
  const cart = Cookies.get("cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    // console.log("exists", existing);
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  // console.log("In Cart:", cart);

  Cookies.set("cart", JSON.stringify(cart), { expires: 30 });
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
