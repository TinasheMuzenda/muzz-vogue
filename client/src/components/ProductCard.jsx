import { useCart } from "../contexts/CartContext.jsx";
import { useWishlist } from "../contexts/WishlistContext.jsx";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addItem } = useWishlist();

  return (
    <div
      className="
        bg-(--deep) rounded-md border border-(--accent-dark)
        p-3 hover:scale-[1.02] transition
      "
    >
      <img
        src={product.images?.[0]?.url}
        alt={product.title}
        className="w-full h-52 object-cover rounded"
      />

      <h2 className="mt-3 text-lg text-(--light)">{product.title}</h2>
      <p className="text-(--accent) font-semibold text-xl">
        ${product.price}
      </p>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => addToCart(product)}
          className="flex-1 px-3 py-2 rounded bg-(--accent) text-(--deep)"
        >
          Add to Cart
        </button>

        <button
          onClick={() => addItem(product._id)}
          className="px-3 py-2 rounded border border-(--accent) text-(--accent)"
        >
          ❤
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
