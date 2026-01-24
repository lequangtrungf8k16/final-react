import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/userService";
import type { User } from "@/types/user";
import { setUser } from "./authSlice";

interface UserState {
  selectedUser: User | null;
  searchResults: User[];
  isLoading: boolean;
  isSearching: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: UserState = {
  selectedUser: null,
  searchResults: [],
  isLoading: false,
  isSearching: false,
  isUpdating: false,
  error: null,
};

// Lấy thông tin user theo ID
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(userId);
      const responseBody = (response as any).data
        ? (response as any).data
        : response;

      if (responseBody && responseBody.data) {
        return responseBody.data;
      }
      return responseBody;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);

// Cập nhật thông tin User (Profile)
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData: FormData, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.updateProfile(formData);
      const data =
        (response as any).data?.data || (response as any).data || response;

      dispatch(setUser(data));

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

// Follow User
export const followUser = createAsyncThunk(
  "user/followUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      await userService.followUser(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to follow user",
      );
    }
  },
);

// Unfollow User
export const unfollowUser = createAsyncThunk(
  "user/unfollowUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      await userService.unfollowUser(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unfollow user",
      );
    }
  },
);

// Search Users
export const searchUsers = createAsyncThunk(
  "user/searchUsers",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await userService.searchUsers(query);
      const data = (response as any).data?.data || (response as any).data || [];
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User By ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (
          state.selectedUser &&
          state.selectedUser._id === action.payload._id
        ) {
          state.selectedUser = { ...state.selectedUser, ...action.payload };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      .addCase(searchUsers.pending, (state) => {
        state.isSearching = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state) => {
        state.isSearching = false;
        state.searchResults = [];
      })

      // Follow User
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.selectedUser && state.selectedUser._id === action.payload) {
          state.selectedUser.isFollowing = true;
          state.selectedUser.followersCount += 1;
        }
        const userInSearch = state.searchResults.find(
          (u) => u._id === action.payload,
        );
        if (userInSearch) {
          userInSearch.isFollowing = true;
        }
      })

      // Unfollow User
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.selectedUser && state.selectedUser._id === action.payload) {
          state.selectedUser.isFollowing = false;
          state.selectedUser.followersCount = Math.max(
            0,
            state.selectedUser.followersCount - 1,
          );
        }
        const userInSearch = state.searchResults.find(
          (u) => u._id === action.payload,
        );
        if (userInSearch) {
          userInSearch.isFollowing = false;
        }
      });
  },
});

export const { clearSelectedUser, clearSearchResults } = userSlice.actions;
export default userSlice.reducer;
