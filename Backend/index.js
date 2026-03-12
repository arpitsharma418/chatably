import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/user.js";
import conversationRoute from "./routes/conversation.js";
import messageRoute from "./routes/message.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import jwt from "jsonwebtoken";

dotenv.config({ path: path.resolve(process.cwd(), "Backend/.env") });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const CORS_ORIGINS = CLIENT_URL.split(",").map((origin) => origin.trim()).filter(Boolean);
const SERVE_FRONTEND = process.env.SERVE_FRONTEND === "true";

const _dirname = path.resolve();

// MongoDB Atlas Connection
const MONGODB_URL = process.env.MONGODB_URL;
main().then(() => {
    console.log("MongoDB Connected Successfully!");
}).catch((error) => {
    console.log(error);
})

async function main(){
    await mongoose.connect(MONGODB_URL);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.disable("x-powered-by");
app.use(
    cors({
        origin(origin, callback) {
            if (!origin || CORS_ORIGINS.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("CORS origin not allowed"));
        },
        credentials: true,
    })
);

// Routes
app.use("/api", userRoute);
app.use("/api", conversationRoute);
app.use("/api", messageRoute);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

if (process.env.NODE_ENV === "production" && SERVE_FRONTEND) {
    app.use(express.static(path.join(_dirname, "/Frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
    });
}

// Socket.io Setup
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: CORS_ORIGINS,
        credentials: true,
    }
});

const users = {};
const socketIdsByUser = {};

const parseCookies = (cookieHeader = "") =>
  cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((accumulator, entry) => {
      const separatorIndex = entry.indexOf("=");
      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = entry.slice(0, separatorIndex).trim();
      const value = decodeURIComponent(entry.slice(separatorIndex + 1).trim());
      accumulator[key] = value;
      return accumulator;
    }, {});

io.on("connection", (socket) => {
    if (!process.env.JWT_SECRET) {
        socket.disconnect(true);
        return;
    }

    const cookies = parseCookies(socket.handshake.headers.cookie);
    const token = cookies.token;
    let userId = null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
    } catch (error) {
        socket.disconnect(true);
        return;
    }

    if (userId) {
        users[userId] = socket.id;
        socketIdsByUser[socket.id] = userId;
    }

    socket.on("sendMessage", (message) =>{
        const receiverSocketId = users[message.receiverId];
        if (receiverSocketId && userId) {
            message.senderId = userId; // Add senderId to the message
            io.to(receiverSocketId).emit("newMessage", message);
        }
    });

    socket.on("typing", (payload) => {
        const receiverSocketId = users[payload?.receiverId];
        if (receiverSocketId && userId) {
            io.to(receiverSocketId).emit("typing", {
                senderId: userId,
                senderName: payload?.senderName || "Someone",
            });
        }
    });

    socket.on("stopTyping", (payload) => {
        const receiverSocketId = users[payload?.receiverId];
        if (receiverSocketId && userId) {
            io.to(receiverSocketId).emit("stopTyping", {
                senderId: userId,
            });
        }
    });

    io.emit("getOnline", Object.keys(users));

    socket.on("disconnect", () => {
        const disconnectedUserId = socketIdsByUser[socket.id];
        delete socketIdsByUser[socket.id];
        if (disconnectedUserId) {
            delete users[disconnectedUserId];
        }
        io.emit("getOnline", Object.keys(users));
    })
})

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})
