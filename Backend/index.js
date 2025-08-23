import express from "express";
const app = express();
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

const PORT = process.env.PORT || 8080;

dotenv.config();

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
app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
}));

// Routes
app.use("/api", userRoute);
app.use("/api", conversationRoute);
app.use("/api", messageRoute);

app.use(express.static(path.join(_dirname, "/Frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
});

// Socket.io Setup
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: `${process.env.CLIENT_URL}`,
        credentials: true,
    }
});

const users = {};

io.on("connection", (socket) => {

    const userId = socket.handshake.auth.userId;

    if(userId){
        users[userId] = socket.id;
    }

    socket.on("sendMessage", (message) =>{
        const receiverSocketId = users[message.receiverId];
        if (receiverSocketId && userId) {
            message.senderId = userId; // Add senderId to the message
            io.to(receiverSocketId).emit("newMessage", message);
        }
    });

    io.emit("getOnline", Object.keys(users));

    socket.on("disconnect", () => {
        delete users[userId];
        io.emit("getOnline", Object.keys(users));
    })
})

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})