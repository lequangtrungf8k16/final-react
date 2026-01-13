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
        label ? "justify-center lg:justify-start" : "justify-center",
        className
    );

    const labelClass = cn(
        "hidden lg:block whitespace-nowrap",
        !label && "hidden",
        "text-base font-normal"
    );

    const IconComponent = (
        <Icon
            size={24}
            className="group-hover:scale-105 transition-transform shrink-0"
        />
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
                    className="group-hover:scale-105 transition-transform shrink-0"
                />
                <span className={labelClass}>{label}</span>
            </NavLink>
        );
    }
    return (
        <div className={commonClass} onClick={onClick} role="button">
            {IconComponent}
            <span className={labelClass}>{label}</span>
        </div>
    );
}
