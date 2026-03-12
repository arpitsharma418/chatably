import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IconUser } from "./UI.jsx";
import api from "../lib/api.js";

function ProfileSection() {
  const { authUser, setAuthUser, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    password: "",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadProfile = async () => {
      setLoadingProfile(true);
      setError("");
      try {
        const res = await api.get("/api/profile");
        setForm({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          password: "",
        });
      } catch (err) {
        console.log(err);
        setError("Could not load profile.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [open]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
      };
      if (form.password.trim()) {
        payload.password = form.password;
      }

      const res = await api.patch("/api/profile", payload);
      setAuthUser({
        id: res.data.id,
        fullName: res.data.fullName,
        email: res.data.email,
        isGuest: res.data.isGuest,
      });
      setForm((prev) => ({ ...prev, password: "" }));
      setSuccess("Profile updated.");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      "Delete your account permanently? This cannot be undone.",
    );
    if (!shouldDelete) {
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess("");
    try {
      await api.delete("/api/profile");
      setAuthUser(null);
      navigate("/signup");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data || "Failed to delete account.");
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full p-2 text-blue-700 hover:bg-blue-100"
      >
        <IconUser />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-blue-100 bg-white p-6 shadow-2xl">
            <div className="text-lg font-semibold text-slate-900 flex justify-between items-center">
              <div>Your Profile</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-orange-50"
              >
                Close
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Update your details or delete your account.
            </p>

            <form onSubmit={handleSave} className="mt-4 space-y-3">
              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="profile-name"
              >
                Full Name
              </label>
              <input
                id="profile-name"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                disabled={loadingProfile}
                className="w-full rounded-xl border border-black/10 text-black px-3 py-2 text-sm outline-none"
              />

              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="profile-email"
              >
                Email
              </label>
              <input
                id="profile-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={loadingProfile}
                className="w-full rounded-xl border border-black/10 text-black px-3 py-2 text-sm outline-none"
              />

              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="profile-password"
              >
                New Password (optional)
              </label>
              <input
                id="profile-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave empty to keep current password"
                disabled={loadingProfile}
                className="text-black w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none"
              />

              {error ? <p className="text-xs text-rose-600">{error}</p> : null}
              {success ? (
                <p className="text-xs text-blue-700">{success}</p>
              ) : null}

              <div className="flex items-center justify-between gap-2 pt-2">
                <div className="space-x-3">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting || saving}
                    className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                  >
                    {deleting ? "Deleting..." : "Delete account"}
                  </button>

                  <button
                    type="button"
                    className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={saving || loadingProfile}
                    className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-blue-300 cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ProfileSection;
