import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Maximize2, Minus, Send } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { resetActiveChat } from "@/store/slices/chatSlice";
import type { AppDispatch, RootState } from "@/store/store";

export default function ChatWidget() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Lấy state từ Redux để biết có đang chat với ai không
  const { activeConversationId, activeRecipientId } = useSelector(
    (state: RootState) => state.chat,
  );

  // Tự động mở khung chat khi có cuộc hội thoại active
  useEffect(() => {
    if (activeConversationId || activeRecipientId) {
      setIsOpen(true);
      setIsMinimized(false);
    }
  }, [activeConversationId, activeRecipientId]);

  // Ẩn Widget nếu đang ở trang /messages
  const isChatPage = location.pathname.startsWith("/messages");
  if (isChatPage) return null;

  const toggleChat = () => {
    if (isOpen) {
      // Nếu đóng, reset state chat trong redux
      dispatch(resetActiveChat());
    }
    setIsOpen(!isOpen);
    if (!isOpen) setIsMinimized(false);
  };

  const handleGoToChatPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/messages");
    setIsOpen(false);
  };

  const handleCloseToMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  // Đóng hẳn widget và reset state
  const handleCloseChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    dispatch(resetActiveChat());
  };

  // Nút tròn khi đóng
  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 z-0] p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center cursor-pointer"
      >
        <Send size={28} />
      </button>
    );
  }

  // Khung chat khi mở
  return (
    <div
      className={`fixed bottom-0 right-4 z-50 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-2xl rounded-t-xl overflow-hidden transition-all duration-300 ease-in-out flex flex-col ${
        isMinimized ? "h-14 w-72 cursor-pointer" : "h-125 w-88 md:w-95"
      }`}
      onClick={() => isMinimized && setIsMinimized(false)}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white shrink-0">
        <div
          className="font-bold flex items-center gap-2 cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <Send size={20} />
          <span>Messages</span>
        </div>

        <div className="flex items-center gap-1">
          {!isMinimized && (
            <button
              onClick={handleGoToChatPage}
              className="p-1 hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
              title="Open in Full Page"
            >
              <Maximize2 size={18} />
            </button>
          )}

          <button
            onClick={handleCloseToMinimize}
            className="p-1 hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus size={18} />
          </button>

          <button
            onClick={handleCloseChat}
            className="p-1 hover:bg-red-500 rounded-md transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* BODY */}
      {!isMinimized && (
        <div className="flex-1 bg-white dark:bg-black relative overflow-hidden flex flex-col cursor-default">
          {activeConversationId ? (
            <div className="h-full w-full">
              <ChatWindow />
            </div>
          ) : (
            <div className="h-full w-full overflow-hidden">
              <ChatSidebar />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
