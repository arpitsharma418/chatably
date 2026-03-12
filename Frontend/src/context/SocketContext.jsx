import { createContext, useContext, useEffect, useRef, useState } from "react";

import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";
import {useChat} from "./ChatContext.jsx";
import { SOCKET_URL } from "../lib/config";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { setAllMessages, selectedConvo } = useChat();
  const { authUser } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const selectedConvoRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    selectedConvoRef.current = selectedConvo;
    setTypingUser(null);
  }, [selectedConvo]);

  useEffect(() => {
    if (authUser?.id) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        auth: { userId: authUser.id },
      });

      setSocket(newSocket);
      socketRef.current = newSocket;

      const handleOnline = (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      };

      const handleMessage = (message) => {
        setAllMessages((prev) => [...prev, message]);
        setTypingUser((prev) =>
          prev && prev.senderId === message.senderId ? null : prev
        );
      };

      const handleTyping = (payload) => {
        const activeConvo = selectedConvoRef.current;
        const isFromActiveConversation = activeConvo?.members?.some(
          (member) => member._id === payload?.senderId
        );
        if (isFromActiveConversation) {
          setTypingUser({
            senderId: payload.senderId,
            senderName: payload.senderName || "Someone",
          });
        }
      };

      const handleStopTyping = (payload) => {
        setTypingUser((prev) =>
          prev && prev.senderId === payload?.senderId ? null : prev
        );
      };

      newSocket.on("getOnline", handleOnline);
      newSocket.on("newMessage", handleMessage);
      newSocket.on("typing", handleTyping);
      newSocket.on("stopTyping", handleStopTyping);

      return () => {
        newSocket.off("getOnline", handleOnline);
        newSocket.off("newMessage", handleMessage);
        newSocket.off("typing", handleTyping);
        newSocket.off("stopTyping", handleStopTyping);
        newSocket.disconnect();
        if (socketRef.current === newSocket) {
          socketRef.current = null;
          setSocket(null);
        }
      };
    } else if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setSocket(null);
    }
  }, [authUser?.id, setAllMessages]);

  const sendMessage = (message) => {
    if(socket && authUser?.id){
      setAllMessages((prev) => [...prev, {...message, senderId: authUser.id}]);
      socket.emit("sendMessage", (message));
    }
  };

  const emitTyping = (receiverId) => {
    if (socket && authUser?.id && receiverId) {
      socket.emit("typing", {
        receiverId,
        senderName: authUser?.fullName,
      });
    }
  };

  const emitStopTyping = (receiverId) => {
    if (socket && authUser?.id && receiverId) {
      socket.emit("stopTyping", { receiverId });
    }
  };
  


  return (
    <SocketContext.Provider value={{ socket, onlineUsers, sendMessage, typingUser, emitTyping, emitStopTyping }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
