import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  updateUser,
  uploadAvatar,
  changePassword,
} from "../services/userService";
import { emailRegex, mobileRegex } from "../utils/Validators.jsx";

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    address: user?.address || "",
    mobile: user?.mobile || "",
    payment: user?.payment || "",
  });

  const [passForm, setPassForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "");

  const handleSave = async () => {
    if (!emailRegex.test(form.email)) return alert("Invalid email format");
    if (!mobileRegex.test(form.mobile)) return alert("Invalid mobile number");

    const res = await updateUser(form);
    setUser(res.data.user);
    alert("Profile updated");
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("avatar", file);

    const res = await uploadAvatar(fd);
    setAvatarPreview(res.data.url);
    setUser(res.data.user);
  };

  const handlePassword = async () => {
    if (!passForm.oldPassword || !passForm.newPassword)
      return alert("Fill all password fields");

    await changePassword(passForm);
    setPassForm({ oldPassword: "", newPassword: "" });
    alert("Password changed");
  };

  return (
    <div className="min-h-screen p-6 text-(--light)">
      <h1 className="text-4xl text-(--accent) mb-8">Your Profile</h1>

      <div className="mb-8">
        <img
          src={avatarPreview}
          className="w-32 h-32 rounded-full object-cover border border-(--accent-dark)"
        />

        <input type="file" onChange={handleAvatar} className="mt-3" />
      </div>

      <div className="bg-(--deep) border border-(--accent-dark) p-6 rounded mb-10">
        <h2 className="text-2xl text-(--accent) mb-4">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              type="text"
              value={form[key]}
              placeholder={key}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="p-2 rounded bg-(--bg) border border-(--accent-dark)"
            />
          ))}
        </div>

        <button
          onClick={handleSave}
          className="mt-4 px-6 py-2 bg-(--accent) text-(--deep) rounded"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-(--deep) border border-(--accent-dark) p-6 rounded">
        <h2 className="text-2xl text-(--accent) mb-4">Change Password</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="password"
            placeholder="Old Password"
            value={passForm.oldPassword}
            onChange={(e) =>
              setPassForm({ ...passForm, oldPassword: e.target.value })
            }
            className="p-2 rounded bg-(--bg) border border-(--accent-dark)"
          />

          <input
            type="password"
            placeholder="New Password"
            value={passForm.newPassword}
            onChange={(e) =>
              setPassForm({ ...passForm, newPassword: e.target.value })
            }
            className="p-2 rounded bg-(--bg) border border-(--accent-dark)"
          />
        </div>

        <button
          onClick={handlePassword}
          className="mt-4 px-6 py-2 bg-(--accent) text-(--deep) rounded"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
