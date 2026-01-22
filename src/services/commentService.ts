import api from "./api";

export const commentService = {
  // Lấy danh sách comment
  getComments: (postId: string) => {
    return api.get<{ data: Comment[] }>(`/api/posts/${postId}/comments`);
  },

  //   Gửi comment
  createComment: (postId: string, content: string) => {
    return api.post<Comment>(`/api/posts/${postId}/comments`, { content });
  },

  // Xóa comment
  deleteComment: (postId: string, commentId: string) => {
    return api.delete(`/api/posts/${postId}/comments/${commentId}`);
  },
};
