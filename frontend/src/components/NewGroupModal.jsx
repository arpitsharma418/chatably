import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import {
  Close,
  Groups,
} from "../Icons/Icons.jsx";

export default function NewGroupModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (q) => {
    setQuery(q);
    if (!q.trim()) return setResults([]);
    try {
      const { data } = await api.get(`/users/search?query=${q}`);
      setResults(data.filter((u) => !selected.find((s) => s._id === u._id)));
    } catch {
      toast.error("Unable to find User");
    }
  };

  const addMember = (u) => {
    setSelected((prev) => [...prev, u]);
    setResults([]);
    setQuery("");
  };

  const removeMember = (id) => setSelected((prev) => prev.filter((u) => u._id !== id));

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Group name required");
    if (selected.length < 1) return toast.error("Add at least one member");
    setLoading(true);
    try {
      const { data } = await api.post("/groups", {
        name,
        description,
        members: selected.map((u) => u._id),
      });
      toast.success(`${name} group Created`);
      onCreated(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Groups className="text-orange-600" /> New Group
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <Close/>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Group Name *</label>
            <input className="input" placeholder="e.g. Engineers Vibes" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
            <input className="input" placeholder="Optional description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Add Members</label>
            <div className="relative">
              <input className="input" placeholder="Search users…" value={query} onChange={(e) => searchUsers(e.target.value)} />
            </div>
            {results.length > 0 && (
              <div className="mt-1 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                {results.map((u) => (
                  <button key={u._id} onClick={() => addMember(u)} className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 text-left text-sm">
                    <Avatar src={u.avatar} name={u.name} size="sm" />
                    <span className="font-medium text-gray-800">{u.name}</span>
                    <span className="text-gray-400 text-xs ml-auto">{u.email}</span>
                  </button>
                ))}
              </div>
            )}

            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selected.map((u) => (
                  <span key={u._id} className="chip">
                    {u.name}
                    <button onClick={() => removeMember(u._id)}>
                      <Close h={"15px"} w={"15px"}/>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleCreate} className="btn-success flex-1" disabled={loading}>
            {loading ? "Creating…" : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}
