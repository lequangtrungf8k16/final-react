import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import BottomNavbar from "./BottomNavbar";
import CreatePostModal from "@/components/create-post/CreatePostModal";
import { useState } from "react";
import ChatWidget from "@/components/chat/ChatWidget";

export default function MainLayout() {
  const [isCreateOpen, setCreateOpen] = useState(false);

  return (
    <div className="container md:flex w-full relative min-h-screen">
      {/* Sidebar nằm dọc (Desktop) */}
      <div className="hidden md:block h-screen z-50 sticky top-0">
        <Sidebar onOpenCreate={() => setCreateOpen(true)} />
      </div>

      {/* Nội dung chính */}
      <main className="flex-1 z-40 w-full bg-background text-foreground relative">
        <div className="md:flex flex-col w-full min-h-screen hidden">
          {/* Hiển thị các trang (Outlet) */}
          <div className="flex-1 px-2 py-4">
            <Outlet />
          </div>

          {/* Chân trang */}
          <div className="hidden md:block">
            <Footer />
          </div>
        </div>
      </main>

      {/* Sidebar nằm ngang (Mobile) */}
      <div className="md:hidden">
        <BottomNavbar onOpenCreate={() => setCreateOpen(true)} />
      </div>

      <ChatWidget />

      <CreatePostModal open={isCreateOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
