import SearchInput from "@/components/SearchInput";
import {
    Compass,
    Home,
    Heart,
    SquarePlay,
    Plus,
    Send,
    Circle,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

export default function BottomNavbar() {
    return (
        <div className="flex flex-col h-screen w-full relative bg-white">
            {/*Navbar phía trên */}
            <div className="flex justify-between items-center gap-4 mt-4 px-4">
                <h2 className="font-bold">Instagram</h2>
                <div className="flex items-center gap-3 text-gray-600">
                    <SearchInput />
                    <Heart />
                </div>
            </div>

            {/* Nội dung các trang */}
            <div className="py-4">
                <Outlet />
            </div>

            {/* Navbar phía dưới */}
            <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-evenly items-center gap-4 px-2 py-4 border-t-2 border-t-gray-200">
                <NavLink to={"/"}>
                    <Home />
                </NavLink>
                <NavLink to={"/explore"}>
                    <Compass />
                </NavLink>
                <NavLink to={"/reels"}>
                    <SquarePlay />
                </NavLink>
                <NavLink to={"/create"}>
                    <Plus />
                </NavLink>
                <NavLink to={"/message"}>
                    <Send />
                </NavLink>
                <NavLink to={"/profile"}>
                    <Circle />
                </NavLink>
            </div>
        </div>
    );
}
