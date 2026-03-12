import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [guestLoading, setGuestLoading] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);

  const validate = (values) => {
    const next = {};
    if (!values.email.trim()) {
      next.email = "Email is required.";
    }
    if (!values.password.trim()) {
      next.password = "Password is required.";
    }
    return next;
  };

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.id]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setFormError("");
    setSignInLoading(true);
    try {
      const res = await api.post("/api/login", form);
      setAuthUser(res.data);
      navigate("/");
    } catch (error) {
      console.log(error.response?.data || error);
      setFormError("Login failed. Check your credentials.");
    } finally {
      setSignInLoading(false);
    }
  };

  const handleGuest = async () => {
    setFormError("");
    setGuestLoading(true);
    try {
      const res = await api.post("/api/guest");
      setAuthUser(res.data);
      navigate("/");
    } catch (error) {
      console.log(error);
      setFormError("Guest login failed. Try again.");
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-8 sm:p-10">
        <div className="text-center">
          <span className="px-3 py-1 text-xs font-medium rounded-full border-1 border-orange-300 bg-orange-50 text-orange-500">
            Welcome Back
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Sign in to Chatably
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Please enter your details to continue.
          </p>
        </div>

        <button
          type="button"
          disabled={guestLoading}
          onClick={handleGuest}
          className="border-1 border-black/10 hover:bg-gray-100 opacity-70 py-2 text-sm font-medium w-full mt-4 rounded-xl transition-all cursor-pointer"
        >
          {guestLoading ? "Signing in..." : "Continue as guest"}
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10" />
          <span className="text-xs uppercase tracking-wider text-slate-400">
            Sign in with email
          </span>
          <div className="h-px flex-1 bg-black/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-xs font-semibold text-slate-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full py-2 px-3 text-sm rounded-xl mt-2 outline-0 border-1 border-black/10"
              onChange={handleChange}
              value={form.email}
            />
            {errors.email ? (
              <div className="mt-1 text-xs text-red-600">
                {errors.email}
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="text-xs font-semibold text-slate-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full py-2 px-3 text-sm rounded-xl mt-2 outline-0 border-1 border-black/10"
              onChange={handleChange}
              value={form.password}
            />
            {errors.password ? (
              <div className="mt-1 text-xs text-red-600">
                {errors.password}
              </div>
            ) : null}
          </div>

          {formError ? (
            <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-red-600">
              {formError}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-all cursor-pointer"
          >
            {signInLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm">
          <p>
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="font-semibold text-orange-500">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
