import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import MessagePage from "./pages/MessagePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ReelsPage from "./pages/ReelsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAppDispatch } from "./store/hooks";
import { useEffect } from "react";
import { getCurrentUser } from "./store/slices/authSlice";
import { Toaster } from "sonner";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

export default function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            dispatch(getCurrentUser());
        }
    }, [dispatch]);

    return (
        <>
            <Toaster position="top-right" richColors />

            <Routes>
                {/* Public */}
                <Route>
                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/verify" element={<VerifyEmailPage />} />
                </Route>

                {/* Private */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/reels" element={<ReelsPage />} />
                        <Route
                            path="/notifications"
                            element={<NotificationsPage />}
                        />
                        <Route path="/message" element={<MessagePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}
