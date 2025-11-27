// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div className="min-h-screen">
//       <div className="min-h-[70vh] flex flex-col justify-center items-center text-center">
//         <h1 className="text-5xl lg:text-6xl font-bold text-(--accent) drop-shadow mb-6">
//           Quality Meets Affordability
//         </h1>

//         <p className="max-w-2xl text-lg opacity-90 mb-10">
//           Original international brands and premium in-house clothing — crafted
//           to bridge the gap between luxury and accessibility.
//         </p>

//         <div className="flex gap-4">
//           <Link
//             to="/catalog"
//             className="
//             px-8 py-3 rounded bg-(--accent)
//             text-(--deep) font-semibold text-lg
//           "
//           >
//             Shop Now
//           </Link>

//           <Link
//             to="/about"
//             className="
//             px-8 py-3 rounded border border-(--accent)
//             text-(--accent) text-lg
//           "
//           >
//             About Us
//           </Link>
//         </div>

//         <div className="absolute opacity-20 text-sm">
//           Inspired. Designed. Delivered.
//         </div>
//       </div>
//     </div>
//   );
// }

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res1 = await api.get("/products?sort=-createdAt&limit=6");
      const res2 = await api.get("/products?sort=-sales&limit=6");

      setNewArrivals(res1.data);
      setTrending(res2.data);
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-3xl text-(--accent) mb-4">Trending</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trending.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
