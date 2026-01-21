import AuthWrapper from "@/components/auth/AuthWrapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "@/store/slices/authSlice";
import type { RegisterPayload } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

const registerSchema = z
    .object({
        username: z
            .string()
            .min(3, "Username must be at least 3 characters long"),
        fullname: z.string().min(3, "Fullname is too short"),
        email: z.string().email("Invalid email"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "The confirmPassword does not match",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isSuccess, setIsSuccess] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await dispatch(registerUser(data as RegisterPayload)).unwrap();

            setUserEmail(data.email);
            setIsSuccess(true);
            toast.success("Register success");
        } catch (error: any) {
            toast.error(error);
        }
    };

    const handleOpenMail = () => {
        const url = "https://mail.google.com/mail/u/0/#inbox";

        window.open(url, "_blank");
    };

    if (isSuccess) {
        return (
            <AuthWrapper title="Check Email">
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-blue-50 p-4 rounded-full">
                            <Mail className="w-12 h-12 text-blue-600" />
                        </div>
                    </div>

                    <p className="text-gray-500 text-sm">
                        Please check your inbox {userEmail} (and spam folder) to
                        complete your registration
                    </p>

                    <button
                        onClick={handleOpenMail}
                        className="w-full bg-blue-600 text-white font-medium p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 select-none"
                    >
                        Open Your Mailbox nơư <ArrowRight size={18} />
                    </button>

                    <button
                        onClick={() => navigate("/login")}
                        className="text-blue-600 text-sm hover:underline font-medium select-none"
                    >
                        Verify, Login now
                    </button>
                </div>
            </AuthWrapper>
        );
    }

    return (
        <AuthWrapper title="Register">
            {error && (
                <div className="mb-4 text-red-500 text-center text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block font-medium">Username</label>
                    <input
                        {...register("username")}
                        placeholder="Username..."
                        className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.username
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                        }`}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-xs mt-1 ml-1">
                            {errors.username.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block font-medium">Fullname</label>
                    <input
                        {...register("fullname")}
                        placeholder="Fullname..."
                        className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.fullname
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                        }`}
                    />
                    {errors.fullname && (
                        <p className="text-red-500 text-xs mt-1 ml-1">
                            {errors.fullname.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        {...register("email")}
                        placeholder="Email..."
                        className="w-full mt-1 border p-2 rounded-lg"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block font-medium">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            placeholder="Password..."
                            className={`w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                errors.password
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700 select-none"
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-red-500 text-xs">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword")}
                            placeholder="Confirm Password..."
                            className={`w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                errors.confirmPassword
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                            }`}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700 select-none"
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
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
                    className="w-full bg-blue-600 text-white p-3 rounded-lg cursor-pointer hover:bg-blue-700 disabled:bg-gray-400 select-none"
                >
                    {isLoading ? "Loading..." : "Register"}
                </button>
            </form>
        </AuthWrapper>
    );
}
