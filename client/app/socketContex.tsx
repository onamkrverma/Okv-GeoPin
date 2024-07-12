"use client";
import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { io, Socket } from "socket.io-client";
import { ServerStatus } from "./global";
import { toast } from "react-toastify";

type SocketContextType = {
  socket: Socket | null;
  connectSocket: () => void;
  serverStatus: ServerStatus;
};

type SocketProviderProps = {
  children: ReactNode;
};

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [serverStatus, setServerStatus] =
    useState<ServerStatus>("disconnected");

  const connectSocket = () => {
    if (!socket) {
      if (!SOCKET_URL) return;
      const newSocket: Socket = io(SOCKET_URL);
      setSocket(newSocket);
      return;
    }
    socket.connect();
  };

  const getServerStatus = async () => {
    if (!SOCKET_URL || serverStatus === "connected") return;
    try {
      setServerStatus("connecting");
      const res = await fetch(SOCKET_URL);
      if (res.ok) {
        setServerStatus("connected");
      }
    } catch (error) {
      // console.log(error)
      toast("Connection to the server failed");
    }
  };

  useEffect(() => {
    getServerStatus();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, serverStatus }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("Something went wrong!");
  }
  return context;
};
