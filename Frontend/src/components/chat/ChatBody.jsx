import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useSocket } from "../../context/SocketContext";
import { Loading } from "../UI";
import { NoConversationSelected, NoMessagesYet } from "./ChatEmptyState";
import MessageComposer from "./MessageComposer";
import MessageList from "./MessageList";

export default function ChatBody() {
  const { allmessages, loading, selectedConvo } = useChat();
  const { authUser } = useAuth();
  const { typingUser } = useSocket();

  if (!selectedConvo) {
    return <NoConversationSelected />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col p-3 text-xs sm:text-sm">
      {allmessages.length === 0 ? (
        <div className="flex-1">
          <NoMessagesYet />
        </div>
      ) : (
        <MessageList
          messages={allmessages}
          currentUserId={authUser?.id}
          typingUser={typingUser}
        />
      )}
      <MessageComposer />
    </div>
  );
}
