import { useState } from "react";
import api from "../../services/api.jsx";

export default function ProductForm({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    gender: "",
    colors: "",
    sizes: "",
    fabric: "",
  });

  const [images, setImages] = useState([]);
  const [msg, setMsg] = useState("");

  const submit = async () => {
    try {
      const fd = new FormData();
      Object.keys(form).forEach((f) => fd.append(f, form[f]));
      images.forEach((img) => fd.append("images", img));

      const res = await api.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("Product created");
      onClose();
    } catch (err) {
      setMsg("Error creating product");
    }
  };

  return (
    <div className="p-6 bg-(--deep) border border-(--accent-dark) rounded relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-red-400">
        ✕
      </button>

      <h2 className="text-2xl text-(--accent) mb-4">Add Product</h2>

      <div className="grid grid-cols-2 gap-3">
        {Object.keys(form).map((k) => (
          <input
            key={k}
            placeholder={k}
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            className="px-3 py-2 bg-(--bg) border border-(--accent-dark) rounded"
          />
        ))}
      </div>

      <input
        multiple
        type="file"
        onChange={(e) => setImages([...e.target.files])}
        className="mt-3"
      />

      <button
        onClick={submit}
        className="block mt-4 px-4 py-2 bg-(--accent) text-(--deep) rounded"
      >
        Create
      </button>

      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
