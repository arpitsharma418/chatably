import { createContext, useContext, useState } from "react";
import axios, { all } from "axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [allmessages, setAllMessages] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const selectConversation = async (convo) => {
    setSelectedConvo(convo);
    setLoading(true);
    const response = await axios.get(
      `${API_BASE}/api/message/${convo._id}`,
      { withCredentials: true }
    );
    setLoading(false);
    setAllMessages(response.data.messages);
  };

  const values = {
    allmessages, 
    setAllMessages, 
    selectConversation,
    selectedConvo,
    loading
  }

  return (
    <>
      <ChatContext.Provider value={values}>
        {children}
      </ChatContext.Provider>
    </>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
