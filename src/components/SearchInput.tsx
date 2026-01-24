import { useEffect, useState, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/userService";
import type { User } from "@/types/user";
import UserSearchResult from "@/components/search/UserSearchResult";

interface SearchInputProps {
  onClosePanel?: () => void;
}

export default function SearchInput({ onClosePanel }: SearchInputProps) {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tự quản lý state nội bộ
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      setShowDropdown(true);

      try {
        const response = await userService.searchUsers(query);
        const data = response.data as any;
        const users = data.users || data; // Tùy cấu trúc API
        setResults(Array.isArray(users) ? users : []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  const handleSelectUser = (user: User) => {
    // Chuyển hướng
    navigate(`/profile/${user._id}`);

    // Reset search
    setShowDropdown(false);
    setQuery("");

    // Đóng panel
    if (onClosePanel) {
      onClosePanel();
    }
  };

  return (
    <div className="relative w-full z-60" ref={dropdownRef}>
      {/* INPUT BAR */}
      <div className="relative flex items-center bg-gray-100 dark:bg-zinc-800 rounded-lg px-3 py-2 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300 dark:focus-within:bg-black dark:focus-within:ring-gray-700 h-10">
        <Search size={18} className="text-gray-400 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent border-none outline-none text-sm w-full dark:text-white placeholder:text-gray-500 h-full"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value) setShowDropdown(true);
          }}
          onFocus={() => {
            if (query) setShowDropdown(true);
          }}
        />
        {isLoading ? (
          <Loader2
            size={16}
            className="text-gray-400 animate-spin ml-2 shrink-0"
          />
        ) : query ? (
          <button onClick={handleClear} className="ml-2 shrink-0">
            <X
              size={16}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            />
          </button>
        ) : null}
      </div>

      {/* DROPDOWN RESULT */}
      {showDropdown && query && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50 max-h-88 overflow-y-auto">
          {/* Mũi tên */}
          <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white dark:bg-black border-t border-l border-gray-200 dark:border-gray-800 transform rotate-45 z-0"></div>

          <div className="relative z-10 py-2 flex flex-col text-left">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 text-xs">
                Searching...
              </div>
            ) : results.length > 0 ? (
              results.map((user) => (
                <UserSearchResult
                  key={user._id}
                  user={user}
                  onCloseSearch={() => handleSelectUser(user)}
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No results found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
