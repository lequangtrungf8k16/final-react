import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { sendMessage } from "@/store/slices/chatSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Image as ImageIcon, Info } from "lucide-react";

const API_URL = import.meta.env.VITE_BASE_URL;

export default function ChatWindow() {
  const dispatch = useDispatch<AppDispatch>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  // Lấy state an toàn
  const chatState = useSelector((state: RootState) => state.chat);
  const messages = chatState?.messages || [];
  const activeRecipientId = chatState?.activeRecipientId;
  const isLoadingMessages = chatState?.isLoadingMessages || false;
  const isSending = chatState?.isSending || false;
  const conversations = chatState?.conversations || [];

  const [content, setContent] = useState("");

  const currentConversation = conversations.find((c: any) =>
    c.participants?.some((p: any) => p._id === activeRecipientId),
  );
  const recipientUser = currentConversation?.participants?.find(
    (p: any) => p._id === activeRecipientId,
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim() || !activeRecipientId) return;
    await dispatch(
      sendMessage({
        recipientId: activeRecipientId,
        content: content,
      }),
    );
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getFullUrl = (path: string) =>
    path?.startsWith("http") ? path : `${API_URL}${path}`;

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

  // Đảm bảo messages là mảng
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          {recipientUser && (
            <>
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={getFullUrl(recipientUser.profilePicture || "")}
                />
                <AvatarFallback>{recipientUser.username?.[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{recipientUser.username}</span>
            </>
          )}
        </div>
        <Info size={24} className="cursor-pointer" />
      </div>

      {/* MESSAGES LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {isLoadingMessages ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="animate-spin" />
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
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <Button variant="ghost" size="icon">
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
            className="text-blue-500 font-semibold hover:text-blue-700"
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
