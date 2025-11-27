import { useWishlist } from "../../contexts/WishlistContext.jsx";
import { Link } from "react-router-dom";

export default function WishlistSection() {
  const { wishlist, removeItem } = useWishlist();

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
              src={item.images?.[0]?.url}
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
