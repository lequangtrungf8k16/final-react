import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { LoginPayload, RegisterPayload } from "@/types";
import { authService } from "@/services/authService";
import type { User } from "@/types";

interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

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

export const loginUser = createAsyncThunk<LoginResponse, LoginPayload>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.login(payload);
      return response.data as unknown as LoginResponse;
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
      return response.data.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || "Login failed");
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

// Trong src/store/slices/authSlice.ts

export const getCurrentUser = createAsyncThunk<User>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();

      // 🔥 DEBUG: Xem API thực sự trả về cái gì
      console.log("🔥 API getCurrentUser Response:", response);

      // Xử lý linh hoạt các trường hợp response
      const resData = response as any;

      // Trường hợp 1: Axios trả về full response -> data -> data (Chuẩn theo API doc)
      if (resData.data && resData.data.data) {
        return resData.data.data;
      }

      // Trường hợp 2: Service đã bóc tách, hoặc API trả trực tiếp data
      if (resData.data) {
        return resData.data;
      }

      // Trường hợp 3: response chính là user object
      return resData;
    } catch (error: any) {
      console.error("❌ Lỗi getCurrentUser:", error);
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },

  extraReducers: (builder) => {
    builder
      // Xử lý Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        const data = action.payload;
        if (data?.tokens?.accessToken) {
          state.isAuthenticated = true;
          state.accessToken = data.tokens.accessToken;
          state.user = data.user;

          localStorage.setItem("accessToken", data.tokens.accessToken);
          if (data.tokens.refreshToken) {
            localStorage.setItem("refreshToken", data.tokens.refreshToken);
          }
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Xử lý Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getCurrentUser.pending, () => {
        //
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })
      // Xử lý xác thực email
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
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
