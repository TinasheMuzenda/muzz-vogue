import { createContext, useContext, useEffect, useState } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService.jsx";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const loadWishlist = async () => {
    try {
      const res = await getWishlist();
      setItems(res.data.items || []);
    } catch (_) {
      setItems([]);
    }
  };

  const addItem = async (productId) => {
    await addToWishlist(productId);
    await loadWishlist();
  };

  const removeItem = async (productId) => {
    await removeFromWishlist(productId);
    await loadWishlist();
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, refresh: loadWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
