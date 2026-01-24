import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAppDispatch } from "./store/hooks";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./store/slices/authSlice";
import { Toaster } from "sonner";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ChatPage from "./pages/chat/ChatPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PublicRoute from "./components/auth/PublicRoute";

export default function App() {
  const dispatch = useAppDispatch();
  const [isCheckingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(getCurrentUser())
        .unwrap()
        .finally(() => {
          setCheckingToken(false);
        });
    } else {
      setCheckingToken(false);
    }
  }, [dispatch]);

  if (isCheckingToken) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />

      <Routes>
        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
        </Route>

        <Route>
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        </Route>

        {/* Private */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />

            <Route path="/notifications" element={<NotificationsPage />} />

            <Route path="/messages" element={<ChatPage />} />

            <Route
              path="/reels"
              element={
                <div className="flex justify-center pt-20 font-bold text-xl">
                  Reels Coming Soon
                </div>
              }
            />

            {/* Profile Routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
