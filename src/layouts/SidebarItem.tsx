import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
    href?: string;
    label: string;
    icon: LucideIcon;
    className?: string;
    onClick?: () => void;
    isActivePanel?: boolean;
    hideLabel?: boolean;
}

export default function SidebarItem({
    href,
    label,
    icon: Icon,
    className,
    onClick,
    isActivePanel,
    hideLabel,
}: SidebarItemProps) {
    const commonClass = cn(
        "flex items-center transition-all duration-300 rounded-lg cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-500",
        hideLabel
            ? "w-12 h-12 justify-center p-0 mx-auto"
            : "w-full justify-start p-3 mx-0",

        className,
    );

    const labelClass = cn(
        "whitespace-nowrap pl-3 text-base font-normal transition-all duration-200",
        !hideLabel && label ? "hidden lg:block" : "hidden",
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
                    cn(
                        commonClass,
                        (isActive || isActivePanel) &&
                            "font-bold bg-gray-100 dark:bg-black dark:border-gray-800",
                    )
                }
                onClick={onClick}
            >
                {IconComponent}
                <span className={labelClass}>{label}</span>
            </NavLink>
        );
    }
    return (
        <div
            className={cn(
                commonClass,
                isActivePanel &&
                    "font-bold border border-gray-200 bg-gray-100 dark:bg-black dark:border-gray-800",
            )}
            onClick={onClick}
            role="button"
        >
            {IconComponent}
            <span className={labelClass}>{label}</span>
        </div>
    );
}
