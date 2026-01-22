import SidebarDropDown from "./SidebarDropDown";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

import {
    Home,
    Instagram,
    Search,
    Compass,
    SquarePlay,
    Send,
    Heart,
    Plus,
    Circle,
    Menu,
    Network,
    Settings,
    SquareActivity,
    AtSign,
    Bookmark,
    MessageSquareWarning,
    Sun,
    LogOut,
    Moon,
} from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import SearchContent from "@/components/SearchContent";
import SidebarItem from "./SidebarItem";
import { useTheme } from "@/hooks/useTheme";
import { logout } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";

type SidebarItemType = {
    type: "link" | "action" | "modal";
    href?: string;
    label: string;
    icon: any;
    action?: string;
    className?: string;
};

const SIDEBAR_ITEMS: SidebarItemType[] = [
    { type: "link", href: "/", label: "Home", icon: Home },
    {
        type: "action",
        action: "search",
        label: "Search",
        icon: Search,
        className: "hidden md:flex",
    },
    { type: "link", href: "/explore", label: "Explore", icon: Compass },
    { type: "link", href: "/reels", label: "Reels", icon: SquarePlay },
    { type: "link", href: "/message", label: "Message", icon: Send },
    {
        type: "action",
        action: "notifications",
        label: "Notifications",
        icon: Heart,
        className: "hidden md:flex",
    },
    {
        type: "modal",
        label: "Create",
        icon: Plus,
    },
    { type: "link", href: "/profile", label: "Profile", icon: Circle },
];

interface SidebarProps {
    onOpenCreate: () => void;
}

export default function Sidebar({ onOpenCreate }: SidebarProps) {
    const [activePanel, setActivePanel] = useState<string | null>(null);

    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isMetaOpen, setIsMetaOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handlePanelClick = (item: SidebarItemType) => {
        if (item.type === "modal") {
            onOpenCreate();
            setActivePanel(null);
            return;
        }
        if (item.type === "action" && item.action) {
            setActivePanel((prev) =>
                prev === item.action ? null : (item.action as string),
            );
            return;
        }
        setActivePanel(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const sidebarWidthClass = activePanel ? "lg:w-20" : "lg:w-64";

    return (
        <div className="flex z-50 relative select-none">
            <nav
                className={cn(
                    "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black dark:border-gray-800 border-t",
                    "md:sticky md:top-0 md:h-screen md:border-r md:border-t-0 md:flex md:flex-col md:py-4 transition-all duration-300",
                    "w-full md:w-20",
                    sidebarWidthClass,
                )}
            >
                <div
                    className={cn(
                        "hidden md:flex mb-8 px-4 h-10 items-center",
                        activePanel
                            ? "justify-center"
                            : "justify-center lg:justify-start",
                    )}
                >
                    <NavLink to="/" className="block">
                        <h1
                            className={cn(
                                "text-2xl font-bold italic transition-all",
                                activePanel ? "hidden" : "hidden lg:block",
                            )}
                        >
                            Instagram
                        </h1>
                        <Instagram
                            className={cn(
                                "transition-all h-6! w-6!",
                                activePanel ? "block" : "lg:hidden block",
                            )}
                        />
                    </NavLink>
                </div>

                <div className="flex flex-row justify-around w-full md:flex-col md:space-y-2 md:px-3 md:flex-1">
                    {SIDEBAR_ITEMS.map((item, index) => (
                        <SidebarItem
                            key={index}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            className={item.className}
                            onClick={() => handlePanelClick(item)}
                            isActivePanel={activePanel === item.action}
                            hideLabel={!!activePanel}
                        />
                    ))}
                </div>

                <div className="hidden md:flex flex-col gap-2 px-3 mt-auto">
                    {/* Threads / Meta Button */}
                    <SidebarDropDown
                        icon={Network}
                        label={!activePanel ? "Threads" : ""}
                        open={isMetaOpen}
                        onOpenChange={setIsMetaOpen}
                        hideLabel={!!activePanel}
                    >
                        <DropdownMenuItem className="cursor-pointer">
                            <AtSign className=" mr-2 h-4 w-4" />
                            Threads
                        </DropdownMenuItem>
                    </SidebarDropDown>

                    {/* More Menu Button */}
                    <SidebarDropDown
                        icon={Menu}
                        label={!activePanel ? "More" : ""}
                        open={isMoreOpen}
                        onOpenChange={setIsMoreOpen}
                        hideLabel={!!activePanel}
                    >
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <SquareActivity className="mr-2 h-4 w-4" /> Your
                            activity
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Bookmark className="mr-2 h-4 w-4" /> Saved
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={toggleTheme}
                            className="cursor-pointer"
                        >
                            {theme === "dark" ? (
                                <Moon className="mr-2 h-4 w-4" />
                            ) : (
                                <Sun className="mr-2 h-4 w-4" />
                            )}
                            Switch appearance
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <MessageSquareWarning className="mr-2 h-4 w-4" />{" "}
                            Report a problem
                        </DropdownMenuItem>
                        <div className="h-px bg-gray-200 my-1" />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-red-500 font-medium"
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Log out
                        </DropdownMenuItem>
                    </SidebarDropDown>
                </div>
            </nav>

            {/* Nút Tìm kiếm và Thông báo */}
            <div
                className={cn(
                    "fixed top-0 left-0 h-full bg-white dark:bg-black dark:border-gray-800 z-40 shadow-2xl border-r border-gray-200 transition-transform duration-300 ease-in-out w-99",
                    activePanel === "search"
                        ? "translate-x-17 md:translate-x-18"
                        : "-translate-x-full",
                )}
            >
                <SearchContent />
            </div>

            {/* Notification Panel */}
            <div
                className={cn(
                    "fixed top-0 left-0 h-full bg-white dark:bg-black dark:border-gray-800 z-40 shadow-2xl border-r border-gray-200 transition-transform duration-300 ease-in-out w-99",
                    activePanel === "notifications"
                        ? "translate-x-17 md:translate-x-18"
                        : "-translate-x-full",
                )}
            >
                <div className="p-6 h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                    <div className="flex flex-col gap-4">
                        <div className="text-gray-500 text-sm">
                            No new notifications.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
