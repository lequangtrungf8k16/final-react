import type { User } from "./user";

export interface Comment {
    id: string;
    content: string;
    user: User;
    createAt: string;
    likesCount: number;
}

export interface Post {
    id: string;
    caption: string;
    imageUrl: string[];
    user: User;
    createAt: string;
    likeCount: number;
}
