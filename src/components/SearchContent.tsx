import SearchInput from "@/components/SearchInput";
import { X } from "lucide-react";

interface SearchContentProps {
  onClose: () => void;
}

export default function SearchContent({ onClose }: SearchContentProps) {
  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800">
      <div className="px-6 pt-6 pb-4 md:pt-8 border-b border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold hidden md:block">Search</h2>
          {/* Nút đóng cho Mobile */}
          <button onClick={onClose} className="md:hidden p-1 text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="w-full relative z-60">
          <SearchInput onClosePanel={onClose} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 relative z-0">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-base dark:text-white">
            Recent
          </span>
          <span className="text-blue-500 text-sm font-semibold cursor-pointer hover:text-blue-700">
            Clear all
          </span>
        </div>
        <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
          No recent searches.
        </div>
      </div>
    </div>
  );
}
