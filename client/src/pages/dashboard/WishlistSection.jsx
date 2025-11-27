import { useWishlist } from "../../contexts/WishlistContext.jsx";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { getWishlist } from "../../services/wishlistService.jsx";
import api from "../../services/api.jsx";

export default function WishlistSection() {
  const { setWishlist, removeItem } = useWishlist();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    const load = async () => {
      try {
        const res = await getWishlist(user._id);
        const rawItems = res.data.items;

        const detailedItems = await Promise.all(
          rawItems.map(async (i) => {
            try {
              const productRes = await api.get(`/products/${i.productId}`);
              const p = productRes.data;

              return {
                _id: p._id,
                title: p.name,
                price: p.price,
                images: p.image
                  ? [{ url: p.image }]
                  : p.images
                  ? p.images.map((img) => ({ url: img }))
                  : [],
              };
            } catch {
              return null;
            }
          })
        );

        const filtered = detailedItems.filter(Boolean);

        setWishlist(filtered);
      } catch (err) {
        console.error("Wishlist loading error:", err);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, setWishlist]);

  const { wishlist } = useWishlist();

  if (loading) {
    return <p className="text-sm opacity-70">Loading wishlist…</p>;
  }

  return (
    <div>
      <h2 className="text-2xl mb-4 text-(--accent)">Your Wishlist</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {wishlist.map((item) => (
          <div
            key={item._id}
            className="p-3 bg-(--deep) border border-(--accent-dark) rounded-md"
          >
            <img
              src={item.images?.[0]?.url || "/placeholder.jpg"}
              alt={item.title}
              className="w-full h-40 object-cover rounded"
            />

            <p className="mt-2">{item.title}</p>

            <p className="text-(--accent)">${item.price}</p>

            <div className="flex gap-2 mt-3">
              <Link
                to={`/product/${item._id}`}
                className="flex-1 px-3 py-1 bg-(--accent) text-(--deep) text-center rounded"
              >
                View
              </Link>

              <button
                onClick={() => removeItem(item._id)}
                className="px-3 py-1 border border-(--accent) text-(--accent) rounded"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {wishlist.length === 0 && <p>No items in wishlist.</p>}
      </div>
    </div>
  );
}
