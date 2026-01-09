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
}

export default function SidebarDropDown({
    icon: Icon,
    label,
    children,
    className,
}: SidebarDropDownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "lg" }),
                        "md:mx-auto md:my-1 lg:w-full lg:ml-2.5 lg:flex lg:justify-start lg:gap-4 cursor-pointer transition-all",
                        "focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none",
                        className
                    )}
                >
                    <Icon className={cn("h-6! w-6! transition-all")} />
                    <span className="hidden lg:inline text-lg text-muted-foreground">
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
