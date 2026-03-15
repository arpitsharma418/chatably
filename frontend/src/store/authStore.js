import { create } from "zustand";
import api from "../lib/axios";
import { connectSocket, disconnectSocket } from "../lib/socket";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("chatably_token") || null,
  loading: true,

  init: async () => {
    const token = localStorage.getItem("chatably_token");
    if (!token) return set({ loading: false });
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data, token, loading: false });
      connectSocket(data._id);
    } catch {
      localStorage.removeItem("chatably_token");
      set({ user: null, token: null, loading: false });
    }
  },

  register: async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("chatably_token", data.token);
    set({ user: data.user, token: data.token });
    connectSocket(data.user._id);
    return data;
  },

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("chatably_token", data.token);
    set({ user: data.user, token: data.token });
    connectSocket(data.user._id);
    return data;
  },

  logout: () => {
    localStorage.removeItem("chatably_token");
    disconnectSocket();
    set({ user: null, token: null });
  },

  updateUser: (updatedUser) => set({ user: updatedUser }),
}));
