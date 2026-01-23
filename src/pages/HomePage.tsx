import PostItem from "@/components/home/PostItem";
import PostSkeleton from "@/components/home/PostSkeleton";
import { getFeed } from "@/store/slices/postSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import type { Post } from "@/types";
import PostDetailModal from "@/components/home/PostDetailModal";
import SuggestedUsers from "@/components/home/SuggestedUsers";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isLoading, pagination } = useSelector(
    (state: RootState) => state.post,
  );

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(getFeed({ limit: 10, offset: 0 }));
    }
  }, [dispatch, posts.length]);

  const handleOpenComment = (post: Post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  // --- HÀM XỬ LÝ LOAD MORE ---
  const handleLoadMore = async () => {
    setIsLoadingMore(true);

    const currentCount = posts.length;

    await dispatch(getFeed({ limit: 10, offset: currentCount })).unwrap();

    setIsLoadingMore(false);
  };

  const hasMorePosts = pagination && posts.length < pagination.totalPages;

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-118 flex flex-col gap-4 mt-8 pb-20">
        {isLoading && posts.length === 0 && (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {/* Danh sách bài viết */}
        {posts.map((post) => {
          if (!post || !post._id) return null;
          return (
            <PostItem
              key={post._id}
              postId={post._id}
              isLiked={!!post.isLiked}
              isSaved={!!post.isSaved}
              username={post.userId?.username || ""}
              avatarUrl={post.userId?.profilePicture || ""}
              imageUrl={
                post.mediaType === "video" ? post.video || "" : post.image || ""
              }
              mediaType={post.mediaType}
              caption={post.caption || ""}
              likesCount={post.likes}
              timeAgo={
                post.createdAt
                  ? formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })
                  : ""
              }
              onCommentClick={() => handleOpenComment(post)}
            />
          );
        })}

        {/* --- NÚT XEM THÊM --- */}
        {hasMorePosts && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full md:w-auto min-w-38"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Xem thêm"
              )}
            </Button>
          </div>
        )}

        {/* Hết bài */}
        {!hasMorePosts && posts.length > 0 && (
          <div className="text-center text-gray-500 text-sm mt-4">
            You have reached the end!
          </div>
        )}
      </div>

      <div className="hidden lg:block w-80 pl-16 mt-8">
        <SuggestedUsers />
      </div>

      {selectedPost && (
        <PostDetailModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          post={selectedPost}
        />
      )}
    </div>
  );
}
