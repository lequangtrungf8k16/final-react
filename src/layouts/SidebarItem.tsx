import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
    href?: string;
    label: string;
    icon: LucideIcon;
    className: string;
    onClick?: () => void;
}

export default function SidebarItem({
    href,
    label,
    icon: Icon,
    className,
    onClick,
}: SidebarItemProps) {
    const commonClass = cn(
        "flex items-center justify-center lg:justify-start gap-4 p-3 hover:bg-gray-100 rounded-lg transition-all cursor-pointer text-base group w-full",
        className
    );

    const labelClass = cn(
        "hidden lg:block",
        !label && "hidden",
        "text-base font-normal"
    );
    if (href) {
        return (
            <NavLink
                to={href}
                className={({ isActive }) =>
                    cn(commonClass, isActive && "font-bold bg-gray-100")
                }
                onClick={onClick}
            >
                <Icon
                    size={24}
                    className="group-hover:scale-105 transition-transform"
                />
                <span className={labelClass}>{label}</span>
            </NavLink>
        );
    }
    return (
        <div className={commonClass} onClick={onClick} role="button">
            <Icon
                size={24}
                className="group-hover:scale-105 transition-transform focus-visible:ring-0"
            />
            <span className={labelClass}>{label}</span>
        </div>
    );
}
