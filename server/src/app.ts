import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server, Socket } from "socket.io";
//For env File
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

const server = app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

const io = new Server(server, {
  cors: { origin: "*" },
});

interface CustomSocket extends Socket {
  roomId?: string;
}

const roomCreator = new Map<string, string>();

io.on("connection", (socket: CustomSocket) => {
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
  });
});
