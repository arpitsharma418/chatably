import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import Avatar from "./Avatar";
import NewGroupModal from "./NewGroupModal";
import api from "../lib/axios";
import toast from "react-hot-toast";
import {
  Settings,
  Logout,
  Close,
  Groups,
} from "../Icons/Icons.jsx";

export default function Sidebar({ onChatSelect }) {
  const { user, logout } = useAuthStore();
  const { activeChat, onlineUsers } = useChatStore();

  const [tab, setTab] = useState("dms"); // 'dms' | 'groups'
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const navigate = useNavigate();

  // Search users for DM
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchQuery.trim().length < 1) return setSearchResults([]);
      try {
        const { data } = await api.get(`/users/search?query=${searchQuery}`);
        setSearchResults(data);
      } catch {
        toast.error("Faild to load contacts");
      }
    }, 1500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

   // Load groups
  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const { data } = await api.get("/groups");
      setGroups(data);
    } catch {
      toast.error("Failed to load groups");
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    if (tab === "groups") {
      fetchGroups();
    }
  }, [tab]);

  const handleUserClick = (u) => {
    const roomId = [user._id, u._id].sort().join("-");
    onChatSelect({
      type: "dm",
      id: u._id,
      roomId,
      name: u.name,
      avatar: u.avatar,
    });
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleGroupClick = (g) => {
    onChatSelect({
      type: "group",
      id: g._id,
      roomId: g._id,
      name: g.name,
      avatar: g.avatar,
      members: g.members,
    });
  };

  const handleGroupCreated = (group) => {
    setGroups((prev) => [group, ...prev]);
    setShowGroupModal(false);
    handleGroupClick(group);
  };

  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-100 w-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900">Chatably</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate("/profile")}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition"
            >
              <Settings />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition"
            >
              <Logout />
            </button>
          </div>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 px-1">
          <Avatar src={user?.avatar} name={user?.name} size="sm" online />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center border rounded-xl pl-2 pr-1.5 bg-gray-50">
          <input
            type="text"
            placeholder="Search people..."
            className="w-full pl-3 py-2.5 text-sm outline-none bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <div
              className="cursor-pointer pr-1.5"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
            >
              <Close />
            </div>
          )}
        </div>
      </div>

      {/* Search results dropdown */}
      {searchResults.length > 0 && (
        <div className="mx-4 mb-2 bg-white border border-gray-100 rounded-xl overflow-hidden">
          {searchResults.map((u) => (
            <button
              key={u._id}
              onClick={() => handleUserClick(u)}
              className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 transition text-left"
            >
              <Avatar
                src={u.avatar}
                name={u.name}
                size="sm"
                online={onlineUsers.includes(u._id)}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {u.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{u.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 pb-2 mt-2">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setTab("dms")}
            className={`w-[50%] text-xs font-medium py-3 rounded-lg transition ${tab === "dms" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
          >
            Direct
          </button>
          <button
            onClick={() => setTab("groups")}
            className={`w-[50%] text-xs font-medium py-1.5 rounded-lg transition ${tab === "groups" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
          >
            Groups
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2">
        {tab === "dms" && (
          <div className="py-2 text-center">
            <p className="text-xs mt-10 opacity-60">
              Search for someone to chat
            </p>
          </div>
        )}

        {tab === "groups" && (
          <div className="py-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <p className="text-xs font-medium text-gray-400">Your Groups</p>
              <button
                onClick={() => setShowGroupModal(true)}
                className="text-xs text-green-600 font-medium hover:underline"
              >
                Create New
              </button>
            </div>

            {loadingGroups ? (
              <div className="text-center py-8 text-sm text-gray-400">
                Loading...
              </div>
            ) : groups.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center">
                <Groups />
                <p className="text-sm text-gray-400">No groups yet</p>
                <button
                  onClick={() => setShowGroupModal(true)}
                  className="text-xs text-green-600 font-medium hover:underline"
                >
                  Create one
                </button>
              </div>
            ) : (
              groups.map((g) => (
                <button
                  key={g._id}
                  onClick={() => handleGroupClick(g)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition text-left mb-0.5 ${activeChat?.id === g._id ? "bg-orange-50 text-orange-700" : "hover:bg-gray-50"}`}
                >
                  <Avatar src={g.avatar} name={g.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{g.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {g.members.length} members
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {showGroupModal && (
        <NewGroupModal
          onClose={() => setShowGroupModal(false)}
          onCreated={handleGroupCreated}
        />
      )}
    </aside>
  );
}
