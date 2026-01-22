import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import ChatWindow from "@/features/chat/ChatWindow";
import BottomNavbar from "./BottomNavbar";
import CreatePostModal from "@/components/CreatePostModal";
import { useState } from "react";

export default function MainLayout() {
    const [isCreateOpen, setCreateOpen] = useState(false);
    return (
        <div className="container md:flex w-full relative">
            {/* Sidebar nằm dọc */}
            <div className="hidden md:block h-screen z-50 sticky top-0">
                <Sidebar onOpenCreate={() => setCreateOpen(true)} />
            </div>

            <main className="flex-1 z-30 w-full bg-background text-foreground relative">
                <div className="md:flex flex-col w-full min-h-screen hidden">
                    {/* Hiển thị các trang */}
                    <div className="flex-1 px-2 py-4">
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
                <BottomNavbar onOpenCreate={() => setCreateOpen(true)} />
            </div>

            <CreatePostModal open={isCreateOpen} onOpenChange={setCreateOpen} />
        </div>
    );
}
