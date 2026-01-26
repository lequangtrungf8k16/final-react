import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getConversations, accessChat } from "@/store/slices/chatSlice";
import { userService } from "@/services/userService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const API_URL = import.meta.env.VITE_BASE_URL;

export default function ChatSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const { conversations, isLoadingConversations, activeRecipientId } =
    useSelector((state: RootState) => state.chat);

  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!currentUser) return;
      try {
        setIsSuggestionsLoading(true);
        const res = await userService.getSuggestedUsers();
        const usersData = res.data?.data;

        if (Array.isArray(usersData)) {
          setSuggestedUsers(
            usersData.filter((u: any) => u._id !== currentUser._id),
          );
        } else {
          setSuggestedUsers([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, [currentUser]);

  const getFullUrl = (path: string) =>
    path?.startsWith("http") ? path : `${API_URL}${path}`;

  const handleUserClick = (targetUserId: string) => {
    if (targetUserId) dispatch(accessChat(targetUserId));
  };

  const safeConversations = Array.isArray(conversations) ? conversations : [];

  const filteredSuggestions = suggestedUsers.filter(
    (u) =>
      !safeConversations.some((c: any) =>
        c.participants.some((p: any) => p._id === u._id),
      ),
  );

  if (
    isLoadingConversations &&
    safeConversations.length === 0 &&
    suggestedUsers.length === 0
  ) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="p-4 font-bold text-lg border-b border-gray-200 dark:border-gray-800 flex justify-between items-center shrink-0">
        <span>{currentUser?.username || "Messages"}</span>
        <MessageSquarePlus className="cursor-pointer text-gray-500 hover:text-black dark:hover:text-white" />
      </div>

      <div className="flex flex-col pb-4">
        {/* Conversations List */}
        {safeConversations.map((conversation: any) => {
          if (!conversation?.participants) return null;
          const otherUser = conversation.participants.find(
            (p: any) => p._id !== currentUser?._id,
          );
          if (!otherUser) return null;

          const isActive = activeRecipientId === otherUser._id;
          const lastMsg = conversation.lastMessage;

          return (
            <div
              key={conversation._id}
              onClick={() => handleUserClick(otherUser._id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 border-r-2 border-black dark:border-white"
                  : ""
              }`}
            >
              <Avatar className="w-12 h-12 border border-gray-200">
                <AvatarImage src={getFullUrl(otherUser.profilePicture || "")} />
                <AvatarFallback>
                  {otherUser.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate dark:text-white">
                  {otherUser.username}
                </div>
                <div className="text-xs text-gray-500 truncate flex justify-between">
                  <span className="truncate max-w-35">
                    {(() => {
                      const senderId =
                        typeof lastMsg?.senderId === "string"
                          ? lastMsg.senderId
                          : lastMsg?.senderId?._id;
                      return senderId === currentUser?._id ? "You: " : "";
                    })()}
                    {lastMsg?.messageType === "image"
                      ? "Sent an image"
                      : lastMsg?.content || ""}
                  </span>
                  <span className="shrink-0 ml-1">
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

        {/* Suggested Users List */}
        {isSuggestionsLoading && filteredSuggestions.length === 0 && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        )}

        {filteredSuggestions.length > 0 && (
          <>
            <div className="mt-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-t border-gray-100 dark:border-gray-800">
              Suggested
            </div>
            {filteredSuggestions.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Avatar className="w-10 h-10 border border-gray-200 opacity-80">
                  <AvatarImage src={getFullUrl(user.profilePicture || "")} />
                  <AvatarFallback>
                    {user.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-700 dark:text-gray-200">
                    {user.username}
                  </div>
                  <div className="text-xs text-gray-400">Suggested for you</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
