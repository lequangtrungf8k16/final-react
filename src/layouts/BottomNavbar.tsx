import SearchInput from "@/components/SearchInput";
import type { RootState } from "@/store/store";
import { Compass, Home, Heart, SquarePlay, Plus, Send } from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

interface BottomNavbarProps {
  onOpenCreate: () => void;
}

export default function BottomNavbar({ onOpenCreate }: BottomNavbarProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  const firstLetter = user?.username ? user.username[0].toUpperCase() : "?";

  return (
    <div className="flex flex-col h-screen w-full relative bg-white dark:bg-black dark:border-gray-800">
      {/*Navbar phía trên */}
      <div className="fixed top-0 left-0 right-0 z-60 flex justify-between items-center gap-4 px-4 py-2 bg-white dark:bg-black dark:border-gray-800 border-b-2 border-b-gray-100">
        <NavLink to="/">
          <h2 className="font-bold">Instagram Fake</h2>
        </NavLink>
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-full max-w-50">
            <SearchInput />
          </div>
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
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-evenly items-center gap-4 px-2 py-4 bg-white dark:bg-black dark:border-gray-800 border-t-2 border-t-gray-200">
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
        <NavLink to={"/messages"}>
          <Send />
        </NavLink>
        <NavLink to={"/profile"}>
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
              {firstLetter}
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );
}
