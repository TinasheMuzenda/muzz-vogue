import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart_items");
    return saved ? JSON.parse(saved) : [];
  });

  const [deliveryMethod, setDeliveryMethod] = useState("collect");

  const saveCart = (items) => {
    setCart(items);
    localStorage.setItem("cart_items", JSON.stringify(items));
  };

  const addToCart = (product, qty = 1) => {
    const existing = cart.find((i) => i._id === product._id);
    if (existing) {
      const updated = cart.map((item) =>
        item._id === product._id ? { ...item, qty: item.qty + qty } : item
      );
      return saveCart(updated);
    }
    saveCart([...cart, { ...product, qty }]);
  };

  const removeFromCart = (id) => saveCart(cart.filter((i) => i._id !== id));

  const updateQty = (id, qty) => {
    const updated = cart.map((i) => (i._id === id ? { ...i, qty } : i));
    saveCart(updated);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const comboDiscount = subtotal * 0.1;

  const deliveryFee =
    deliveryMethod === "deliver"
      ? subtotal > 150
        ? +(subtotal * 0.05).toFixed(2)
        : 9
      : 0;

  const total = +(subtotal - comboDiscount + deliveryFee).toFixed(2);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        subtotal,
        comboDiscount,
        deliveryFee,
        total,
        deliveryMethod,
        setDeliveryMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
