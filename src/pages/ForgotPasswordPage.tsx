import AuthWrapper from "@/components/auth/AuthWrapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { forgotPassword } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

// Validate Email
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await dispatch(forgotPassword(data.email)).unwrap();
      setIsSent(true);
      toast.success("Reset link sent to your email!");
    } catch (err) {
      toast.error((err as string) || "Failed to send reset link");
    }
  };

  // Giao diện khi đã gửi thành công
  if (isSent) {
    return (
      <AuthWrapper title="Check Your Email">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="bg-blue-50 p-4 rounded-full">
            <Mail className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-gray-600">
            We have sent a password reset link to your email address. Please
            check your inbox (and spam folder).
          </p>
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>
      </AuthWrapper>
    );
  }

  // Giao diện Form nhập Email
  return (
    <AuthWrapper
      title="Forgot Password"
      subTitle="Enter your email to reset password"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            {...register("email")}
            placeholder="Enter your email..."
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-gray-600 text-sm hover:text-black font-medium"
          >
            Back to Login
          </button>
        </div>
      </form>
    </AuthWrapper>
  );
}
