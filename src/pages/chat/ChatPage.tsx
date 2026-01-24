import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActiveRecipient } from "@/store/slices/chatSlice";
import type { AppDispatch } from "@/store/store";

export default function ChatPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    return () => {
      dispatch(setActiveRecipient(null));
    };
  }, [dispatch]);

  return (
    <div className="flex h-[calc(100vh-60px)] w-full max-w-6xl mx-auto border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden mt-4 bg-white dark:bg-black shadow-sm">
      {/* Cột trái: Danh sách hội thoại */}
      <div className="w-1/3 min-w-75 border-r border-gray-200 dark:border-gray-800 h-full">
        <ChatSidebar />
      </div>

      {/* Cột phải: Cửa sổ chat */}
      <div className="w-2/3 h-full">
        <ChatWindow />
      </div>
    </div>
  );
}
