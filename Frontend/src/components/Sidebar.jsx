import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import { IconClose } from "./UI";
import ProfileSection from "./ProfileSection.jsx";
import ConnectUser from "./ConnectUser.jsx";

export default function Sidebar({ open = false, onClose = () => {} }) {
  const { authUser } = useAuth();

  return (
    <>
      <aside className="hidden w-[28%] min-w-[18rem] max-w-[22rem] border-r border-blue-100 bg-gradient-to-b from-blue-50 to-white p-5 sm:block">
        <div className="flex items-center justify-between text-lg text-blue-900">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold tracking-tight">Chatably</h1>
          </div>

          <div className="flex items-center gap-2 text-blue-700">
            <ConnectUser />
            <ProfileSection />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Signed in as{" "}
          <span className="font-medium text-blue-700">
            {authUser?.fullName || "User"}
          </span>
        </p>
        <div className="mt-4">
          <Users />
        </div>
      </aside>

      <div
        className={`sm:hidden fixed inset-0 z-40 transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="absolute inset-0 bg-slate-900/45" onClick={onClose} />
        <div className="relative h-screen w-full bg-gradient-to-b from-blue-50 to-white p-4 shadow-2xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-blue-900">Chatably</h1>
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <ConnectUser />
              <ProfileSection />
              {/* <Logout /> */}
              <button
                onClick={onClose}
                aria-label="Close contacts"
                className="rounded-full p-1 hover:bg-blue-100"
              >
                <IconClose />
              </button>
            </div>
          </div>
          <p className="mb-3 text-xs text-slate-500">
            Signed in as{" "}
            <span className="font-medium text-blue-700">
              {authUser?.fullName || "User"}
            </span>
          </p>
          <div className="flex-1 overflow-auto">
            <Users />
          </div>
        </div>
      </div>
    </>
  );
}

function Users() {
  const [conversations, setConversations] = useState([]);
  const { authUser } = useAuth();
  const { selectedConvo, selectConversation } = useChat();

  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const res = await api.get("/api/conversation");
        setConversations(res.data);
      } catch (error) {
        console.log("Error in Users.jsx: ", error);
      }
    };
    fetchConvos();
  }, []);

  return (
    <div className="mt-2 h-fit">
      <div className="h-fit">
        {conversations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50 p-4 text-xs text-slate-500">
            No conversations yet. Start one with the plus button.
          </div>
        ) : null}
        {conversations.map((convo) => {
          const otherUsers = convo.members.find((member) => {
            return member._id !== authUser?.id;
          });
          return (
            <div
              key={convo._id}
              onClick={() => {
                selectConversation(convo);
              }}
              className={`cursor-pointer rounded-xl border border-transparent transition hover:border-blue-100 hover:bg-white ${
                selectedConvo && selectedConvo._id === convo._id
                  ? "border-blue-100 bg-white shadow-sm"
                  : ""
              }`}
            >
              {otherUsers ? (
                <User name={otherUsers.fullName} email={otherUsers.email} id={otherUsers._id} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function User({ name, email, id }) {

  const { onlineUsers } = useSocket();
  const isOnline = onlineUsers.includes(id);

  return (
    <div className="flex items-center gap-3 p-3 text-sm">
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
          {name.charAt(0).toUpperCase()}
        </div>
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
            isOnline ? "bg-emerald-500" : "bg-slate-300"
          }`}
          aria-hidden="true"
        />
      </div>
      <div className="text-sm">
        <h1 className="font-semibold">{name}</h1>
        <p className="text-slate-500">{email}</p>
      </div>
    </div>
  );
}
