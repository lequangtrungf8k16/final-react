import AuthWrapper from "@/components/auth/AuthWrapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "@/store/slices/authSlice";
import type { RegisterPayload } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

const registerSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const responseData = await dispatch(
                registerUser(data as RegisterPayload),
            ).unwrap();

            if (responseData && responseData.token) {
                toast.success("Verify-email please");

                navigate("/verify-email", {
                    state: {
                        token: responseData.token,
                        email: data.email,
                        password: data.password,
                    },
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthWrapper title="Register" subTitle="">
            {error && (
                <div className="mb-4 text-red-500 text-center text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="Password..."
                        className="w-full mt-1 border p-2 rounded-lg"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs">
                            {errors.password.message}
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg cursor-pointer hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isLoading ? "Loading..." : "Register"}
                </button>
            </form>
        </AuthWrapper>
    );
}
