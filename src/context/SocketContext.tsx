import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { addNewMessage } from "@/store/slices/chatSlice";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: [],
});

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.VITE_BASE_URL;

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, accessToken, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated && accessToken && user) {
      // Kết nối Socket
      const socketInstance = io(`${SOCKET_URL}/api`, {
        auth: { token: accessToken },
        transports: ["websocket"],
        reconnection: true,
      });

      socketInstance.on("connect", () => {
        setIsConnected(true);
        setSocket(socketInstance);
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
        setSocket(null);
      });

      socketInstance.on("new_message", (message: any) => {
        dispatch(addNewMessage(message));
      });

      socketInstance.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      return () => {
        socketInstance.disconnect();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, accessToken, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
