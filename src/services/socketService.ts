import {io, Socket} from "socket.io-client";
import {API_BASE_URL} from "../App";

const SERVER_URL = process.env.WEB_BASE || "ws://localhost:9000";

let socket: Socket | null = null;
export let socketId: string | null = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SERVER_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {});

    socket.on("connected", (message) => {
      console.log("Connected to socket server: ", message);
      socketId = message?.socketId ?? null;
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      socketId = null;
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
  }
};

export const subscribeToTaskUpdates = (
  taskId: string,
  callback: (data: any) => void
) => {
  if (!socket) connectSocket();

  socket?.on(`task-update-${taskId}`, (data) => {
    callback(data);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
