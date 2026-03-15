import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { getSocket } from "../lib/socket";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage() {
  const { user } = useAuthStore();
  const { activeChat, setActiveChat, setOnlineUsers } = useChatStore();
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    // Listen for online users list
    socket.on("users:online", (users) => setOnlineUsers(users));
    return () => socket.off("users:online");
  }, []);

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setMobileChatOpen(true);
  };

  const handleBack = () => {
    setMobileChatOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className={`
        w-full md:w-80 lg:w-96 flex-shrink-0 h-full
        ${mobileChatOpen ? "hidden md:flex" : "flex"}
      `}>
        <Sidebar onChatSelect={handleChatSelect} />
      </div>

      {/* Chat Window */}
      <div className={`
        flex-1 h-full
        ${mobileChatOpen ? "flex" : "hidden md:flex"}
      `}>
        <ChatWindow chat={activeChat} onBack={handleBack} />
      </div>
    </div>
  );
}
