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

const SIDEBAR_ITEM = [
    { href: "/", label: "Home", icon: Home },
    {
        href: "/search",
        label: "Search",
        icon: Search,
        className: "hidden md:flex",
    },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/reels", label: "Reels", icon: SquarePlay },
    { href: "/message", label: "Message", icon: Send },
    {
        href: "/notifications",
        label: "Notifications",
        icon: Heart,
        className: "hidden md:flex",
    },
    { href: "/create", label: "Create", icon: Plus },
    { href: "/profile", label: "Profile", icon: Circle },
];

export default function Sidebar() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full h-20 flex flex-row justify-center items-center bg-white md:sticky md:top-0 md:h-screen md:mx-0 md:flex-col md:w-20 lg:w-60 md:border-r-2 md:py-4">
            <NavLink
                to={"/"}
                className="hidden mx-auto md:flex w-full justify-center"
            >
                <h1 className="text-2xl font-bold hidden lg:inline transition-all">
                    Instagram
                </h1>
                <Instagram className="hidden sm:inline sm:mt-2 lg:hidden transition-all" />
            </NavLink>

            <div className="flex flex-row justify-between md:w-full md:flex-1 md:flex-col md:items-center md:mt-10">
                {SIDEBAR_ITEM.map((item) => (
                    <SidebarItem
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        className={item.className || ""}
                    />
                ))}
            </div>
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
    );
}
