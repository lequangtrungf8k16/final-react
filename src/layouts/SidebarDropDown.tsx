import { buttonVariants } from "@/components/ui/button";
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
}

export default function SidebarDropDown({
    icon: Icon,
    label,
    children,
    className,
    open,
    onOpenChange,
}: SidebarDropDownProps) {
    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "lg" }),
                        "md:mx-auto lg:w-full lg:p-4 lg:flex lg:justify-start lg:gap-2 cursor-pointer transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none",
                        label
                            ? "w-full justify-center px-4 py-2 md:mx-0"
                            : "w-12 h-12 justify-center p-0 md:mx-auto",
                        className
                    )}
                >
                    <Icon
                        size={24}
                        className={cn(
                            "transition-all shrink-0",
                            label ? "h-6! w-6!" : "h-6! w-6!"
                        )}
                    />
                    <span
                        className={cn(
                            "hidden lg:inline text-lg",
                            !label && "hidden"
                        )}
                    >
                        {label}
                    </span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="start" alignOffset={20}>
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
