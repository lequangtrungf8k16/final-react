import type { User } from "./user";

export interface Message {
    _id: string;
    conversationId: string;

    senderId: User;
    recipientId: string;

    content?: string;
    imageUrl?: string;
    messageType: "text" | "image";

    isRead: boolean;
    createdAt: string;
}

export interface Conversation {
    _id: string;
    participants: User[];
    lastMessage?: Message;
    unreadCount: number;

    lastMessageAt: string;
    createdAt: string;
}
