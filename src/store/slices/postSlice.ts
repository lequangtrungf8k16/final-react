import { postService } from "@/services/postService";
import type { Pagination, Post } from "@/types/post";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface PostState {
  posts: Post[];
  explorePosts: Post[];
  userPosts: Post[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination | null;
  explorePagination: Pagination | null;
  userPostsPagination: Pagination | null;
}

const initialState: PostState = {
  posts: [],
  explorePosts: [],
  userPosts: [],
  isLoading: false,
  error: null,
  pagination: null,
  explorePagination: null,
  userPostsPagination: null,
};

// Chuẩn hóa dữ liệu API
const parseApiResponse = (response: any) => {
  let rawData = response.data ? response.data : response;
  if (rawData.data && rawData.success !== undefined) {
    rawData = rawData.data;
  }
  const pagination: Pagination = {
    hasMore: rawData.hasMore ?? false,
    totalItems: rawData.total ?? 0,
    totalPages: Math.ceil((rawData.total || 0) / (rawData.limit || 10)),
    currentPage: rawData.offset
      ? rawData.offset / (rawData.limit || 10) + 1
      : 1,
  };
  return {
    posts: rawData.posts || [],
    pagination: pagination,
  };
};

const mapPostData = (post: any) => ({
  ...post,
  likesCount:
    typeof post.likes === "number" ? post.likes : post.likesCount || 0,
  isLiked: !!post.isLiked,
  isSaved: !!post.isSaved,
});

// THUNKS

export const getFeed = createAsyncThunk(
  "post/getFeed",
  async (
    { limit, offset }: { limit?: number; offset?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await postService.getFeed(limit, offset);
      const { posts, pagination } = parseApiResponse(response);
      const fixedPosts = posts.map(mapPostData);
      return { posts: fixedPosts, pagination };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch feed",
      );
    }
  },
);

export const fetchExplorePosts = createAsyncThunk(
  "post/getExplore",
  async (
    { page, limit }: { page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await postService.getExplorePosts(page, limit);
      const { posts, pagination } = parseApiResponse(response);
      const fixedPosts = posts.map(mapPostData);
      return { posts: fixedPosts, pagination };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch explore",
      );
    }
  },
);

export const fetchUserPosts = createAsyncThunk(
  "post/getUserPosts",
  async (
    {
      userId,
      filter,
      limit,
      offset,
    }: {
      userId: string;
      filter?: "all" | "video" | "saved";
      limit?: number;
      offset?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postService.getUserPosts(
        userId,
        filter,
        limit,
        offset,
      );
      const { posts, pagination } = parseApiResponse(response);
      const fixedPosts = posts.map(mapPostData);
      return { posts: fixedPosts, pagination };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user posts",
      );
    }
  },
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (
    { file, caption }: { file: File; caption?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postService.createPost(file, caption);
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create post",
      );
    }
  },
);

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

export const unlikePost = createAsyncThunk(
  "post/unLikePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await postService.unlikePost(postId);
      return { postId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unlike post",
      );
    }
  },
);

export const savePost = createAsyncThunk(
  "post/savePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await postService.savePost(postId);
      return { postId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save post",
      );
    }
  },
);

export const unSavePost = createAsyncThunk(
  "post/unSavePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await postService.unSavePost(postId);
      return { postId, data: response.data };
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
    clearUserPosts: (state) => {
      state.userPosts = [];
      state.userPostsPagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Feed
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        const { posts, pagination } = action.payload;
        if (action.meta.arg.offset === 0) {
          state.posts = posts;
        } else {
          const newPosts = posts.filter(
            (p: Post) =>
              !state.posts.some((existing) => existing._id === p._id),
          );
          state.posts = [...state.posts, ...newPosts];
        }
        state.pagination = pagination;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Explore
      .addCase(fetchExplorePosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchExplorePosts.fulfilled, (state, action) => {
        state.isLoading = false;
        const { posts, pagination } = action.payload;
        if (action.meta.arg.page === 1) state.explorePosts = posts;
        else state.explorePosts = [...state.explorePosts, ...posts];
        state.explorePagination = pagination;
      })

      // User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        const { posts, pagination } = action.payload;
        if (action.meta.arg.offset === 0) state.userPosts = posts;
        else state.userPosts = [...state.userPosts, ...posts];
        state.userPostsPagination = pagination;
      })

      // Create
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload._id)
          state.posts.unshift(mapPostData(action.payload));
      })

      // Like
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, data } = action.payload;
        const updateLists = (list: Post[]) => {
          const p = list.find((x) => x._id === postId);
          if (p) {
            p.isLiked = true;
            if (data && typeof data.likes === "number") {
              p.likesCount = data.likes;
            } else {
              p.likesCount = (p.likesCount || 0) + 1;
            }
          }
        };
        [state.posts, state.explorePosts, state.userPosts].forEach(updateLists);
      })

      // Unlike
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId, data } = action.payload;
        const updateLists = (list: Post[]) => {
          const p = list.find((x) => x._id === postId);
          if (p) {
            p.isLiked = false;
            if (data && typeof data.likes === "number") {
              p.likesCount = data.likes;
            } else {
              p.likesCount = Math.max(0, (p.likesCount || 0) - 1);
            }
          }
        };
        [state.posts, state.explorePosts, state.userPosts].forEach(updateLists);
      })

      // Save
      .addCase(savePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const updateLists = (list: Post[]) => {
          const p = list.find((x) => x._id === postId);
          if (p) p.isSaved = true;
        };
        [state.posts, state.explorePosts, state.userPosts].forEach(updateLists);
      })

      // Unsave
      .addCase(unSavePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const updateLists = (list: Post[]) => {
          const p = list.find((x) => x._id === postId);
          if (p) p.isSaved = false;
        };
        [state.posts, state.explorePosts, state.userPosts].forEach(updateLists);
      });
  },
});

export const { clearPosts, clearExplore, clearUserPosts } = postSlice.actions;
export default postSlice.reducer;
