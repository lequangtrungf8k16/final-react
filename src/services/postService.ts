import type { PostDetailResponse, PostsResponse } from "@/types";
import api from "./api";

export const postService = {
    // Lấy danh sách tất cả posts (news feed), sorted by newest
    getFeed: (limit: number = 20, offset: number = 0) => {
        return api.get<PostsResponse>("/api/posts/feed", {
            params: { limit, offset },
        });
    },

    // Lấy danh sách posts trending (engagement score cao) Explore
    getExplorePosts: (page: number = 1, limit = 20) => {
        return (
            api.get<PostsResponse>("/api/posts/explore"),
            {
                params: { page, limit },
            }
        );
    },

    // Lấy danh sách posts của một user
    getUserPosts: (
        userId: string,
        filter: "all" | "video" | "saved" = "all",
        limit: number = 20,
        offset: number = 0,
    ) => {
        return api.get<PostsResponse>(`/api/posts/user/${userId}`, {
            params: { filter, limit, offset },
        });
    },

    // Lấy chi tiết một post (bao gồm comments)
    getPostDetail: (postId: string) => {
        return api.get<PostDetailResponse>(`/api/post/${postId}`);
    },

    // Tạo post mới với ảnh hoặc video
    createPost: (file: File, caption?: string) => {
        const formData = new FormData();
        formData.append("file", file);
        if (caption) {
            formData.append("caption", caption);
        }
        return api.post("/api/post", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // Cập nhật caption của post
    updatePost: (postId: string, caption: string) => {
        return api.patch(`/api/post/${postId}`, { caption });
    },

    // Xóa post
    deletePost: (postId: string) => {
        return api.delete(`/api/post/${postId}`);
    },

    // Like một post
    likePost: (postId: string) => {
        return api.post(`/api/post/${postId}/like`);
    },

    // Unlike một post
    unlikePost: (postId: string) => {
        return api.post(`/api/post/${postId}/like`);
    },

    // Lưu post vào collection
    savePost: (postId: string) => {
        return api.post(`/api/post/${postId}/save`);
    },

    // Bỏ lưu post
    unSavePost: (postId: string) => {
        return api.post(`/api/post/${postId}/save`);
    },
};
