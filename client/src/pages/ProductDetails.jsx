import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { useWishlist } from "../contexts/WishlistContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addItem } = useWishlist();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    };
    load();
  }, [id]);

  if (!product) return <p className="p-6">Loading...</p>;

  const handleAdd = () => {
    if (!selectedSize || !selectedColor) {
      setMsg("Select size and color first.");
      return;
    }

    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
      qty: 1,
    });

    setMsg("Added to cart!");
  };

  return (
    <div className="min-h-screen p-6 text-(--light) flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <img
          src={product.images?.[activeImg]?.url}
          alt={product.title}
          className="w-full h-96 object-cover rounded border border-(--accent-dark)"
        />

        <div className="flex gap-3 mt-4">
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={img.url}
              onClick={() => setActiveImg(i)}
              className={`
                w-20 h-20 object-cover rounded cursor-pointer border 
                ${
                  activeImg === i
                    ? "border-(--accent)"
                    : "border-(--accent-dark) opacity-70"
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* RIGHT column - info */}
      <div className="flex-1 bg-(--deep) p-6 rounded border border-(--accent-dark)">
        <h1 className="text-3xl text-(--accent)">{product.title}</h1>

        <p className="mt-2 text-xl text-(--accent)">${product.price}</p>

        <p className="mt-4 opacity-90">{product.description}</p>

        <p className="mt-3 text-sm opacity-80">
          Brand: {product.brand} • Gender: {product.gender}
        </p>

        {/* Sizes */}
        <div className="mt-4">
          <h3 className="text-(--accent) mb-2">Sizes</h3>
          <div className="flex gap-2 flex-wrap">
            {product.sizes?.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`
                  px-3 py-1 rounded border
                  ${
                    selectedSize === s
                      ? "bg-(--accent) text-(--deep)"
                      : "bg-(--bg) text-(--light) border-(--accent-dark)"
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-(--accent) mb-2">Colors</h3>
          <div className="flex gap-2 flex-wrap">
            {product.colors?.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`
                  px-3 py-1 rounded border
                  ${
                    selectedColor === c
                      ? "bg-(--accent) text-(--deep)"
                      : "bg-(--bg) text-(--light) border-(--accent-dark)"
                  }
                `}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* STOCK */}
        <p className="mt-4 opacity-75">
          Stock: {product.stock > 0 ? product.stock : "Out of stock"}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded bg-(--accent) text-(--deep)"
          >
            Add to Cart
          </button>

          <button
            onClick={() => addItem(product._id)}
            className="px-4 py-2 rounded border border-(--accent) text-(--accent)"
          >
            ♥ Wishlist
          </button>
        </div>

        {msg && <p className="mt-3">{msg}</p>}
      </div>
    </div>
  );
}
