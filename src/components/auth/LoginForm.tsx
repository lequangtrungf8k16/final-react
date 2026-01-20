import type { LoginPayload } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { data } from "react-router-dom";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Vui lòng nhập email")
        .email("Email không đúng định dạng"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: LoginPayload) => void;
    isLoading: boolean;
    defaultValues?: LoginPayload;
}

export default function LoginForm({
    onSubmit,
    isLoading,
    defaultValues,
}: LoginFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (defaultValues) {
            setValue("email", defaultValues.email);
            setValue("password", defaultValues.password);
        }
    }, [defaultValues, setValue]);

    return (
        <form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className="space-y-4"
        >
            <div>
                <label className="block font-medium">Email</label>
                <input
                    {...register("email")}
                    className={`w-full mt-1 border p-2 rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                    type="email"
                    placeholder="Email..."
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block font-medium">Password</label>
                <input
                    {...register("password")}
                    className={`w-full mt-1 border p-2 rounded-lg focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                    type="password"
                    placeholder="Password..."
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer transition-all"
            >
                {isLoading ? "Loading..." : "Login"}
            </button>
        </form>
    );
}
