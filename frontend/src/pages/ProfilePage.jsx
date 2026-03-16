import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import Avatar from "../components/Avatar";
import api from "../lib/axios";
import { LeftArrow } from "../Icons/Icons.jsx";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const trimmedName = form.name.trim();
    const trimmedBio = form.bio.trim();

    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", {
        name: trimmedName,
        bio: trimmedBio,
      });
      updateUser(data);
      setForm({
        name: data.name || "",
        bio: data.bio || "",
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition">
          <LeftArrow w="20px" h="20px" />
        </button>
        <h1 className="font-bold text-gray-900">Profile</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <Avatar src={user?.avatar} name={form.name || user?.name} size="xl" />
          <p className="mt-3 text-sm text-gray-400">{form.name}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your full name"
              maxLength={50}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Bio</label>
            <textarea
              className="input resize-none h-24"
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell something about yourself"
              maxLength={150}
            />
            <p className="text-xs text-gray-400 text-right mt-1">{form.bio.length}/150</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
            <input className="input bg-gray-50 text-gray-400 cursor-not-allowed" value={user?.email || ""} disabled />
          </div>

          <button onClick={handleSave} className="btn-success w-full py-3" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
