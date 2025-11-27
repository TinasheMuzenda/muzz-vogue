import { useAuth } from "../../contexts/AuthContext.jsx";
import { useState } from "react";
import api from "../../services/api.jsx";

export default function ProfileSection() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    address: user?.address || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");

  const updateUser = async () => {
    const updated = { ...form };
    let avatarUrl = null;

    try {
      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);

        const resUpload = await api.post("/users/upload-avatar", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        avatarUrl = resUpload.data.url;
        updated.avatar = avatarUrl;
      }

      const res = await api.put("/users/profile", updated);
      setUser(res.data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating profile.");
    }
  };

  return (
    <div className="p-6 bg-(--deep) rounded-md border border-(--accent-dark)">
      <h2 className="text-2xl mb-4 text-(--accent)">Your Profile</h2>

      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2 bg-(--bg) border border-(--accent-dark) rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Mobile</label>
        <input
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          className="w-full px-3 py-2 bg-(--bg) border border-(--accent-dark) rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Address</label>
        <input
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full px-3 py-2 bg-(--bg) border border-(--accent-dark) rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Avatar</label>
        <input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} />
      </div>

      <button
        onClick={updateUser}
        className="px-4 py-2 bg-(--accent) text-(--deep) rounded"
      >
        Save Changes
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
