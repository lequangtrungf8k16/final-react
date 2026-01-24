import AuthWrapper from "@/components/auth/AuthWrapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetPassword } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = useParams();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [isSuccess, setIsSuccess] = useState(false);

  // State quản lý ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error("Invalid token!");
      return;
    }

    try {
      await dispatch(
        resetPassword({
          token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      ).unwrap();

      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      toast.error((err as string) || "Failed to reset password");
    }
  };

  if (isSuccess) {
    return (
      <AuthWrapper title="Success!">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="bg-green-50 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <p className="text-gray-600">
            Your password has been reset successfully. You can now login with
            your new password.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Go to Login
          </button>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper
      title="Reset Password"
      subTitle="Enter your new password below"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="New Password..."
              className={`w-full border pl-10 pr-10 p-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {/* Nút bấm Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="Confirm New Password..."
              className={`w-full border pl-10 pr-10 p-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {/* Nút bấm Eye Icon */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 mt-2"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthWrapper>
  );
}
