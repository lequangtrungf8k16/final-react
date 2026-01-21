import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
    Smile,
} from "lucide-react";

const API_URL = "https://instagram.f8team.dev";

interface PostItemProps {
    username: string;
    avatarUrl: string;
    imageUrl: string;
    mediaType?: "image" | "video";
    caption: string;
    likesCount: number;
    timeAgo: string;
}

export default function PostItem({
    username,
    avatarUrl,
    imageUrl,
    mediaType = "image",
    caption,
    likesCount,
    timeAgo,
}: PostItemProps) {
    const getFullMediaUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `${API_URL}${path}`;
    };

    const fullMediaUrl = getFullMediaUrl(imageUrl);
    const fullAvatarUrl = getFullMediaUrl(avatarUrl);

    return (
        <div className="flex flex-col w-full border-b border-gray-200 pb-6 mb-6 last:border-none md:border-none">
            {/* 1. Header */}
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 cursor-pointer border border-gray-200">
                        <AvatarImage src={fullAvatarUrl} alt={username} />
                        <AvatarFallback>
                            {username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm cursor-pointer hover:opacity-70">
                            {username}
                        </span>
                        <span className="text-gray-500 text-xs">
                            • {timeAgo}
                        </span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal size={20} />
                </Button>
            </div>

            {/* 2. Media Content (Xử lý cả Video và Ảnh) */}
            <div className="w-full bg-black rounded-sm overflow-hidden aspect-square border border-gray-100 flex items-center justify-center">
                {mediaType === "video" ? (
                    <video
                        src={fullMediaUrl}
                        controls
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <img
                        src={fullMediaUrl}
                        alt="Post content"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* 3. Actions */}
            <div className="flex items-center justify-between mt-3 mb-2">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 hover:bg-transparent hover:text-gray-600"
                    >
                        <Heart
                            size={24}
                            className="hover:scale-110 transition-transform"
                        />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 hover:bg-transparent hover:text-gray-600"
                    >
                        <MessageCircle
                            size={24}
                            className="hover:scale-110 transition-transform -rotate-90"
                        />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 hover:bg-transparent hover:text-gray-600"
                    >
                        <Send
                            size={24}
                            className="hover:scale-110 transition-transform"
                        />
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 hover:bg-transparent hover:text-gray-600"
                >
                    <Bookmark
                        size={24}
                        className="hover:scale-110 transition-transform"
                    />
                </Button>
            </div>

            {/* 4. Caption & Likes */}
            <div className="text-sm">
                <div className="font-semibold mb-1">
                    {likesCount.toLocaleString()} likes
                </div>
                <div className="mb-2">
                    <span className="font-semibold mr-2 cursor-pointer hover:opacity-70">
                        {username}
                    </span>
                    <span className="">{caption}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400 border-b border-transparent focus-within:border-gray-300 transition-colors mt-2">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="w-full outline-none text-sm bg-transparent py-1 text-black placeholder:text-gray-500"
                    />
                    <Smile
                        size={14}
                        className="cursor-pointer hover:text-gray-600"
                    />
                </div>
            </div>
        </div>
    );
}
