import { create } from "zustand";
import api from "../lib/axios";
import { getSocket } from "../lib/socket";

export const useChatStore = create((set, get) => ({
  activeChat: null,
  messages: [],
  onlineUsers: [],
  typingUser: null,

  setActiveChat: (chat) => set({ activeChat: chat, messages: [] }),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  // DM
  fetchDMMessages: async (userId) => {
    const { data } = await api.get(`/messages/dm/${userId}`);
    set({ messages: data });
  },

  sendDMMessage: async (userId, content) => {
    await api.post(`/messages/dm/${userId}`, { content });
  },

  // Group
  fetchGroupMessages: async (groupId) => {
    const { data } = await api.get(`/messages/group/${groupId}`);
    set({ messages: data });
  },

  sendGroupMessage: async (groupId, content) => {
    await api.post(`/messages/group/${groupId}`, { content });
  },

  //Socket listeners
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setTypingUser: (name) => set({ typingUser: name }),
  clearTypingUser: () => set({ typingUser: null }),
}));
