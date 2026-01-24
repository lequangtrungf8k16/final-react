import { cn } from "@/lib/utils";
import { Grid, Bookmark, PlaySquare } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOwnProfile: boolean;
}

export default function ProfileTabs({
  activeTab,
  onTabChange,
  isOwnProfile,
}: ProfileTabsProps) {
  const tabs = [
    {
      id: "all",
      label: "POSTS",
      icon: Grid,
      show: true,
    },
    {
      id: "video",
      label: "VIDEOS",
      icon: PlaySquare,
      show: true,
    },
    {
      id: "saved",
      label: "SAVED",
      icon: Bookmark,
      show: isOwnProfile,
    },
  ];

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 flex justify-center gap-12">
      {tabs.map((tab) => {
        if (!tab.show) return null;

        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 py-4 text-xs font-semibold tracking-widest transition-all",
              isActive
                ? "border-t border-black dark:border-white text-black dark:text-white"
                : "text-gray-400 hover:text-gray-600 border-t border-transparent",
            )}
          >
            <Icon size={12} className={isActive ? "stroke-[3px]" : ""} />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
