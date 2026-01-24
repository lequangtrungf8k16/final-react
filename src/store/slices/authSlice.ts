import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  LoginPayload,
  RegisterPayload,
  ChangePasswordPayload,
  ResetPasswordPayload,
} from "@/types";
import { authService } from "@/services/authService";
import type { User } from "@/types";

// State
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,
};

// THUNKS

export const loginUser = createAsyncThunk<any, LoginPayload>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.login(payload);
      const data = response.data as any;
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const registerUser = createAsyncThunk<any, RegisterPayload>(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.register(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const getCurrentUser = createAsyncThunk<User>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      const resData = response.data as any;
      if (resData.data) return resData.data;
      return resData;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Get profile failed",
      );
    }
  },
);

export const verifyEmail = createAsyncThunk<any, string>(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Verification failed",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      return true;
    } catch (error: any) {
      console.error("Logout API error", error);
      return rejectWithValue(error.response?.data?.message);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },
);

export const resendVerifyEmail = createAsyncThunk(
  "auth/resendVerifyEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.resendVerifyEmail(email);
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend email",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.forgotPassword(email);
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to request password reset",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      await authService.resetPassword(data);
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password",
      );
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data: ChangePasswordPayload, { rejectWithValue }) => {
    try {
      await authService.changePassword(data);
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password",
      );
    }
  },
);

// SLICE

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },

  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        const payload = action.payload;

        const accessToken = payload?.tokens?.accessToken;
        const refreshToken = payload?.tokens?.refreshToken;
        const user = payload?.user;

        if (accessToken) {
          state.isAuthenticated = true;
          state.accessToken = accessToken;
          state.user = user;
          state.error = null;

          localStorage.setItem("accessToken", accessToken);
          if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        } else {
          state.isAuthenticated = false;
          state.error = "Login failed: No access token received";
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Matchers (Resend, Forgot, Reset, Change Password)
      .addMatcher(
        (action) =>
          [
            resendVerifyEmail.pending.type,
            forgotPassword.pending.type,
            resetPassword.pending.type,
            changePassword.pending.type,
          ].includes(action.type),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          [
            resendVerifyEmail.fulfilled.type,
            forgotPassword.fulfilled.type,
            resetPassword.fulfilled.type,
            changePassword.fulfilled.type,
          ].includes(action.type),
        (state) => {
          state.isLoading = false;
        },
      )
      .addMatcher(
        (action) =>
          [
            resendVerifyEmail.rejected.type,
            forgotPassword.rejected.type,
            resetPassword.rejected.type,
            changePassword.rejected.type,
          ].includes(action.type),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
