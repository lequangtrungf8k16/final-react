import type { LoginPayload } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Please enter email")
        .email("The email is not in the correct format"),
    password: z
        .string()
        .min(6, "The password must be at least 6 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: LoginPayload) => void;
    isLoading: boolean;
    defaultValues?: LoginPayload;
    rootError?: string | null;
    onRegister?: () => void;
}

export default function LoginForm({
    onSubmit,
    onRegister,
    isLoading,
    defaultValues,
    rootError,
}: LoginFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const [showPassword, setShowPassword] = useState(false);

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
            {rootError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={18} />
                    <span>{rootError}</span>
                </div>
            )}

            <div>
                <label className="block font-medium">Email</label>
                <input
                    {...register("email")}
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
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
                <div className="relative">
                    <input
                        {...register("password")}
                        className={`w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password..."
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
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer transition-all select-none"
            >
                {isLoading ? "Loading..." : "Login"}
            </button>

            <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">
                    Don't have an account yet?{" "}
                    <button
                        type="button"
                        onClick={onRegister}
                        className="text-blue-500 dark:text-white font-medium hover:underline cursor-pointer select-none"
                    >
                        Register now
                    </button>
                </p>
            </div>
        </form>
    );
}
