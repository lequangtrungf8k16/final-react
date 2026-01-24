import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import {
  likePost,
  unlikePost,
  savePost,
  unSavePost,
} from "@/store/slices/postSlice";
import { addComment } from "@/store/slices/commentSlice";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_BASE_URL;

interface PostItemProps {
  postId: string;
  isLiked: boolean;
  isSaved: boolean;
  username: string;
  avatarUrl: string;
  imageUrl: string;
  mediaType?: "image" | "video";
  caption: string;
  likesCount: number;
  timeAgo: string;
  onCommentClick?: () => void;
}

export default function PostItem({
  postId,
  isLiked,
  isSaved,
  username,
  avatarUrl,
  imageUrl,
  mediaType = "image",
  caption,
  likesCount,
  timeAgo,
  onCommentClick,
}: PostItemProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const getFullMediaUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  const fullMediaUrl = getFullMediaUrl(imageUrl);
  const fullAvatarUrl = getFullMediaUrl(avatarUrl);

  const handleLikeToggle = () => {
    if (isLiked) dispatch(unlikePost(postId));
    else dispatch(likePost(postId));
  };

  const handleSaveToggle = () => {
    if (isSaved) dispatch(unSavePost(postId));
    else dispatch(savePost(postId));
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isPosting) return;
    setIsPosting(true);
    try {
      await dispatch(addComment({ postId, content: commentText })).unwrap();
      setCommentText("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex flex-col w-full border border-gray-200 rounded-lg shadow-md dark:shadow-none dark:border-gray-800 p-3 bg-white dark:bg-black hover:scale-101 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-1">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 cursor-pointer border border-gray-200 dark:border-gray-700">
            <AvatarImage src={fullAvatarUrl} alt={username} />
            <AvatarFallback>{username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm cursor-pointer hover:opacity-70 dark:text-white">
              {username}
            </span>
            <span className="text-gray-500 text-xs">• {timeAgo}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 dark:text-white hover:bg-transparent cursor-pointer"
        >
          <MoreHorizontal size={20} />
        </Button>
      </div>

      {/* Media */}
      <div className="w-full bg-black rounded-sm overflow-hidden aspect-square border border-gray-100 dark:border-gray-800 flex items-center justify-center relative">
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

      {/* Actions */}
      <div className="flex items-center justify-between mt-3 mb-2 px-1">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 hover:bg-transparent cursor-pointer"
            onClick={handleLikeToggle}
          >
            <Heart
              size={24}
              className={cn(
                "transition-all duration-200 hover:scale-110",
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-black dark:text-white hover:text-gray-600",
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 hover:bg-transparent cursor-pointer dark:text-white hover:text-gray-600"
            onClick={onCommentClick}
          >
            <MessageCircle
              size={24}
              className="hover:scale-110 transition-transform -rotate-90"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 hover:bg-transparent cursor-pointer dark:text-white hover:text-gray-600"
          >
            <Send size={24} className="hover:scale-110 transition-transform" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 hover:bg-transparent cursor-pointer dark:text-white hover:text-gray-600"
          onClick={handleSaveToggle}
        >
          <Bookmark
            size={24}
            className={cn(
              "hover:scale-110 transition-transform",
              isSaved
                ? "fill-black text-black dark:fill-white dark:text-white"
                : "",
            )}
          />
        </Button>
      </div>

      {/* Info */}
      <div className="text-sm dark:text-white px-1">
        <div className="font-semibold mb-1">
          {(likesCount || 0).toLocaleString()} likes
        </div>
        <div className="mb-1">
          <span className="font-semibold mr-2 cursor-pointer hover:opacity-70">
            {username}
          </span>
          <span>{caption}</span>
        </div>
        <div
          className="text-gray-500 text-sm cursor-pointer mb-2 hover:text-gray-700 dark:hover:text-gray-400"
          onClick={onCommentClick}
        >
          View all comments
        </div>
      </div>

      <form
        onSubmit={handlePostComment}
        className="flex items-center gap-2 border-b border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-700 transition-colors mt-1 pb-3 px-1"
      >
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full outline-none text-sm bg-transparent text-black dark:text-white placeholder:text-gray-500"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        {commentText.trim().length > 0 && (
          <button
            type="submit"
            disabled={isPosting}
            className="text-[#0095F6] font-semibold text-sm hover:text-[#00376b] disabled:opacity-50 cursor-pointer transition-colors shrink-0"
          >
            {isPosting ? "..." : "Send"}
          </button>
        )}
      </form>
    </div>
  );
}
