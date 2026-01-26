import api from "../lib/api";
import type { User } from "@/types/user";

export const userService = {
  // Lấy thông tin user hiện tại (Me)
  getProfile: () => {
    return api.get<{ success: boolean; data: User }>("/api/users/profile");
  },

  // Lấy thông tin user khác theo ID
  getUserById: (userId: string) => {
    return api.get<{ success: boolean; data: User }>(`/api/users/${userId}`);
  },

  updateProfile: (data: FormData) => {
    return api.patch<{ success: boolean; data: User }>(
      "/api/users/profile",
      data,
    );
  },

  // Tìm kiếm user
  searchUsers: (query: string) => {
    return api.get<{
      success: boolean;
      data: User[];
    }>("/api/users/search", {
      params: { q: query },
    });
  },

  // Follow user
  followUser: (userId: string) => {
    return api.post(`/api/follow/${userId}/follow`);
  },

  // Unfollow user
  unfollowUser: (userId: string) => {
    return api.delete(`/api/follow/${userId}/follow`);
  },

  // Lấy danh sách Followers
  getFollowers: (userId: string, page = 1, limit = 20) => {
    return api.get(`/api/follow/${userId}/followers`, {
      params: { page, limit },
    });
  },

  // Lấy danh sách Following
  getFollowing: (userId: string, page = 1, limit = 20) => {
    return api.get(`/api/follow/${userId}/following`, {
      params: { page, limit },
    });
  },

  // Lấy danh sách gợi ý người dùng
  getSuggestedUsers: (limit = 10) => {
    return api.get<{
      success: boolean;
      data: User[];
    }>("/api/users/suggested", {
      params: { limit },
    });
  },
};
