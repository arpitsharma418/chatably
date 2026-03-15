import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { getSocket } from "../lib/socket";
import Avatar from "./Avatar";
import { Send, Users} from "lucide-react";
import toast from "react-hot-toast";
import { LeftArrow, Groups } from "../Icons/Icons.jsx";

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ChatWindow({ chat, onBack }) {
  const { user } = useAuthStore();
  const { messages, fetchDMMessages, fetchGroupMessages, sendDMMessage, sendGroupMessage, addMessage, setTypingUser, clearTypingUser, typingUser, onlineUsers } = useChatStore();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    if (!chat) return;

    // Load messages
    if (chat.type === "dm") fetchDMMessages(chat.id);
    else fetchGroupMessages(chat.id);

    // Join socket room
    socket.emit("room:join", chat.roomId);

    // Listen for new messages
    const onMessage = (msg) => addMessage(msg);
    socket.on("message:new", onMessage);

    // Typing events
    socket.on("typing:start", ({ userName }) => setTypingUser(userName));
    socket.on("typing:stop", () => clearTypingUser());

    return () => {
      socket.emit("room:leave", chat.roomId);
      socket.off("message:new", onMessage);
      socket.off("typing:start");
      socket.off("typing:stop");
    };
  }, [chat?.roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (val) => {
    setInput(val);
    socket.emit("typing:start", { roomId: chat.roomId, userName: user.name });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing:stop", { roomId: chat.roomId });
    }, 1000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      if (chat.type === "dm") await sendDMMessage(chat.id, input.trim());
      else await sendGroupMessage(chat.id, input.trim());
      setInput("");
      socket.emit("typing:stop", { roomId: chat.roomId });
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Group messages by date
  const grouped = messages.reduce((acc, msg) => {
    const label = formatDateLabel(msg.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(msg);
    return acc;
  }, {});

  const isOnline = chat?.type === "dm" && onlineUsers.includes(chat?.id);

  if (!chat) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center p-8">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
        <Send size={32} className="text-orange-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-700 mb-2">Welcome to Chatably</h2>
      <p className="text-gray-400 text-sm max-w-xs">Search for a person to start chatting, or pick a group from the sidebar.</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <button onClick={onBack} className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
          <LeftArrow w={"20px"} h={"20px"}/>
        </button>
        <Avatar src={chat.avatar} name={chat.name} size="md" online={isOnline} />
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 truncate">{chat.name}</h2>
          <p className="text-xs text-gray-400">
            {chat.type === "group"
              ? `${chat.members?.length ?? ""} members`
              : isOnline ? "Online" : "Offline"}
          </p>
        </div>
        {chat.type === "group" && (
          <button onClick={() => setShowMembers((p) => !p)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition">
            <Groups h={"20px"} w={"20px"} />
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {Object.entries(grouped).map(([label, msgs]) => (
            <div key={label}>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">{label}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              {msgs.map((msg, i) => {
                const isMe = msg.sender._id === user._id || msg.sender === user._id;
                const senderId = msg.sender._id || msg.sender;
                const prevSender = i > 0 ? (msgs[i - 1].sender._id || msgs[i - 1].sender) : null;
                const showAvatar = !isMe && senderId !== prevSender;

                return (
                  <div key={msg._id} className={`flex items-end gap-2 mb-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    {!isMe && (
                      <div className="w-7 flex-shrink-0">
                        {showAvatar && <Avatar src={msg.sender.avatar} name={msg.sender.name} size="sm" />}
                      </div>
                    )}
                    <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                      {!isMe && showAvatar && chat.type === "group" && (
                        <p className="text-xs font-medium text-gray-500 mb-0.5 ml-1">{msg.sender.name}</p>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-orange-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 mx-1">{formatTime(msg.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {typingUser && (
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-gray-100 rounded-2xl px-4 py-2.5 text-xs text-gray-500 flex items-center gap-2">
                <span className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
                {typingUser} is typing
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Group members panel */}
        {showMembers && chat.type === "group" && (
          <div className="w-60 border-l border-gray-100 bg-gray-50 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Members ({chat.members?.length})</h3>
            </div>
            <div className="overflow-y-auto flex-1 p-3 space-y-1">
              {chat.members?.map((m) => (
                <div key={m._id} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white transition">
                  <Avatar src={m.avatar} name={m.name} size="sm" online={onlineUsers.includes(m._id)} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                    <p className="text-xs text-gray-400 truncate">{m.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-300 transition">
          <input
            type="text"
            placeholder={`Message ${chat.name}…`}
            className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
            value={input}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(e)}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="p-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-xl transition flex-shrink-0"
          >
            <Send size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}
