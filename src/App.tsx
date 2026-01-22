import { Route, Routes } from "react-router-dom";
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
import { useEffect, useState } from "react";
import { getCurrentUser } from "./store/slices/authSlice";
import { Toaster } from "sonner";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

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
        <Route>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        </Route>

        {/* Private */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/reels" element={<ReelsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/message" element={<MessagePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
