import { Server } from "socket.io";

let io;
const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // User comes online
    socket.on("user:online", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("users:online", Array.from(onlineUsers.keys()));
    });

    // Join a room (DM or group)
    socket.on("room:join", (roomId) => {
      socket.join(roomId);
    });

    // Leave a room
    socket.on("room:leave", (roomId) => {
      socket.leave(roomId);
    });

    // Typing indicator
    socket.on("typing:start", ({ roomId, userName }) => {
      socket.to(roomId).emit("typing:start", { userName });
    });

    socket.on("typing:stop", ({ roomId }) => {
      socket.to(roomId).emit("typing:stop");
    });

    // Disconnect
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("users:online", Array.from(onlineUsers.keys()));
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export const getOnlineUsers = () => Array.from(onlineUsers.keys());
