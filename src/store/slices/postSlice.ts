import { postService } from "@/services/postService";
import type { Pagination, Post, PostsResponse } from "@/types/post";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
export const getFeed = createAsyncThunk<
    PostsResponse,
    { limit?: number; offset?: number }
>("post/getFeed", async ({ limit, offset }, { rejectWithValue }) => {
    try {
        const response = await postService.getFeed(limit, offset);
        return response as unknown as PostsResponse;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch feed",
        );
    }
});

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
            // Xử lý Lấy danh sách tất cả posts (news feed), sorted by newest
            .addCase(getFeed.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFeed.fulfilled, (state, action) => {
                state.isLoading = false;

                if (action.payload?.data) {
                    state.posts = action.payload.data.posts;
                    state.pagination = action.payload.data.pagination;
                }
            })
            .addCase(getFeed.rejected, (state, action) => {
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
            });
    },
});

export const { clearPosts } = postSlice.actions;
export default postSlice.reducer;
