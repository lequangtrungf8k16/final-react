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
  password: string;
  confirmPassword: string;
  fullName: string;
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

// Payload đổi mật khẩu (User đang đăng nhập)
export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Payload reset mật khẩu (Quên mật khẩu, dùng token)
export interface ResetPasswordPayload {
  token: string;
  password?: string;
  confirmPassword?: string;
}

// Wrapper phản hồi API chung
export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode?: number;
  success?: boolean;
}
