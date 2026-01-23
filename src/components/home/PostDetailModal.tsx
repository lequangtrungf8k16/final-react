import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  X,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  fetchComments,
  addComment,
  clearComments,
  deleteComment,
} from "@/store/slices/commentSlice";
import {
  likePost,
  unlikePost,
  savePost,
  unSavePost,
} from "@/store/slices/postSlice";
import type { Post } from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const API_URL = "https://instagram.f8team.dev";

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export default function PostDetailModal({
  isOpen,
  onClose,
  post,
}: PostDetailModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  // Lấy state comment
  const { comments, isLoading } = useSelector(
    (state: RootState) => state.comment,
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(!!post.isLiked);
  const [isSaved, setIsSaved] = useState(!!post.isSaved);
  const [likesCount, setLikesCount] = useState(post.likes);

  useEffect(() => {
    setIsLiked(!!post.isLiked);
    setIsSaved(!!post.isSaved);
    setLikesCount(post.likes);
  }, [post]);

  useEffect(() => {
    if (isOpen && post._id) {
      dispatch(fetchComments(post._id));
    }
    return () => {
      dispatch(clearComments());
    };
  }, [isOpen, post._id, dispatch]);

  const handleLikeToggle = () => {
    if (isLiked) {
      dispatch(unlikePost(post._id));
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      dispatch(likePost(post._id));
      setLikesCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleSaveToggle = () => {
    if (isSaved) dispatch(unSavePost(post._id));
    else dispatch(savePost(post._id));
    setIsSaved(!isSaved);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await dispatch(addComment({ postId: post._id, content: commentText }));
    setCommentText("");
  };

  // Xử lý xóa comment
  const handleDeleteComment = async (commentId: string) => {
    confirm("Bạn có chắc muốn xóa?");
    await dispatch(deleteComment({ postId: post._id, commentId }));
  };

  const getFullMediaUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };
  const fullMediaUrl = getFullMediaUrl(
    post.mediaType === "video" ? post.video || "" : post.image,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl w-[95vw] md:w-full p-0 gap-0 overflow-hidden h-[80vh] md:h-[85vh] flex flex-col md:flex-row bg-white dark:bg-black border dark:border-gray-800 rounded-lg z-100 outline-none [&>button:not(.custom-close)]:hidden">
        <DialogTitle className="hidden">Post Detail</DialogTitle>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 md:hidden bg-black/50 rounded-full p-1 text-white"
        >
          <X size={20} />
        </button>

        {/* LEFT: MEDIA */}
        <div className="flex bg-black w-full md:w-[55%] h-[40%] md:h-full items-center justify-center relative shrink-0">
          {post.mediaType === "video" ? (
            <video
              src={fullMediaUrl}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={fullMediaUrl}
              alt="Post"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* RIGHT: INFO & ACTIONS */}
        <div className="flex flex-col w-full md:w-[45%] h-[60%] md:h-full bg-white dark:bg-black">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border cursor-pointer">
                <AvatarImage
                  src={getFullMediaUrl(post.userId?.profilePicture || "")}
                />
                <AvatarFallback>{post.userId?.username?.[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm hover:opacity-70 cursor-pointer dark:text-white">
                {post.userId?.username}
              </span>
            </div>
            <MoreHorizontal
              size={20}
              className="cursor-pointer dark:text-white"
            />
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {/* Caption */}
            {post.caption && (
              <div className="flex gap-3 mb-4">
                <Avatar className="h-8 w-8 mt-1 cursor-pointer">
                  <AvatarImage
                    src={getFullMediaUrl(post.userId?.profilePicture || "")}
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="text-sm dark:text-white">
                  <span className="font-semibold mr-2 cursor-pointer hover:opacity-70">
                    {post.userId?.username}
                  </span>
                  <span>{post.caption}</span>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            )}

            {comments.map((comment, index) => {
              const myId = currentUser?._id;

              const creatorId =
                comment.userId && typeof comment.userId === "object"
                  ? comment.userId._id
                  : comment.userId;

              const isMyComment =
                myId && creatorId && myId.toString() === creatorId.toString();

              return (
                <div
                  key={comment._id || index}
                  className="flex gap-3 mb-4 group relative"
                >
                  <Avatar className="h-8 w-8 mt-1 cursor-pointer">
                    <AvatarImage
                      src={getFullMediaUrl(
                        comment.userId?.profilePicture || "",
                      )}
                    />
                    <AvatarFallback>
                      {comment.userId?.username?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col w-full pr-6">
                    {" "}
                    <div className="text-sm dark:text-white">
                      <span className="font-semibold mr-2 cursor-pointer hover:opacity-70">
                        {comment.userId?.username || "Unknown"}
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {comment.content}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>
                        {comment.createdAt
                          ? formatDistanceToNow(new Date(comment.createdAt))
                          : "Just now"}{" "}
                        ago
                      </span>
                      <span className="cursor-pointer font-semibold hover:text-gray-900">
                        Reply
                      </span>
                    </div>
                  </div>

                  {/* Icon Like */}
                  <Heart
                    size={12}
                    className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-red-500 transition-opacity absolute right-0 top-2"
                  />

                  {isMyComment && (
                    <Trash2
                      size={14}
                      className="opacity-0 group-hover:opacity-100 cursor-pointer text-gray-400 hover:text-red-600 transition-opacity absolute right-5 top-2"
                      onClick={() => handleDeleteComment(comment._id)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Input */}
          <div className="border-t border-gray-100 dark:border-gray-800 p-4 shrink-0 bg-white dark:bg-black">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-4">
                <Heart
                  size={24}
                  onClick={handleLikeToggle}
                  className={cn(
                    "cursor-pointer hover:scale-110 transition-transform",
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : "dark:text-white hover:text-gray-500",
                  )}
                />
                <MessageCircle
                  size={24}
                  className="cursor-pointer hover:opacity-50 dark:text-white -rotate-90"
                />
                <Send
                  size={24}
                  className="cursor-pointer hover:opacity-50 dark:text-white"
                />
              </div>
              <Bookmark
                size={24}
                onClick={handleSaveToggle}
                className={cn(
                  "cursor-pointer hover:scale-110 transition-transform",
                  isSaved
                    ? "fill-black text-black dark:fill-white"
                    : "dark:text-white hover:text-gray-500",
                )}
              />
            </div>
            <div className="font-semibold text-sm mb-2 dark:text-white">
              {likesCount.toLocaleString()} likes
            </div>
            <div className="text-[10px] text-gray-500 uppercase mb-3">
              {post.createdAt && formatDistanceToNow(new Date(post.createdAt))}{" "}
              AGO
            </div>

            <form
              onSubmit={handlePostComment}
              className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-3"
            >
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="border-none shadow-none px-0 focus-visible:ring-0 dark:bg-black dark:text-white"
              />
              {commentText.trim() && (
                <button
                  type="submit"
                  className="text-blue-500 font-semibold text-sm hover:text-blue-700"
                >
                  Send
                </button>
              )}
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
