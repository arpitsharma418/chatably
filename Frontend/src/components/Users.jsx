import User from "./User.jsx";
import { useEffect, useState } from "react";
import getMyConversations from "../services/conversation.jsx";
import { useChat } from "../context/ChatContext.jsx";

export default function Users() {
  const [conversations, setConversations] = useState([]);
  const { id: loggedInUserId } = JSON.parse(localStorage.getItem("userInfo"));
  const { selectedConvo, selectConversation } = useChat();

  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const data = await getMyConversations();
        setConversations(data);
      } catch (error) {
        console.log("Error in Users.jsx: ", error);
      }
    };
    fetchConvos();
  }, []);

  return (
    <>
      <div className="mt-2 h-fit">
        <h1 className="text-xl"></h1>
  <div className="h-fit">
          {conversations.map((convo) => {
            const otherUsers = convo.members.find((member) => {
              return member._id !== loggedInUserId;
            });
            return (
              <div
                key={convo._id}
                onClick={() => {
                  selectConversation(convo);

                }}
                className={`cursor-pointer rounded ${
                  selectedConvo && selectedConvo._id === convo._id
                    ? "bg-gray-100"
                    : ""
                }`}
              >
                <User name={otherUsers.fullName} email={otherUsers.email} id={otherUsers._id} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
