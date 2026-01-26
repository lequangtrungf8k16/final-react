import PostItem from "@/components/home/PostItem";
import PostSkeleton from "@/components/home/PostSkeleton";
import { getFeed } from "@/store/slices/postSlice";
import { accessChat } from "@/store/slices/chatSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import type { Post } from "@/types";
import PostDetailModal from "@/components/home/PostDetailModal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ChatWidget from "@/components/chat/ChatWidget";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isLoading, pagination } = useSelector(
    (state: RootState) => state.post,
  );
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

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

  const handleChatWithAuthor = (authorId: string) => {
    if (!authorId || authorId === currentUser?._id) return;
    dispatch(accessChat(authorId));
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !pagination?.hasMore) return;
    setIsLoadingMore(true);
    const currentCount = posts.length;
    await dispatch(getFeed({ limit: 10, offset: currentCount })).unwrap();
    setIsLoadingMore(false);
  };

  const hasMorePosts = pagination?.hasMore;

  return (
    <div className="flex justify-center w-full relative">
      <div className="w-full max-w-118 flex flex-col gap-4 mt-8 pb-20">
        {isLoading && posts.length === 0 && (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {posts.map((post) => {
          if (!post || !post._id) return null;
          const author = post.userId;

          return (
            <PostItem
              key={post._id}
              postId={post._id}
              isLiked={!!post.isLiked}
              isSaved={!!post.isSaved}
              username={author?.username || "Unknown"}
              avatarUrl={author?.profilePicture || ""}
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
              onChatClick={() => handleChatWithAuthor(author?._id)}
            />
          );
        })}

        {hasMorePosts && (
          <div className="flex justify-center mt-6 mb-8">
            <Button
              variant="secondary"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full md:w-auto px-8 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}

        {!hasMorePosts && posts.length > 0 && (
          <div className="text-center text-gray-500 text-sm mt-4 mb-10">
            You have reached the end!
          </div>
        )}
      </div>
      {selectedPost && (
        <PostDetailModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          post={selectedPost}
        />
      )}
      <ChatWidget />
    </div>
  );
}
