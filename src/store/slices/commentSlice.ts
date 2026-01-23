import { commentService } from "@/services/commentService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Comment } from "@/types/post";

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  isLoading: false,
  error: null,
};

// --- THUNKS ---

// Fetch Comments
export const fetchComments = createAsyncThunk(
  "comment/fetchComments",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await commentService.getComments(postId);

      const comments = (response.data as any).comments;

      return Array.isArray(comments) ? comments : [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load comments",
      );
    }
  },
);

// Add Comment
export const addComment = createAsyncThunk(
  "comment/addComment",
  async (
    { postId, content }: { postId: string; content: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await commentService.createComment(postId, content);

      const newComment = response.data as any;

      return newComment.data || newComment;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to post comment",
      );
    }
  },
);

// Delete comment
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (
    { postId, commentId }: { postId: string; commentId: string },
    { rejectWithValue },
  ) => {
    try {
      await commentService.deleteComment(postId, commentId);
      return commentId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment",
      );
    }
  },
);

// --- SLICE ---
const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload as Comment[];

        if (state.comments.length > 0) {
          state.comments.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        }
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ADD
      .addCase(addComment.fulfilled, (state, action) => {
        if (action.payload) {
          state.comments.unshift(action.payload as Comment);
        }
      })

      // DELETE
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload,
        );
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
