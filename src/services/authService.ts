import type {
  ApiResponse,
  LoginData,
  LoginPayload,
  RegisterPayload,
  ChangePasswordPayload,
  ResetPasswordPayload,
} from "@/types";

import api from "../lib/api";

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
  //   Yêu cầu xác thực mail
  verifyEmail: async (token: string) => {
    return api.post<ApiResponse<any>>(`/api/auth/verify-email/${token}`);
  },
  //   Yêu cầu gửi lại mail xác thực
  resendVerifyEmail: async (email: string) => {
    return api.post<ApiResponse<any>>("/api/auth/resend-verify-email", {
      email,
    });
  },

  // Quên mật khẩu
  forgotPassword: async (email: string) => {
    return api.post<ApiResponse<any>>("/api/auth/forgot-password", { email });
  },

  // Đặt lại mật khẩu
  resetPassword: async (data: ResetPasswordPayload) => {
    return api.post<ApiResponse<any>>("/api/auth/reset-password", data);
  },

  // Đổi mật khẩu
  changePassword: async (data: ChangePasswordPayload) => {
    return api.post<ApiResponse<any>>("/api/auth/change-password", data);
  },
};
