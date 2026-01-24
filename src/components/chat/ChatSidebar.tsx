import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  getConversations,
  getMessages,
  setActiveRecipient,
} from "@/store/slices/chatSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const API_URL = import.meta.env.VITE_BASE_URL;

export default function ChatSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  // Lấy state an toàn
  const chatState = useSelector((state: RootState) => state.chat);
  const conversations = chatState?.conversations || [];
  const isLoadingConversations = chatState?.isLoadingConversations || false;
  const activeRecipientId = chatState?.activeRecipientId;

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  const getFullUrl = (path: string) =>
    path?.startsWith("http") ? path : `${API_URL}${path}`;

  const handleSelectConversation = (conversation: any) => {
    if (!conversation?.participants) return;
    const otherUser = conversation.participants.find(
      (p: any) => p._id !== currentUser?._id,
    );

    if (otherUser) {
      dispatch(setActiveRecipient(otherUser._id));
      dispatch(getMessages(otherUser._id));
    }
  };

  if (isLoadingConversations) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Đảm bảo conversations luôn là mảng
  const safeConversations = Array.isArray(conversations) ? conversations : [];

  return (
    <div className="flex flex-col h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800">
      <div className="p-4 font-bold text-lg border-b border-gray-200 dark:border-gray-800">
        {currentUser?.username || "Messages"}
      </div>

      <div className="flex flex-col">
        {safeConversations.map((conversation: any) => {
          if (!conversation || !conversation.participants) return null;

          const otherUser = conversation.participants.find(
            (p: any) => p._id !== currentUser?._id,
          );

          if (!otherUser) return null;

          const isActive = activeRecipientId === otherUser._id;
          const lastMsg = conversation.lastMessage;

          return (
            <div
              key={conversation._id}
              onClick={() => handleSelectConversation(conversation)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                isActive ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={getFullUrl(otherUser.profilePicture || "")} />
                <AvatarFallback>
                  {otherUser.username?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {otherUser.username}
                </div>
                <div className="text-xs text-gray-500 truncate flex justify-between">
                  <span className="truncate max-w-30">
                    {(() => {
                      const senderId =
                        typeof lastMsg?.senderId === "object"
                          ? lastMsg.senderId._id
                          : lastMsg?.senderId;
                      return senderId === currentUser?._id ? "You: " : "";
                    })()}
                    {lastMsg?.content || "Sent an image"}
                  </span>
                  <span className="shrink-0 ml-2">
                    {(conversation.lastMessageAt || conversation.createdAt) &&
                      formatDistanceToNow(
                        new Date(
                          conversation.lastMessageAt || conversation.createdAt,
                        ),
                        { addSuffix: false },
                      )
                        .replace("about ", "")
                        .replace("less than a minute", "now")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
