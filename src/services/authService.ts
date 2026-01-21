import type {
    ApiResponse,
    LoginData,
    LoginPayload,
    RegisterPayload,
} from "@/types";

import api from "./api";

export const authService = {
    // Đăng ký
    register: async (data: RegisterPayload) => {
        return api.post<ApiResponse<any>>("/api/auth/register", data);
    },
    // Đăng nhập
    login: async (data: LoginPayload) => {
        return api.post<ApiResponse<LoginData>>("/api/auth/login", data);
    },
    // Lấy thông tin user hiện tại
    getCurrentUser: async () => {
        return api.get<ApiResponse<any>>("/api/users/profile");
    },
    // Đăng xuất
    logout: async (refreshToken: string) => {
        return api.post("/api/auth/logout", { refreshToken });
    },
    verifyEmail: async (token: string) => {
        return api.post<ApiResponse<any>>(`/api/auth/verify-email/${token}`);
    },
};
