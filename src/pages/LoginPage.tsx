import AuthWrapper from "@/components/auth/AuthWrapper";
import LoginForm from "@/components/auth/LoginForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";
import type { LoginPayload } from "@/types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  const [initialData, setInitialData] = useState<LoginPayload | undefined>(
    undefined,
  );

  // Nếu đã đăng nhập từ trước, tự động về Home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Điền dữ liệu nếu chuyển từ trang Register sang
  useEffect(() => {
    if (location.state?.email && location.state?.password) {
      setInitialData({
        email: location.state.email,
        password: location.state.password,
      });
    }
  }, [location.state]);

  const handleLogin = async (data: LoginPayload) => {
    try {
      // Gọi action login
      const resultAction = await dispatch(loginUser(data));

      // Kiểm tra kết quả ngay tại đây để chuyển trang
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Login successfully!");
        navigate("/", { replace: true });
      } else {
        console.log("Login failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  const goToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <AuthWrapper title="Login" subTitle="">
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        defaultValues={initialData}
        rootError={error}
        onRegister={handleNavigateToRegister}
        onForgotPassword={goToForgotPassword}
      />
    </AuthWrapper>
  );
}
