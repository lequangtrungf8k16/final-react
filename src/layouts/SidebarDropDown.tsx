import {
    DropdownMenuTrigger,
    DropdownMenu,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SidebarDropDownProps {
    icon: LucideIcon;
    label: string;
    children: React.ReactNode;
    className?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    hideLabel?: boolean;
}

export default function SidebarDropDown({
    icon: Icon,
    label,
    children,
    className,
    open,
    onOpenChange,
    hideLabel,
}: SidebarDropDownProps) {
    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "flex items-center transition-all duration-300 rounded-lg cursor-pointer group hover:bg-gray-100 outline-none focus-visible:ring-0",
                        hideLabel
                            ? "w-12 h-12 justify-center p-0 mx-auto"
                            : "w-full justify-start p-3 mx-0",

                        className,
                    )}
                >
                    <Icon
                        size={24}
                        className={cn(
                            "transition-all shrink-0 group-hover:scale-105",
                            "h-6! w-6!",
                        )}
                    />
                    <span
                        className={cn(
                            "whitespace-nowrap text-base font-normal transition-all duration-200",
                            !hideLabel && label ? "hidden lg:block" : "hidden",
                        )}
                    >
                        {label}
                    </span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="start" className="w-60 ml-4">
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
