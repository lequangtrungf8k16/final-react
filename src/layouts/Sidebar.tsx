import { NavLink } from "react-router-dom";
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
} from "lucide-react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

const SIDEBAR_ITEM = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/reels", label: "Reels", icon: SquarePlay },
    { href: "/message", label: "Message", icon: Send },
    { href: "/notifications", label: "Notifications", icon: Heart },
    { href: "/create", label: "Create", icon: Plus },
    { href: "/profile", label: "Profile", icon: Circle },
];

export default function Sidebar() {
    return (
        <nav className="sticky top-0 h-screen flex flex-col items-center bg-white w-20 xl:w-60 border-r-2 px-2 py-4">
            <div>
                <h1 className="text-2xl font-bold hidden xl:inline transition-all">
                    Instagram
                </h1>
                <Instagram className="xl:hidden transition-all" />
            </div>

            <div className="flex-1 items-center mt-10">
                {SIDEBAR_ITEM.map((item) => (
                    <SidebarItem
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                    />
                ))}
            </div>
            <div className="w-full flex flex-col gap-2 py-4">
                <DropdownMenu>
                    <Menu /> <span>Mores</span>
                </DropdownMenu>
                <DropdownMenu>
                    <Network />
                    Also from Meta
                </DropdownMenu>
            </div>
        </nav>
    );
}
