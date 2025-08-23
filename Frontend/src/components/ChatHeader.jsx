import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { useAuth } from "../context/AuthContext";
import {useChat} from "../context/ChatContext.jsx";
import { useSocket } from "../context/SocketContext";
import MenuIcon from '@mui/icons-material/Menu';

export default function ChatHeader({ onOpenContacts = () => {} }) {

  const {authUser} = useAuth();
  const {selectedConvo} = useChat();
  const {onlineUsers } = useSocket();

  const selectedUser = selectedConvo.members.filter((member) => {
    return member._id !== authUser.id;
  });

  const isOnline = onlineUsers.includes(selectedUser[0]._id);

  return (
    <>
      <div className="flex flex-col items-between">
        <div className="w-full h-16 sticky top-0 bg-white border-b-2 border-b-gray-100 flex items-center px-4 z-20">
          {/* Mobile menu button */}
          <button className="sm:hidden mr-2" onClick={onOpenContacts} aria-label="Open contacts">
            <MenuIcon />
          </button>
          <Stack direction="row" spacing={2} className="flex-1 items-center">
            <Avatar sx={{backgroundColor: "gray"}}>{selectedUser[0].fullName.charAt(0).toUpperCase()}</Avatar>
            <div className="text-sm">
              <h1 className="font-semibold">{selectedUser[0].fullName}</h1>
              <p className={`${isOnline? "text-green-600": "text-gray-600"}`}>{`${isOnline? "online": "offline"}`}</p>
            </div>
          </Stack>
          <div className="flex items-center space-x-2">
          </div>
        </div>
      </div>
    </>
  );
}
