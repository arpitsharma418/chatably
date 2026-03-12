import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "../lib/api";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [allmessages, setAllMessages] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectConversation = useCallback(async (convo) => {
    if (!convo?._id) {
      return;
    }

    setSelectedConvo(convo);
    setAllMessages([]);
    setLoading(true);

    try {
      const response = await api.get(`/api/message/${convo._id}`);
      setAllMessages(response.data.messages || []);
    } catch (error) {
      console.log("Failed to load messages", error);
      setAllMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const values = useMemo(() => ({
    allmessages,
    setAllMessages,
    selectConversation,
    selectedConvo,
    loading,
  }), [allmessages, loading, selectConversation, selectedConvo]);

  return (
    <>
      <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
    </>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
