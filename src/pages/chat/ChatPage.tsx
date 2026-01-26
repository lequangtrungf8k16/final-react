import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetActiveChat } from "@/store/slices/chatSlice";
import type { AppDispatch } from "@/store/store";

export default function ChatPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Khi rời khỏi trang ChatPage (Unmount), reset lại trạng thái chat
  useEffect(() => {
    return () => {
      dispatch(resetActiveChat());
    };
  }, [dispatch]);

  return (
    <div className="flex h-[calc(100vh-100px)] w-full max-w-6xl mx-auto border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mt-2 bg-white dark:bg-black shadow-sm">
      {/* Cột trái: Danh sách hội thoại + Gợi ý */}
      <div className="w-full md:w-1/3 min-w-75 border-r border-gray-200 dark:border-gray-800 h-full">
        <ChatSidebar />
      </div>

      {/* Cột phải: Cửa sổ chat (Ẩn trên mobile nếu chưa chọn ai - Logic ẩn hiện chi tiết có thể thêm sau) */}
      <div className="hidden md:block w-2/3 h-full">
        <ChatWindow />
      </div>
    </div>
  );
}
