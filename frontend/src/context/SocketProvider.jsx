import React, { createContext, useMemo, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const BASE_URL = 'http://localhost:5002';
const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(BASE_URL, {
      transports: ["websocket"], // Explicitly use WebSocket
      withCredentials: true, // Support CORS
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ WebSocket Connected:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ WebSocket Connection Error:", err.message);
    });

    newSocket.on("disconnect", () => {
      console.log("🔄 WebSocket Disconnected");
      setSocket(null);
    });

    return () => {
      newSocket.disconnect(); // Clean up WebSocket connection on unmount
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
