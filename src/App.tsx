import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import MessagePage from "./pages/MessagePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ReelsPage from "./pages/ReelsPage";

export default function App() {
    return (
        <>
            <Routes>
                <Route>
                    <Route path="/login" element={<LoginPage />} />
                </Route>

                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/reels" element={<ReelsPage />} />
                    <Route path="/message" element={<MessagePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}
