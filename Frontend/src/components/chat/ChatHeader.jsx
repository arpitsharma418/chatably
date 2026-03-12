import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useSocket } from "../../context/SocketContext";
import { IconMenu } from "../UI";
import { getConversationPeer } from "./chatUtils";

export default function ChatHeader({ onOpenContacts = () => {} }) {
  const { authUser } = useAuth();
  const { selectedConvo } = useChat();
  const { onlineUsers } = useSocket();

  const selectedUser = getConversationPeer(selectedConvo, authUser?.id);
  const isOnline = selectedUser ? onlineUsers.includes(selectedUser._id) : false;

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center border-b border-blue-100 bg-white/95 px-4 backdrop-blur">
      <button
        className="mr-2 rounded-full p-2 text-blue-700 hover:bg-blue-100 sm:hidden"
        onClick={onOpenContacts}
        aria-label="Open contacts"
      >
        <IconMenu />
      </button>
      <div className="flex flex-1 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
          {selectedUser?.fullName?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="text-sm">
          <h1 className="font-semibold">{selectedUser?.fullName || "Unknown User"}</h1>
          <p className={isOnline ? "text-emerald-600" : "text-slate-500"}>
            {isOnline ? "online" : "offline"}
          </p>
        </div>
      </div>
    </header>
  );
}
