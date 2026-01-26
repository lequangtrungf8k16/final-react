import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { addNewMessage } from "@/store/slices/chatSlice";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emitTyping: (conversationId: string, recipientId: string) => void;
  emitStopTyping: (conversationId: string, recipientId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  emitTyping: () => {},
  emitStopTyping: () => {},
});

export const useSocket = () => useContext(SocketContext);

const API_URL = import.meta.env.VITE_BASE_URL;

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, accessToken, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Chỉ kết nối khi đã đăng nhập và có token
    if (isAuthenticated && accessToken && user) {
      const socketInstance = io(`${API_URL}/api`, {
        auth: { token: accessToken },
        transports: ["websocket", "polling"],
        reconnection: true,
      });

      socketInstance.on("connect", () => {
        console.log("Socket Connected:", socketInstance.id);
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket Disconnected");
        setIsConnected(false);
      });

      // Lắng nghe tin nhắn mới realtime
      socketInstance.on("new_message", (message: any) => {
        console.log("Realtime Message Received:", message);
        dispatch(addNewMessage(message));
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else {
      // Cleanup nếu logout
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, accessToken, dispatch]);

  // Hàm helper: Gửi sự kiện đang gõ phím
  const emitTyping = useCallback(
    (conversationId: string, recipientId: string) => {
      if (socket) {
        socket.emit("typing", { conversationId, recipientId });
      }
    },
    [socket],
  );

  // Hàm helper: Gửi sự kiện ngừng gõ
  const emitStopTyping = useCallback(
    (conversationId: string, recipientId: string) => {
      if (socket) {
        socket.emit("stop_typing", { conversationId, recipientId });
      }
    },
    [socket],
  );

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, emitTyping, emitStopTyping }}
    >
      {children}
    </SocketContext.Provider>
  );
};
