import type { User } from "./user";

// Lấy dữ liệu khi Login thành công
export interface LoginData {
    user: User;
    accessToken: string;
    refreshToken: string;
}

// Thông tin gửi khi đăng ký
export interface RegisterPayload {
    email: string;
    username: string;
    fullname: string;
    password: string;
    confirmPassword: string;
}

// Thông tin gửi khi Login
export interface LoginPayload {
    email: string;
    password: string;
}

// Lắng nghe state
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    accessToken?: string | null;
}
