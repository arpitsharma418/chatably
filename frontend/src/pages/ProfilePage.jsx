import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Avatar from "../components/Avatar";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ChevronLeft, Camera, Save, User, FileText } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "", avatar: user?.avatar || "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2MB");
    const reader = new FileReader();
    reader.onload = () => setForm((p) => ({ ...p, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", form);
      updateUser(data);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-bold text-gray-900">Edit Profile</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Avatar src={form.avatar} name={form.name} size="xl" />
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-orange-700 transition">
              <Camera size={14} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <p className="mt-3 text-sm text-gray-400">Click the camera to change photo</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <User size={14} /> Full Name
            </label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <FileText size={14} /> Bio
            </label>
            <textarea
              className="input resize-none h-24"
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Tell something about yourself…"
              maxLength={150}
            />
            <p className="text-xs text-gray-400 text-right mt-1">{form.bio.length}/150</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
            <input className="input bg-gray-50 text-gray-400 cursor-not-allowed" value={user?.email} disabled />
          </div>

          <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2 py-3" disabled={loading}>
            <Save size={16} />
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
