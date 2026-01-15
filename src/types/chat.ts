import type { User } from "./user";

export interface Message {
    id: string;
    senderId: string;
    content: string;
    createAt: string;
}

export interface Conversation {
    id: string;
    participants: User[];
    lastMessage?: Message;
    updateAt: string;
}
