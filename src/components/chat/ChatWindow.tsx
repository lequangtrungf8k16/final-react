import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { sendMessage, resetActiveChat } from "@/store/slices/chatSlice";
import { userService } from "@/services/userService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Send,
  Image as ImageIcon,
  Info,
  ArrowLeft,
} from "lucide-react";

const API_URL = import.meta.env.VITE_BASE_URL;

export default function ChatWindow() {
  const dispatch = useDispatch<AppDispatch>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const {
    messages,
    activeConversationId,
    activeRecipientId,
    conversations,
    isLoadingMessages,
    isSending,
  } = useSelector((state: RootState) => state.chat);

  const [content, setContent] = useState("");
  const [fetchedRecipient, setFetchedRecipient] = useState<any>(null);

  const currentConversation = conversations.find(
    (c: any) => c._id === activeConversationId,
  );
  const conversationRecipient = currentConversation?.participants?.find(
    (p: any) => p._id === activeRecipientId,
  );
  const recipientUser = conversationRecipient || fetchedRecipient;

  useEffect(() => {
    if (activeRecipientId && !conversationRecipient) {
      setFetchedRecipient(null);
      userService
        .getUserById(activeRecipientId)
        .then((res) => setFetchedRecipient(res.data.data))
        .catch(() => {});
    }
  }, [activeRecipientId, conversationRecipient]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getFullUrl = (path: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_URL}${path}`;
  };

  const handleSend = async () => {
    if (!content.trim() || !activeConversationId || !activeRecipientId) return;
    await dispatch(
      sendMessage({
        conversationId: activeConversationId,
        recipientId: activeRecipientId,
        content: content,
      }),
    );
    setContent("");
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConversationId || !activeRecipientId) return;

    await dispatch(
      sendMessage({
        conversationId: activeConversationId,
        recipientId: activeRecipientId,
        image: file,
      }),
    );

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeRecipientId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <div className="border-2 border-black dark:border-white rounded-full p-4 mb-4">
          <Send size={40} />
        </div>
        <h2 className="text-xl font-semibold">Your Messages</h2>
        <p className="text-gray-500">
          Send private photos and messages to a friend or group.
        </p>
      </div>
    );
  }

  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mr-1 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            onClick={() => dispatch(resetActiveChat())}
          >
            <ArrowLeft size={20} />
          </Button>

          {recipientUser && (
            <>
              <Avatar className="w-8 h-8 border border-gray-200">
                <AvatarImage
                  src={getFullUrl(recipientUser.profilePicture || "")}
                />
                <AvatarFallback>
                  {recipientUser.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {recipientUser.fullName || recipientUser.username}
                </span>
                <span className="text-xs text-gray-500">
                  @{recipientUser.username}
                </span>
              </div>
            </>
          )}
        </div>
        <Info size={20} className="cursor-pointer text-gray-500" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {isLoadingMessages ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="animate-spin text-gray-500" />
          </div>
        ) : safeMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
            <p>No messages yet.</p>
            <p>Send a message to start chatting.</p>
          </div>
        ) : (
          safeMessages.map((msg: any, index: number) => {
            const senderId =
              typeof msg.senderId === "string"
                ? msg.senderId
                : msg.senderId?._id;
            const isMe = senderId === currentUser?._id;

            return (
              <div
                key={msg._id || index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                {msg.messageType === "image" ? (
                  <div className="max-w-[70%] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={getFullUrl(msg.imageUrl)}
                      alt="Sent image"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-md text-sm wrap-break-word ${
                      isMe
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 bg-white dark:bg-black shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageSelect}
        />
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-blue-500"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon size={24} />
        </Button>

        <Input
          placeholder="Message..."
          className="rounded-full bg-gray-100 dark:bg-gray-800 border-none focus-visible:ring-0"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {content.trim() && (
          <Button
            variant="ghost"
            className="text-blue-500 font-semibold hover:text-blue-700 hover:bg-transparent"
            onClick={handleSend}
            disabled={isSending}
          >
            Send
          </Button>
        )}
      </div>
    </div>
  );
}
