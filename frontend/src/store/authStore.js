import { create } from "zustand";
import api from "../lib/axios";
import { connectSocket, disconnectSocket } from "../lib/socket";

const TOKEN_KEY = "chatably_token";
const USER_KEY = "chatably_user";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const persistSession = (user, token) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem(TOKEN_KEY) || null,
  loading: false,

  init: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const cachedUser = getStoredUser();

    if (!token) {
      set({ user: null, token: null, loading: false });
      return;
    }

    if (cachedUser?._id) {
      set({ user: cachedUser, token, loading: false });
      connectSocket(cachedUser._id);
    } else {
      set({ loading: true });
    }

    try {
      const { data } = await api.get("/auth/me");
      persistSession(data, token);
      set({ user: data, token, loading: false });
      connectSocket(data._id);
    } catch {
      clearSession();
      disconnectSocket();
      set({ user: null, token: null, loading: false });
    }
  },

  register: async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    persistSession(data.user, data.token);
    set({ user: data.user, token: data.token, loading: false });
    connectSocket(data.user._id);
    return data;
  },

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistSession(data.user, data.token);
    set({ user: data.user, token: data.token, loading: false });
    connectSocket(data.user._id);
    return data;
  },

  logout: () => {
    clearSession();
    disconnectSocket();
    set({ user: null, token: null, loading: false });
  },

  updateUser: (updatedUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));
