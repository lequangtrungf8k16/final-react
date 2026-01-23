import { postService } from "@/services/postService";
import type { Pagination, Post } from "@/types/post";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface PostState {
  posts: Post[];
  explorePosts: Post[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination | null;
  explorePagination: Pagination | null;
}

const initialState: PostState = {
  posts: [],
  explorePosts: [],
  isLoading: false,
  error: null,
  pagination: null,
  explorePagination: null,
};

// THUNKS

// Lấy News Feed
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
        let finalIsLiked = post.isLiked;
        if (Array.isArray(post.likedBy) && currentUserId) {
          const found = post.likedBy.some((item: any) => {
            const id = typeof item === "string" ? item : item._id;
            return id === currentUserId;
          });
          if (found) finalIsLiked = true;
        }

        let finalIsSaved = post.isSaved;
        if (Array.isArray(post.savedBy) && currentUserId) {
          const found = post.savedBy.some((item: any) => {
            const id = typeof item === "string" ? item : item._id;
            return id === currentUserId;
          });
          if (found) finalIsSaved = true;
        }

        return {
          ...post,
          isLiked: finalIsLiked ?? false,
          isSaved: finalIsSaved ?? false,
        };
      });

      return {
        ...data,
        data: { ...data, posts: fixedPosts },
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch feed",
      );
    }
  },
);

// Lấy Explore
export const fetchExplorePosts = createAsyncThunk(
  "post/getExplore",
  async (
    { page, limit }: { page?: number; limit?: number },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const currentUserId = state.auth.user?._id;
      const response = await postService.getExplorePosts(page, limit);
      const data = (response as any).data;

      const fixedPosts = data.posts.map((post: any) => ({
        ...post,
        isLiked:
          post.isLiked ||
          post.likedBy?.some(
            (id: any) =>
              (typeof id === "string" ? id : id._id) === currentUserId,
          ) ||
          false,
        isSaved:
          post.isSaved ||
          post.savedBy?.some(
            (id: any) =>
              (typeof id === "string" ? id : id._id) === currentUserId,
          ) ||
          false,
      }));

      return { ...data, posts: fixedPosts };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch explore",
      );
    }
  },
);

// Create Post
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

// Like
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

// Unlike
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

// Save
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

// Unsave
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

// SLICE

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.posts = [];
      state.pagination = null;
    },
    clearExplore: (state) => {
      state.explorePosts = [];
      state.explorePagination = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // GET FEED
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        const payloadData = action.payload as any;
        const postsData = payloadData.data?.posts || payloadData.posts;
        const paginationData =
          payloadData.data?.pagination || payloadData.pagination;

        if (postsData) {
          const { offset } = action.meta.arg;
          if (offset === 0) {
            state.posts = postsData;
          } else {
            state.posts = [...state.posts, ...postsData];
          }
          state.pagination = paginationData;
        }
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // GET explore
      .addCase(fetchExplorePosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchExplorePosts.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg.page === 1)
          state.explorePosts = action.payload.posts;
        else
          state.explorePosts = [...state.explorePosts, ...action.payload.posts];
        state.explorePagination = action.payload.pagination;
      })

      // CREATE POST
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

      // Like/Save
      .addCase(likePost.pending, (state, action) => {
        const postId = action.meta.arg;
        [state.posts, state.explorePosts].forEach((list) => {
          const p = list.find((x) => x._id === postId);
          if (p && !p.isLiked) {
            p.isLiked = true;
            p.likes += 1;
          }
        });
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        [state.posts, state.explorePosts].forEach((list) => {
          const p = list.find((x) => x._id === postId);
          if (p) {
            p.isLiked = false;
            p.likes = Math.max(0, p.likes - 1);
          }
        });
      })
      .addCase(savePost.pending, (state, action) => {
        const postId = action.meta.arg;
        [state.posts, state.explorePosts].forEach((list) => {
          const p = list.find((x) => x._id === postId);
          if (p) p.isSaved = true;
        });
      })
      .addCase(unSavePost.pending, (state, action) => {
        const postId = action.meta.arg;
        [state.posts, state.explorePosts].forEach((list) => {
          const p = list.find((x) => x._id === postId);
          if (p) p.isSaved = false;
        });
      });
  },
});

export const { clearPosts, clearExplore } = postSlice.actions;
export default postSlice.reducer;
