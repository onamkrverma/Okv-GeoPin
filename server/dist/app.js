"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
//For env File
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res
        .status(200)
        .json({ status: "success", message: "Okv GeoPin server is running..." });
});
const server = app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
const io = new socket_io_1.Server(server, {
    cors: { origin: "*" },
});
const roomCreator = new Map();
io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);
    socket.on("createRoom", (data) => {
        const roomId = Math.random().toString(36).substring(2, 7); // generate random alphanumaric
        socket.join(roomId);
        const totalRoomUsers = io.sockets.adapter.rooms.get(roomId);
        socket.emit("roomCreated", {
            roomId,
            position: data.position,
            totalConnectedUsers: Array.from(totalRoomUsers || []),
        });
        roomCreator.set(roomId, socket.id);
        socket.roomId = roomId;
    });
    socket.on("joinRoom", (data) => {
        // check if room exists
        const roomExists = io.sockets.adapter.rooms.has(data.roomId);
        if (roomExists) {
            socket.join(data.roomId);
            socket.roomId = data.roomId; // attach roomId to socket
            // Notify the room creator about new user join
            const createSocketId = roomCreator.get(data.roomId);
            if (createSocketId) {
                const createSocket = io.sockets.sockets.get(createSocketId);
                if (createSocket) {
                    const totalRoomUsers = io.sockets.adapter.rooms.get(data.roomId);
                    createSocket.emit("userJoinedRoom", {
                        userId: socket.id,
                        totalConnectedUsers: Array.from(totalRoomUsers || []),
                    });
                }
            }
            // msg to joiner
            io.to(`${socket.id}`).emit("roomJoined", {
                status: "OK",
            });
        }
        else {
            io.to(`${socket.id}`).emit("roomJoined", {
                status: "ERROR",
            });
        }
    });
    socket.on("updateLocation", (data) => {
        io.emit("updateLocationResponse", data);
    });
    socket.on("diconnect", () => {
        console.log("user diconnected", socket.id);
        const roomId = socket.roomId;
        if (roomId) {
            // if disconnected user is creator, distroy room
            if (roomCreator.get(roomId) === socket.id) {
                // notify users in room that room is destroyed
                const roomUsers = io.sockets.adapter.rooms.get(roomId);
                if (roomUsers) {
                    for (const socketId of roomUsers) {
                        io.to(`${socketId}`).emit("roomDestroyed", {
                            status: "OK",
                        });
                    }
                }
                io.sockets.adapter.rooms.delete(roomId);
                roomCreator.delete(roomId);
            }
            else {
                socket.leave(roomId);
                // notify creator that user left room
                const createSocketId = roomCreator.get(roomId);
                if (createSocketId) {
                    const createSocket = io.sockets.sockets.get(createSocketId);
                    if (createSocket) {
                        const totalRoomUsers = io.sockets.adapter.rooms.get(roomId);
                        createSocket.emit("userLeftRoom", {
                            userId: socket.id,
                            totalConnectedUser: Array.from(totalRoomUsers || []),
                        });
                    }
                }
            }
        }
    });
});
