import { useEffect, useState } from "react";
import api from "../services/api.jsx";
import ProductCard from "../components/ProductCard.jsx";

const genders = ["male", "female", "unisex"];
const bodyTypes = ["top", "bottom"];
const fabricTypes = ["cotton", "denim", "wool", "linen", "polyester"];

export default function Categories() {
  const [products, setProducts] = useState([]);
  const [gender, setGender] = useState("");
  const [body, setBody] = useState("");
  const [fabric, setFabric] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);

    const params = {};
    if (gender) params.gender = gender;
    if (body) params.body = body;
    if (fabric) params.fabric = fabric;

    const res = await api.get("/products", { params });
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [gender, body, fabric]);

  return (
    <div className="min-h-screen p-6 text-(--light)">
      <h1 className="text-4xl text-(--accent) font-semibold mb-6">
        Browse Categories
      </h1>

      <div className="bg-(--deep) border border-(--accent-dark) p-4 rounded mb-8">
        <div className="mb-4">
          <h3 className="text-(--accent) mb-2">Gender</h3>
          <div className="flex gap-2 flex-wrap">
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => setGender(g === gender ? "" : g)}
                className={`
                  px-3 py-1 rounded border
                  ${
                    gender === g
                      ? "bg-(--accent) text-(--deep)"
                      : "border-(--accent-dark)"
                  }
                `}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-(--accent) mb-2">Body Type</h3>
          <div className="flex gap-2 flex-wrap">
            {bodyTypes.map((b) => (
              <button
                key={b}
                onClick={() => setBody(b === body ? "" : b)}
                className={`
                  px-3 py-1 rounded border
                  ${
                    body === b
                      ? "bg-(--accent) text-(--deep)"
                      : "border-(--accent-dark)"
                  }
                `}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-(--accent) mb-2">Fabric</h3>
          <div className="flex gap-2 flex-wrap">
            {fabricTypes.map((f) => (
              <button
                key={f}
                onClick={() => setFabric(f === fabric ? "" : f)}
                className={`
                  px-3 py-1 rounded border
                  ${
                    fabric === f
                      ? "bg-(--accent) text-(--deep)"
                      : "border-(--accent-dark)"
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <p className="opacity-70">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}

          {products.length === 0 && (
            <p className="opacity-70">No products match selected filters.</p>
          )}
        </div>
      )}
    </div>
  );
}
