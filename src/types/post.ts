import type { User } from "./user";

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalPosts?: number;
  totalItems?: number;
  hasMore: boolean;
}

export interface Comment {
  _id: string;
  postId: string;
  userId: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  content: string;
  parentCommentId: string | null;
  likes: number;
  repliesCount?: number;
  createdAt: string;
}

export interface Post {
  _id: string;
  caption?: string;
  image: string;
  video?: string | null;
  mediaType: "image" | "video";

  userId: User;

  likes: number;
  likesCount?: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
  likedBy?: string[] | { _id: string }[];
  savedBy?: string[] | { _id: string }[];
  createdAt: string;
  updatedAt?: string;
}

export interface PostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    pagination: Pagination;
  };
}

export interface PostDetailResponse {
  success: boolean;
  message: string;
  data: Post;
}
