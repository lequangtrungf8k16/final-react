import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import ChatWindow from "@/features/chat/ChatWindow";
import BottomNavbar from "./BottomNavbar";

export default function MainLayout() {
    return (
        <div className="container md:flex w-full relative">
            {/* Sidebar nằm dọc */}
            <div className="hidden md:block h-screen z-50 sticky top-0">
                <Sidebar />
            </div>

            <main className="flex-1 z-30 w-full bg-white relative">
                <div className="flex flex-col w-full min-h-screen">
                    {/* Hiển thị các trang */}
                    <div className="flex-1 py-4">
                        <Outlet />
                    </div>

                    {/* Chân trang */}
                    <div className="hidden md:block">
                        <Footer />
                    </div>
                </div>
            </main>

            <div>
                <ChatWindow />
            </div>

            {/* Sidebar nằm ngang khi ở màn hình điện thoại */}
            <div className="md:hidden">
                <BottomNavbar />
            </div>
        </div>
    );
}
