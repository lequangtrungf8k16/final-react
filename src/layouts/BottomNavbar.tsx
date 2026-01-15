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

interface BottomNavbarProps {
    onOpenCreate: () => void;
}
export default function BottomNavbar({ onOpenCreate }: BottomNavbarProps) {
    return (
        <div className="flex flex-col h-screen w-full relative bg-white">
            {/*Navbar phía trên */}
            <div className="fixed top-0 left-0 right-0 flex justify-between items-center gap-4 px-4 py-2 bg-white border-b-2 border-b-gray-100">
                <h2 className="font-bold">Instagram</h2>
                <div className="flex items-center gap-3 text-gray-600">
                    <SearchInput />
                    <NavLink to="/notifications">
                        {({ isActive }) => (
                            <Heart className={isActive ? "text-black" : ""} />
                        )}
                    </NavLink>
                </div>
            </div>

            {/* Nội dung các trang */}
            <div className="flex-1 px-2 py-14">
                <Outlet />
            </div>

            {/* Navbar phía dưới */}
            <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-evenly items-center gap-4 px-2 py-4 bg-white border-t-2 border-t-gray-200">
                <NavLink to={"/"}>
                    <Home />
                </NavLink>
                <NavLink to={"/explore"}>
                    <Compass />
                </NavLink>
                <NavLink to={"/reels"}>
                    <SquarePlay />
                </NavLink>
                <div onClick={onOpenCreate} className="cursor-pointer">
                    <Plus />
                </div>
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
