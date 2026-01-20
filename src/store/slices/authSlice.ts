import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
} from "@reduxjs/toolkit";
import type {
    AuthState,
    LoginData,
    LoginPayload,
    RegisterPayload,
} from "@/types";
import { authService } from "@/services/authService";
import type { User } from "@/types";
import { tr } from "zod/v4/locales";

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    accessToken: localStorage.getItem("accessToken"),
};

export const loginUser = createAsyncThunk<LoginData, LoginPayload>(
    "auth/login",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await authService.login(payload);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed",
            );
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
            return response.data.data;
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
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;

                localStorage.setItem("accessToken", action.payload.accessToken);
                if (action.payload.refreshToken) {
                    localStorage.setItem(
                        "accessToken",
                        action.payload.refreshToken,
                    );
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
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.isLoading = false;
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
