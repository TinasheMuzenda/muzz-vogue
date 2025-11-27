import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res1 = await api.get("/products?sort=-createdAt&limit=6");
        const res2 = await api.get("/products?sort=-sales&limit=6");

        // Ensure response data is an array
        setNewArrivals(Array.isArray(res1.data) ? res1.data : []);
        setTrending(Array.isArray(res2.data) ? res2.data : []);
      } catch (error) {
        console.error("Failed to load products:", error);
        setNewArrivals([]);
        setTrending([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="min-h-[85vh] flex flex-col justify-center items-center text-center p-6">
        <h1 className="text-5xl text-(--accent) font-bold mb-6">
          Quality Meets Affordability
        </h1>

        <p className="max-w-2xl text-lg opacity-90 mb-10">
          Original international brands and premium in-house clothing — crafted
          to bridge the gap between luxury and accessibility.
        </p>

        <div className="flex gap-4">
          <Link
            to="/catalog"
            className="px-8 py-3 bg-(--accent) text-(--deep) rounded"
          >
            Shop Now
          </Link>
          <Link
            to="/about"
            className="px-8 py-3 border border-(--accent) text-(--accent) rounded"
          >
            About Us
          </Link>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-3xl text-(--accent) mb-4">New Arrivals</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.isArray(newArrivals) && newArrivals.length > 0 ? (
              newArrivals.map((p) => <ProductCard key={p._id} product={p} />)
            ) : (
              <p>No new arrivals found.</p>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-3xl text-(--accent) mb-4">Trending</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.isArray(trending) && trending.length > 0 ? (
              trending.map((p) => <ProductCard key={p._id} product={p} />)
            ) : (
              <p>No trending products found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
