import api from "../lib/api";
import type { Conversation, Message } from "@/types/chat";

export interface SendMessagePayload {
  recipientId: string;
  content?: string;
  image?: File;
}

export const chatService = {
  // Lấy danh sách các cuộc trò chuyện (Inbox)
  getConversations: () => {
    return api.get<{
      success: boolean;
      data: Conversation[];
    }>("/api/messages/conversations");
  },

  // Lấy nội dung tin nhắn của một cuộc trò chuyện
  getMessages: (otherUserId: string) => {
    return api.get<{
      success: boolean;
      data: Message[];
    }>(`/api/messages/${otherUserId}`);
  },

  // Gửi tin nhắn (Text hoặc Ảnh)
  sendMessage: (payload: SendMessagePayload) => {
    const formData = new FormData();
    formData.append("recipientId", payload.recipientId);

    if (payload.content) {
      formData.append("content", payload.content);
    }

    if (payload.image) {
      formData.append("image", payload.image);
    }

    return api.post<{
      success: boolean;
      data: Message;
    }>("/api/messages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Xóa cuộc trò chuyện
  deleteConversation: (recipientId: string) => {
    return api.delete(`/api/messages/${recipientId}`);
  },
};
