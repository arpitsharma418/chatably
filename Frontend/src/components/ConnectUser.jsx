import { useState } from "react";
import { IconPlus } from "./UI.jsx";
import api from "../lib/api.js";

function ConnectUser() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmail("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.post("/api/conversation", { email });
      handleClose();
    } catch (error) {
      console.log(error);
      setError("Could not create a conversation. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClickOpen}
        className="rounded-full p-2 text-blue-700 hover:bg-blue-100"
      >
        <IconPlus />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={handleClose} />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-2xl"
          >
            <h2 className="text-lg font-semibold text-orange-500">Connect</h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter the email you want to connect with.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-slate-700" htmlFor="connect-email">
                Email Address
              </label>
              <input
                autoFocus
                required
                id="connect-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-black/10 text-black px-3 py-2 text-sm outline-none"
                placeholder="name@example.com"
              />
              {error ? <div className="text-xs text-rose-600">{error}</div> : null}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-orange-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:bg-orange-300 cursor-pointer"
                >
                  {submitting ? "Connecting..." : "Connect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ConnectUser;