import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "@/store/slices/userSlice";
import type { User } from "@/types/user";
import { Settings, MoreHorizontal, Link as LinkIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onEditProfile?: () => void;
}

const API_URL = import.meta.env.VITE_BASE_URL;

export default function ProfileHeader({
  user,
  isOwnProfile,
  onEditProfile,
}: ProfileHeaderProps) {
  const dispatch = useDispatch<AppDispatch>();

  const getFullImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  const handleFollowToggle = () => {
    if (user.isFollowing) {
      dispatch(unfollowUser(user._id));
    } else {
      dispatch(followUser(user._id));
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-24 px-4 md:px-16 py-8 border-b border-gray-200 dark:border-gray-800">
      {/* Avatar Section */}
      <div className="shrink-0">
        <Avatar className="w-20 h-20 md:w-40 md:h-40 border border-gray-200">
          <AvatarImage
            src={getFullImageUrl(user.profilePicture)}
            alt={user.username}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl font-bold">
            {user.username[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-4 w-full">
        {/* Username & Actions */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <h1 className="text-xl md:text-2xl font-normal">{user.username}</h1>

          {isOwnProfile ? (
            <div className="flex gap-2">
              <Button
                onClick={onEditProfile}
                variant="secondary"
                size="sm"
                className="font-semibold cursor-pointer"
              >
                Edit profile
              </Button>
              <Button variant="secondary" size="sm" className="font-semibold">
                View archive
              </Button>
              <Button variant="ghost" size="icon">
                <Settings size={24} />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant={user.isFollowing ? "secondary" : "default"}
                size="sm"
                className={`px-6 font-semibold cursor-pointer ${
                  !user.isFollowing ? "bg-blue-500 hover:bg-blue-600" : ""
                }`}
                onClick={handleFollowToggle}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </Button>
              <Button variant="secondary" size="sm" className="font-semibold">
                Message
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal size={24} />
              </Button>
            </div>
          )}
        </div>

        {/* Stats (Ẩn trên mobile, hiện trên desktop) */}
        <div className="hidden md:flex items-center gap-10 text-base">
          <div className="flex gap-1">
            <span className="font-bold">{user.postsCount}</span> posts
          </div>
          <div className="flex gap-1 cursor-pointer hover:opacity-50">
            <span className="font-bold">{user.followersCount}</span> followers
          </div>
          <div className="flex gap-1 cursor-pointer hover:opacity-50">
            <span className="font-bold">{user.followingCount}</span> following
          </div>
        </div>

        {/* Bio */}
        <div className="text-sm md:text-base text-center md:text-left">
          <div className="font-bold">{user.fullName}</div>
          <div className="whitespace-pre-line">{user.bio}</div>
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center md:justify-start gap-1 text-blue-900 dark:text-blue-100 font-semibold hover:underline mt-1"
            >
              <LinkIcon size={14} />
              {user.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </div>

      {/* Mobile Stats Row (Hiện trên mobile, nằm dưới cùng) */}
      <div className="flex md:hidden w-full justify-around border-t border-gray-200 py-4 mt-2">
        <div className="flex flex-col items-center">
          <span className="font-bold">{user.postsCount}</span>
          <span className="text-gray-500 text-sm">posts</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">{user.followersCount}</span>
          <span className="text-gray-500 text-sm">followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">{user.followingCount}</span>
          <span className="text-gray-500 text-sm">following</span>
        </div>
      </div>
    </div>
  );
}
