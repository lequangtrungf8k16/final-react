import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import BottomNavbar from "./BottomNavbar";
import CreatePostModal from "@/components/create-post/CreatePostModal";
import { useState } from "react";

// REDUX & CHAT IMPORTS
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { toggleMiniChat, setActiveRecipient } from "@/store/slices/chatSlice";
import ChatWindow from "@/components/chat/ChatWindow"; // Import đúng ChatWindow
import { X, Minus } from "lucide-react";

export default function MainLayout() {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const dispatch = useDispatch();

  // Lấy trạng thái mở/đóng Mini Chat từ Redux
  const { isMiniChatOpen } = useSelector((state: RootState) => state.chat);

  // Xử lý đóng chat
  const handleCloseMiniChat = () => {
    dispatch(toggleMiniChat(false));
    dispatch(setActiveRecipient(null)); // Reset người đang chat
  };

  // Xử lý thu nhỏ chat
  const handleMinimizeChat = () => {
    dispatch(toggleMiniChat(false));
  };

  return (
    <div className="container md:flex w-full relative min-h-screen">
      {/* Sidebar nằm dọc */}
      <div className="hidden md:block h-screen z-50 sticky top-0">
        <Sidebar onOpenCreate={() => setCreateOpen(true)} />
      </div>

      <main className="flex-1 z-40 w-full bg-background text-foreground relative">
        <div className="md:flex flex-col w-full min-h-screen hidden">
          {/* Hiển thị các trang */}
          <div className="flex-1 px-2 py-4">
            <Outlet />
          </div>

          {/* Chân trang */}
          <div className="hidden md:block">
            <Footer />
          </div>
        </div>
      </main>

      {/* Sidebar nằm ngang khi ở màn hình điện thoại */}
      <div className="md:hidden">
        <BottomNavbar onOpenCreate={() => setCreateOpen(true)} />
      </div>

      {/* MINI CHAT POPUP */}
      {isMiniChatOpen && (
        <div className="fixed bottom-0 right-4 w-80 h-113 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 shadow-2xl rounded-t-xl z-60 flex flex-col overflow-hidden">
          {/* Header của Mini Chat */}
          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <span className="font-semibold text-sm">New Message</span>
            <div className="flex gap-3">
              <Minus
                size={18}
                className="cursor-pointer hover:text-blue-500"
                onClick={handleMinimizeChat}
              />
              <X
                size={18}
                className="cursor-pointer hover:text-red-500"
                onClick={handleCloseMiniChat}
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatWindow />
          </div>
        </div>
      )}

      <CreatePostModal open={isCreateOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
