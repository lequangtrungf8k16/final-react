import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchExplorePosts, clearExplore } from "@/store/slices/postSlice";
import { Heart, MessageCircle, Play } from "lucide-react";
import PostDetailModal from "@/components/home/PostDetailModal";
import type { Post } from "@/types/post";

const API_URL = "https://instagram.f8team.dev";

export default function ExplorePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { explorePosts, isLoading, explorePagination } = useSelector(
    (state: RootState) => state.post,
  );

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Load dữ liệu lần đầu
  useEffect(() => {
    dispatch(fetchExplorePosts({ page: 1, limit: 18 }));
    return () => {
      dispatch(clearExplore());
    };
  }, [dispatch]);

  const getFullMediaUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  const handleOpenPost = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Grid Post */}
      <div className="grid grid-cols-3 gap-1 md:gap-6">
        {explorePosts.map((post) => (
          <div
            key={post._id}
            onClick={() => handleOpenPost(post)}
            className="relative aspect-square cursor-pointer group bg-gray-200 dark:bg-gray-800 overflow-hidden"
          >
            {/* Media Content */}
            {post.mediaType === "video" ? (
              <>
                <video
                  src={getFullMediaUrl(post.video || "")}
                  className="w-full h-full object-cover"
                />
                <Play className="absolute top-2 right-2 text-white fill-white w-4 h-4" />
              </>
            ) : (
              <img
                src={getFullMediaUrl(post.image)}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}

            {/* Overlay khi hover */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
              <div className="flex items-center gap-1.5">
                <Heart className="fill-white" size={20} />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="fill-white -rotate-90" size={20} />
                <span>{post.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center mt-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      )}

      {/* Nút Load more (Nếu có pagination) */}
      {explorePagination?.hasMore && !isLoading && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() =>
              dispatch(
                fetchExplorePosts({
                  page: (explorePagination.currentPage || 1) + 1,
                  limit: 12,
                }),
              )
            }
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Load more
          </button>
        </div>
      )}

      {/* Re-use Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          post={selectedPost}
        />
      )}
    </div>
  );
}
