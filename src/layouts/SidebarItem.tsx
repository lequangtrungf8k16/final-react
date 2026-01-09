import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
    href: string;
    label: string;
    icon: LucideIcon;
    className: string;
}

export default function SidebarItem({
    href,
    label,
    icon: Icon,
    className,
}: SidebarItemProps) {
    return (
        <NavLink
            to={href}
            className={({ isActive }) =>
                cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    `md:mx-auto md:my-1 lg:w-full lg:ml-0.5 lg:flex lg:justify-start transition-all ${
                        className || ""
                    }`,
                    isActive
                        ? "font-bold text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-primary"
                )
            }
        >
            {({ isActive }) => (
                <div className="flex items-center gap-4">
                    <Icon
                        className={cn(
                            "h-6! w-6! transition-all",
                            isActive ? "stroke-2 scale-105" : "stroke-1"
                        )}
                    />
                    <span className="hidden lg:inline text-lg">{label}</span>
                </div>
            )}
        </NavLink>
    );
}
