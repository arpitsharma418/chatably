import { createContext, useContext, useEffect, useState } from "react";

import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";
import {useChat} from "./ChatContext.jsx";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const {allmessages,setAllMessages} = useChat();
  const { authUser } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (authUser) {
      const newSocket = io(`https://chatably.onrender.com`, {
        withCredentials: true,
        auth: { userId: authUser.id },
      });

      setSocket(newSocket);

      newSocket.on("getOnline", (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      });

      newSocket.on("newMessage", (message) => {
        setAllMessages((prev) => [...prev, message]);
      })

      return () => {
        newSocket.disconnect();
      };
    }else if(socket){
      socket.close();
      setSocket(null);
    }
  }, [authUser]);

  const sendMessage = (message) => {
    if(socket && authUser){
      setAllMessages((prev) => [...prev, {...message, senderId: authUser.id}]);
      socket.emit("sendMessage", (message));
    }
  }
  


  return (
    <SocketContext.Provider value={{ socket, onlineUsers, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
