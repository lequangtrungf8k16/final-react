import { postService } from "@/services/postService";
import type { Pagination, Post } from "@/types/post";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: PostState = {
  posts: [],
  isLoading: false,
  error: null,
  pagination: null,
};

// Lấy danh sách tất cả posts (news feed), sorted by newest
export const getFeed = createAsyncThunk(
  "post/getFeed",
  async (
    { limit, offset }: { limit?: number; offset?: number },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const currentUser = state.auth.user;
      const currentUserId = currentUser?._id;

      const response = await postService.getFeed(limit, offset);
      const data = (response as any).data;

      const fixedPosts = data.posts.map((post: any) => {
        const isReallyLiked = post.likedBy?.some((id: string | any) => {
          const userIdStr = typeof id === "string" ? id : id._id;
          return userIdStr === currentUserId;
        });

        const isReallySaved = post.savedBy?.some((id: string | any) => {
          const userIdStr = typeof id === "string" ? id : id._id;
          return userIdStr === currentUserId;
        });

        return {
          ...post,
          isLiked: isReallyLiked ?? post.isLiked ?? false,
          isSaved: isReallySaved ?? post.isSaved ?? false,
        };
      });

      return {
        ...data,
        data: {
          ...data,
          posts: fixedPosts,
        },
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch feed",
      );
    }
  },
);

// Thunk Create Post
export const createPost = createAsyncThunk(
  "post/createPost",
  async (
    { file, caption }: { file: File; caption?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postService.createPost(file, caption);
      return (response.data as any).data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create post",
      );
    }
  },
);

// Like một post
export const likePost = createAsyncThunk(
  "post/likePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await postService.likePost(postId);
      return { postId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like post",
      );
    }
  },
);

// Unlike một post
export const unlikePost = createAsyncThunk(
  "post/unLikePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      await postService.unlikePost(postId);
      return { postId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unlike post",
      );
    }
  },
);

// Save một post
export const savePost = createAsyncThunk(
  "post/savePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      await postService.savePost(postId);
      return { postId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save post",
      );
    }
  },
);

// UnSave môt post
export const unSavePost = createAsyncThunk(
  "post/unSavePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      await postService.unSavePost(postId);
      return { postId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unsave post",
      );
    }
  },
);

// Slice
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.posts = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý Lấy danh sách tất cả posts (news feed)
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isLoading = false;

        const data = action.payload?.data || action.payload;

        if (data?.posts) {
          const { offset } = action.meta.arg;

          if (offset === 0) {
            state.posts = data.posts;
          } else {
            state.posts = [...state.posts, ...data.posts];
          }

          state.pagination = data.pagination;
        }
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create Post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload._id && state.posts) {
          state.posts.unshift(action.payload);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Xử lý like post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.isLiked = true;
          post.likes += 1;
        }
      })

      // Xử lý unlike post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.isLiked = false;
          post.likes = Math.max(0, post.likes - 1);
        }
      })

      // Xử lý save post
      .addCase(savePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.isSaved = true;
        }
      })

      // Xử lý unsave post
      .addCase(unSavePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.isSaved = false;
        }
      });
  },
});

export const { clearPosts } = postSlice.actions;
export default postSlice.reducer;
