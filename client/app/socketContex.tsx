"use client";
import { useState, createContext, useContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  connectSocket: () => void;
};

type SocketProviderProps = {
  children: ReactNode;
};

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = () => {
    if (!socket) {
      if (!SOCKET_URL) return;
      const newSocket: Socket = io(SOCKET_URL);
      setSocket(newSocket);
      return;
    }
    socket.connect();
  };

  return (
    <SocketContext.Provider value={{ socket, connectSocket }}>
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
