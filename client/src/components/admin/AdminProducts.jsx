import { useEffect, useState } from "react";
import api from "../../services/api.jsx";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    brand: "",
    gender: "",
    body: "",
    fabric: "",
    stock: "",
    sizes: "",
    colors: "",
    images: [],
  });

  const load = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    for (let f of files) formData.append("images", f);

    const res = await api.post("/products/upload", formData);
    setForm({ ...form, images: res.data });
  };

  const handleCreate = async () => {
    await api.post("/products", {
      ...form,
      sizes: form.sizes.split(",").map((s) => s.trim()),
      colors: form.colors.split(",").map((c) => c.trim()),
      images: form.images,
    });

    setForm({
      title: "",
      price: "",
      description: "",
      brand: "",
      gender: "",
      body: "",
      fabric: "",
      stock: "",
      sizes: "",
      colors: "",
      images: [],
    });

    load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    load();
  };

  const handleEdit = (p) => {
    setEditing(p._id);
    setForm({
      ...p,
      sizes: p.sizes.join(", "),
      colors: p.colors.join(", "),
    });
  };

  const handleUpdate = async () => {
    await api.put(`/products/${editing}`, {
      ...form,
      sizes: form.sizes.split(","),
      colors: form.colors.split(","),
      images: form.images,
    });

    setEditing(null);
    load();
  };

  return (
    <div className="text-(--light)">
      <div className="bg-(--deep) border border-(--accent-dark) p-6 rounded mb-10">
        <h2 className="text-2xl text-[var(--accent)] mb-4">
          {editing ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(form)
            .filter((k) => !["images"].includes(k))
            .map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="p-2 rounded bg-(--bg) border border-(--accent-dark)"
              />
            ))}

          <input
            type="file"
            multiple
            onChange={handleUpload}
            className="p-2 rounded bg-(--bg)"
          />
        </div>

        <button
          onClick={editing ? handleUpdate : handleCreate}
          className="mt-4 px-6 py-2 bg-(--accent) text-(--deep) rounded"
        >
          {editing ? "Update" : "Create"}
        </button>
      </div>

      <h2 className="text-2xl text-(--accent) mb-4">All Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="p-4 bg-(--deep) border border-(--accent-dark) rounded"
          >
            <img
              src={p.images?.[0]?.url}
              className="h-40 w-full object-cover rounded mb-3"
            />

            <h3 className="text-xl text-(--accent)">{p.title}</h3>
            <p className="opacity-80">${p.price}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(p)}
                className="px-3 py-1 bg-(--accent) text-(--deep) rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="px-3 py-1 bg-red-500 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
