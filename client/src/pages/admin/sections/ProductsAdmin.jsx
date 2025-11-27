import { useEffect, useState } from "react";
import api from "../../../services/api.jsx";
import ProductForm from "../../../components/admin/ProductForm.jsx";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const del = async (id) => {
    if (!confirm("Delete product?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(true)}
        className="mb-4 px-4 py-2 bg-(--accent) text-(--deep) rounded"
      >
        + Add Product
      </button>

      {showForm && (
        <ProductForm
          onClose={() => {
            setShowForm(false);
            load();
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div
            key={p._id}
            className="p-4 bg-(--deep) rounded border border-(--accent-dark)"
          >
            <img
              src={p.images?.[0]?.url}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-xl mt-3">{p.title}</h2>
            <p className="text-(--accent)">${p.price}</p>
            <p className="mt-1">{p.stock} in stock</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => del(p._id)}
                className="flex-1 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
}
