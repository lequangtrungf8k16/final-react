import type { User } from "./user";

export interface Comment {
    _id: string;
    postId: string;
    content: string;
    user: User;
    parentCommentId: string | null;
    likes: number;
    repliesCount?: number;
    createAt: string;
}

export interface Post {
    _id: string;
    caption: string;

    image: string;
    video?: string | null;
    mediaType: "image" | "video";

    user: User;
    like: number;
    comments: number;
    isLiked?: boolean;
    isSave?: boolean;

    createdAt: string;
}
