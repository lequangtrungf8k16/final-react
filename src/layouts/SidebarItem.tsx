import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
    href: string;
    label: string;
    icon: LucideIcon;
}

export default function SidebarItem({
    href,
    label,
    icon: Icon,
}: SidebarItemProps) {
    return (
        <NavLink
            to={href}
            className={({ isActive }) =>
                cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "w-full justify-start my-1 px-4 transition-all",
                    isActive
                        ? "font-bold text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-primary"
                )
            }
        >
            {({ isActive }) => (
                <div className="flex items-center gap-4 mx-auto xl:mx-0">
                    <Icon
                        className={cn(
                            "h-6! w-6! transition-all",
                            isActive ? "stroke-2 scale-105" : "stroke-1"
                        )}
                    />
                    <span className="hidden xl:inline text-lg">{label}</span>
                </div>
            )}
        </NavLink>
    );
}
