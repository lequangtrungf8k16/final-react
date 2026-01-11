import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import SidebarDropDown from "./SidebarDropDown";
import SidebarItem from "./SidebarItem";
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
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

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
                className={`fixed bottom-0 left-0 right-0 w-full h-20 flex flex-row justify-center items-center bg-white md:sticky md:top-0 md:h-screen md:mx-0 md:flex-col md:w-20 lg:w-60 md:border-r-2 md:py-4 ${
                    activePanel ? "md:w-20" : "md:w-20 lg:w-60"
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
                    <Instagram className="hidden sm:inline sm:mt-2 lg:hidden transition-all" />
                </NavLink>

                <div className="flex flex-row md:w-full md:flex-1 md:flex-col md:mt-10 md:px-4">
                    {SIDEBAR_ITEM.map((item, index) => {
                        if (item.type === "modal") {
                            return (
                                <Dialog key={index}>
                                    <DialogTrigger asChild>
                                        <div>
                                            <SidebarItem
                                                label={
                                                    !activePanel
                                                        ? item.label
                                                        : ""
                                                }
                                                icon={item.icon}
                                                className={item.className || ""}
                                                onClick={() =>
                                                    setActivePanel(null)
                                                }
                                            />
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <div className="h96 flex sm:max-w-200">
                                            Create Post UI Here
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            );
                        }

                        if (item.type === "action") {
                            return (
                                <SidebarItem
                                    key={item.href}
                                    label={!activePanel ? item.label : ""}
                                    icon={item.icon}
                                    className={`${item.className || ""} ${
                                        activePanel === item.action
                                            ? "border border-gray-400"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handlePanelClick(item.action!)
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
                <div className="hidden md:w-full md:flex md:flex-col lg:justify-start md:items-center gap-4 mt-10">
                    {/* Menu */}
                    <SidebarDropDown icon={Menu} label="More">
                        <DropdownMenuItem className="flex gap-4 w-60 p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <Settings /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-4 w-60 p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <SquareActivity /> Your activity
                        </DropdownMenuItem>
                    </SidebarDropDown>

                    {/* Network */}
                    <SidebarDropDown icon={Network} label="Also from Meta">
                        <DropdownMenuItem className="flex gap-4 w-60 h-auto p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <Circle /> Meta AI
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-4 w-60 h-auto p-2 cursor-pointer hover:bg-secondary focus:outline-none">
                            <MessageCircleQuestionMark /> WhatsApp
                        </DropdownMenuItem>
                    </SidebarDropDown>
                </div>
            </nav>

            {/* Nút Tìm kiếm và Thông báo */}
            <div
                className={`
                    fixed top-0 left-0 h-full bg-white z-40 shadow-2xl border-r border-gray-200
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
                        className="bg-gray-100 p-2 rounded-md mb-4 focus-visible:ring-0"
                        placeholder="Search..."
                    />
                    <div className="border-t pt-4">Recent searches...</div>
                </div>
            </div>

            <div
                className={`
                    fixed top-0 left-0 h-full bg-white z-40 shadow-2xl border-r border-gray-200
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
                        <div>User A liked your photo</div>
                        <div>User B started following you</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
