import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/user";
import { useNavigate } from "react-router-dom";

interface UserSearchResultProps {
  user: User;
  onCloseSearch?: () => void;
}

// Lấy URL từ biến môi trường
const API_URL = import.meta.env.VITE_BASE_URL;

export default function UserSearchResult({
  user,
  onCloseSearch,
}: UserSearchResultProps) {
  const navigate = useNavigate();

  const getFullImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  const handleClick = () => {
    navigate(`/profile/${user._id}`);

    if (onCloseSearch) {
      onCloseSearch();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
    >
      <Avatar className="w-12 h-12 border border-gray-200 dark:border-gray-700">
        <AvatarImage
          src={getFullImageUrl(user.profilePicture)}
          className="object-cover"
        />
        <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {user.username}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {user.fullName || "Instagram User"}
        </span>
      </div>
    </div>
  );
}
