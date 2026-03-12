import { useChat } from "../context/ChatContext";
import { IconMenu } from "./UI";
import ChatBody from "./chat/ChatBody";
import ChatHeader from "./chat/ChatHeader";

export default function ChatLayout({ onOpenContacts = () => {} }) {
  const { selectedConvo } = useChat();

  return (
    <div className="flex max-h-screen flex-1 flex-col bg-gradient-to-b from-blue-50/70 to-white">
      {selectedConvo ? (
        <ChatHeader onOpenContacts={onOpenContacts} />
      ) : (
        <div className="flex h-[10vh] w-full items-center border-b border-blue-100 bg-white/90 px-4 backdrop-blur">
          <button
            className="mr-2 rounded-full p-2 text-blue-700 hover:bg-blue-100 sm:hidden"
            onClick={onOpenContacts}
            aria-label="Open contacts"
          >
            <IconMenu />
          </button>
          <h2 className="text-lg font-semibold text-blue-900">Chatably</h2>
        </div>
      )}
      <div className="flex-1 min-h-0">
        <ChatBody />
      </div>
    </div>
  );
}
