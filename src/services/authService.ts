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
        return api.post<ApiResponse<any>>("/auth/register", data);
    },
    // Đăng nhập
    login: async (data: LoginPayload) => {
        return api.post<ApiResponse<LoginData>>("/auth/login", data);
    },
    // Lấy thông tin user hiện tại
    getCurrentUser: async () => {
        return api.get<ApiResponse<any>>("/users/profile");
    },
    // Đăng xuất
    logout: async (refreshToken: string) => {
        return api.post("auth/logout", { refreshToken });
    },
    verifyEmail: async (token: string) => {
        return api.post<ApiResponse<any>>(`/auth/verify-email/${token}`);
    },
};
