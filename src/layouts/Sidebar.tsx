import SidebarDropDown from "./SidebarDropDown";
import { NavLink } from "react-router-dom";
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
    MessageCircleQuestionMark,
    AtSign,
    Bookmark,
    MessageSquareWarning,
    Sun,
} from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import SearchContent from "@/components/SearchContent";

const SIDEBAR_ITEM = [
    { type: "link", href: "/", label: "Home", icon: Home },
    {
        type: "action",
        action: "search",
        href: "/search",
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
        href: "/notifications",
        label: "Notifications",
        icon: Heart,
        className: "hidden md:flex",
    },
    {
        type: "modal",
        href: "/create",
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

    const handlePanelClick = (item: any) => {
        if (item.type === "modal") {
            onOpenCreate();
            setActivePanel(null);
            return;
        }
        if (item.type === "action" && item.action) {
            setActivePanel((prev) =>
                prev === item.action ? null : item.action
            );
            return;
        }
        setActivePanel(null);
    };

    return (
        <div className="flex z-50 relative select-none">
            <nav
                className={`fixed bottom-0 left-0 right-0 z-50 w-full h-20 flex flex-row justify-center items-center bg-white md:sticky md:top-0 md:h-screen md:mx-0 md:flex-col md:border-r-2 md:py-4 transition-all ${
                    activePanel ? "md:w-20 lg:w-20" : "md:w-20 lg:w-60"
                }`}
            >
                <NavLink
                    to={"/"}
                    className="hidden mx-auto md:flex w-full justify-center"
                >
                    <h1
                        className={`text-2xl font-bold transition-all ${
                            activePanel ? "hidden" : "hidden lg:block"
                        }`}
                    >
                        Instagram
                    </h1>
                    <Instagram
                        className={cn(
                            "hidden sm:inline sm:mt-2 transition-all",
                            activePanel ? "lg:block" : "lg:hidden"
                        )}
                    />
                </NavLink>

                <div className="flex flex-row gap-2 md:w-full md:flex-1 md:flex-col md:mt-10 md:px-4">
                    {SIDEBAR_ITEM.map((item, index) => {
                        if (item.type === "link") {
                            return (
                                <NavLink
                                    key={index}
                                    to={item.href || "!#"}
                                    onClick={() => handlePanelClick(item)}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-all",
                                            "justify-center lg:justify-start",
                                            isActive && "font-bold"
                                        )
                                    }
                                >
                                    <item.icon size={24} />
                                    <span
                                        className={cn(
                                            "hidden",
                                            !activePanel && "lg:block"
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                </NavLink>
                            );
                        }

                        return (
                            <div
                                key={index}
                                onClick={() => handlePanelClick(item)}
                                className={cn(
                                    "flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-all cursor-pointer",
                                    "justify-center lg:justify-start",
                                    activePanel === item.action &&
                                        "border border-gray-200"
                                )}
                            >
                                <item.icon size={24} />
                                <span
                                    className={cn(
                                        "hidden",
                                        !activePanel && "lg:block"
                                    )}
                                >
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Phần dưới Sidebar */}
                <div
                    className={cn(
                        "hidden px-4 md:w-full md:flex md:flex-col lg:justify-start md:items-center gap-4 mt-10",
                        "md:items-center",
                        activePanel ? "items-center" : "lg:items-start"
                    )}
                >
                    {/* Menu */}
                    <SidebarDropDown
                        icon={Menu}
                        label={!activePanel ? "More" : ""}
                        open={isMoreOpen}
                        onOpenChange={setIsMoreOpen}
                        className={cn(
                            activePanel
                                ? "lg:justify-center lg:px-0 shrink-0s"
                                : "",
                            isMoreOpen && "font-bold"
                        )}
                    >
                        <DropdownMenuItem className="flex gap-4 w-60 p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <Settings /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-4 w-60 p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <SquareActivity /> Your activity
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-4 w-60 p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <Bookmark /> Saved
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-4 w-60 p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <Sun /> Switch appearance
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-4 w-60 p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <MessageSquareWarning /> Report a problem
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-4 w-60 p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            Switch accounts
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-4 w-60 p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            Logout
                        </DropdownMenuItem>
                    </SidebarDropDown>

                    {/* Network */}
                    <SidebarDropDown
                        icon={Network}
                        label={!activePanel ? "Also from Meta" : ""}
                        open={isMetaOpen}
                        onOpenChange={setIsMetaOpen}
                        className={cn(
                            activePanel ? "lg:justify-center shrink-0 " : "",
                            isMetaOpen && "font-bold"
                        )}
                    >
                        <DropdownMenuItem className="flex gap-4 w-60 h-auto p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <Circle /> Meta AI
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-4 w-60 h-auto p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <MessageCircleQuestionMark /> WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-4 w-60 p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <AtSign /> Threads
                        </DropdownMenuItem>
                    </SidebarDropDown>
                </div>
            </nav>

            {/* Nút Tìm kiếm và Thông báo */}
            <div
                className={`
                    fixed top-0 left-0 h-full bg-white z-30 shadow-2xl border-r border-gray-200
                    w-100 transition-transform duration-300 ease-in-out
                    ${
                        activePanel === "search"
                            ? "translate-x-18"
                            : "-translate-x-full"
                    }
                `}
            >
                <SearchContent />
            </div>

            <div
                className={`
                    fixed top-0 left-0 h-full bg-white z-30 shadow-2xl border-r border-gray-200
                    w-100 transition-transform duration-300 ease-in-out
                    ${
                        activePanel === "notifications"
                            ? "translate-x-18"
                            : "-translate-x-full"
                    }
                `}
            >
                <div className="p-6 h-full flex flex-col focus-visible:ring-0">
                    <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                    <div className="flex flex-col gap-4">
                        <div>Empty</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
