import Sidebar from "./Sidebar.jsx";
import ChatLayout from "./ChatLayout.jsx";

export default function ChatBox({
  showContacts = false,
  onCloseContacts = () => {},
  onOpenContacts = () => {},
}) {
  return (
    <div className="h-screen w-screen">
      <div className="flex h-full w-full overflow-hidden">
        <Sidebar open={showContacts} onClose={onCloseContacts} />
        <ChatLayout onOpenContacts={onOpenContacts} />
      </div>
    </div>
  );
}
