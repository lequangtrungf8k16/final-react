import AuthWrapper from "@/components/auth/AuthWrapper";
import LoginForm from "@/components/auth/LoginForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";
import type { LoginPayload } from "@/types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

    useEffect(() => {
        if (location.state?.email && location.state?.password) {
            setInitialData({
                email: location.state.email,
                password: location.state.password,
            });
        }
    }, [location.state]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = (data: LoginPayload) => {
        dispatch(loginUser(data));
    };

    const handleNavigateToRegister = () => {
        navigate("/register");
    };

    return (
        <AuthWrapper title="Login" subTitle="">
            <LoginForm
                onSubmit={handleLogin}
                isLoading={isLoading}
                defaultValues={initialData}
                rootError={error}
                onRegister={handleNavigateToRegister}
            />
        </AuthWrapper>
    );
}
