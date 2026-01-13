import SidebarDropDown from "./SidebarDropDown";
import { NavLink } from "react-router-dom";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SidebarItem from "./SidebarItem";
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
} from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import CreatePostModal from "@/components/CreatePostModal";

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

export default function Sidebar() {
    const [activePanel, setActivePanel] = useState<string | null>(null);

    const handlePanelClick = (panelName: string) => {
        if (activePanel === panelName) {
            setActivePanel(null);
        } else {
            setActivePanel(panelName);
        }
    };

    return (
        <div className="flex z-50 relative">
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
                    {SIDEBAR_ITEM.map((item) => {
                        if (item.type === "modal" || item.type === "action") {
                            const actionName =
                                item.type === "modal" ? "create" : item.action;
                            return (
                                <SidebarItem
                                    label={!activePanel ? item.label : ""}
                                    icon={item.icon}
                                    className={`${item.className || ""} ${
                                        activePanel === actionName
                                            ? "font-bold bg-gray-100"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handlePanelClick(actionName!)
                                    }
                                />
                            );
                        }

                        return (
                            <SidebarItem
                                key={item.href}
                                href={item.href}
                                label={!activePanel ? item.label : ""}
                                icon={item.icon}
                                className={item.className || ""}
                                onClick={() => setActivePanel(null)}
                            />
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
                        className={
                            activePanel
                                ? "lg:justify-center lg:px-0 shrink-0s"
                                : ""
                        }
                    >
                        <DropdownMenuItem className="flex gap-4 w-60 p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <Settings /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-4 w-60 p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <SquareActivity /> Your activity
                        </DropdownMenuItem>
                    </SidebarDropDown>

                    {/* Network */}
                    <SidebarDropDown
                        icon={Network}
                        label={!activePanel ? "Also from Meta" : ""}
                        className={
                            activePanel ? "lg:justify-center shrink-0" : ""
                        }
                    >
                        <DropdownMenuItem className="flex gap-4 w-60 h-auto p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <Circle /> Meta AI
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-4 w-60 h-auto p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <MessageCircleQuestionMark /> WhatsApp
                        </DropdownMenuItem>
                    </SidebarDropDown>
                </div>
            </nav>

            {/* Create new post */}
            <CreatePostModal
                open={activePanel === "create"}
                onOpenChange={(isOpen) => !isOpen && setActivePanel(null)}
            />

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
                <div className="p-6 h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-6">Search</h2>
                    <input
                        className="bg-gray-100 px-6 py-2 rounded-full mb-4 focus-visible:ring-0"
                        placeholder="Search..."
                    />
                    <div className="border-t pt-4">Recent</div>
                </div>
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
