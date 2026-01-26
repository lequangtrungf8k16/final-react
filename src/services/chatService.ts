import api from "../lib/api";
import type { Conversation, Message } from "@/types/chat";

export interface SendMessagePayload {
  conversationId: string;
  recipientId: string;
  content?: string;
  image?: File;
}

export const chatService = {
  getConversations: (page = 1, limit = 20) => {
    return api.get<{
      success: boolean;
      data: {
        conversations: Conversation[];
        pagination: any;
      };
    }>("/api/messages/conversations", {
      params: { page, limit },
    });
  },

  createOrGetConversation: (userId: string) => {
    return api.post<{
      success: boolean;
      data: Conversation;
    }>("/api/messages/conversations", { userId });
  },

  getMessages: (conversationId: string, page = 1, limit = 50) => {
    return api.get<{
      success: boolean;
      data: {
        messages: Message[];
        pagination: any;
      };
    }>(`/api/messages/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
  },

  sendMessage: (payload: SendMessagePayload) => {
    if (payload.image) {
      const formData = new FormData();
      formData.append("conversationId", payload.conversationId);
      formData.append("recipientId", payload.recipientId);
      formData.append("messageType", "image");
      formData.append("image", payload.image);

      return api.post<{ success: boolean; data: Message }>(
        "/api/messages/messages",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
    }

    return api.post<{ success: boolean; data: Message }>(
      "/api/messages/messages",
      {
        conversationId: payload.conversationId,
        recipientId: payload.recipientId,
        messageType: "text",
        content: payload.content,
      },
    );
  },
};
