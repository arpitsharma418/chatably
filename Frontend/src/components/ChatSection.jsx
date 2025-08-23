import ChatHeader from "./ChatHeader";
import ChatBox from "./ChatBox";
import { useChat } from "../context/ChatContext";
import MenuIcon from "@mui/icons-material/Menu";

export default function ChatSection({ onOpenContacts = () => {} }) {
  const { selectedConvo } = useChat();
  return (
    <>
      <div className={`flex-1 max-h-screen flex flex-col`}>
        {selectedConvo ? (
          <ChatHeader onOpenContacts={onOpenContacts} />
        ) : (
          <div className="w-full h-[10vh] border-b-2 border-b-gray-100 flex items-center px-4">
            <button
              className="sm:hidden mr-2"
              onClick={onOpenContacts}
              aria-label="Open contacts"
            >
              <MenuIcon />
            </button>
            <h2 className="text-lg font-semibold">Chatably</h2>
          </div>
        )}
        <div className="flex-1 min-h-0">
          <ChatBox />
        </div>
      </div>
    </>
  );
}
