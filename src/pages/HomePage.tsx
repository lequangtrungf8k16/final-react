import PostItem from "@/components/home/PostItem";
import PostSkeleton from "@/components/home/PostSkeleton";
import { getFeed } from "@/store/slices/postSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";

export default function HomePage() {
    const dispatch = useDispatch<AppDispatch>();
    const { posts, isLoading } = useSelector((state: RootState) => state.post);

    useEffect(() => {
        if (posts.length === 0) {
            dispatch(getFeed({ limit: 10, offset: 0 }));
        }
    }, [dispatch, posts.length]);

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
                {!isLoading &&
                    posts.map((post) => (
                        <PostItem
                            key={post._id}
                            username={post.userId?.username || ""}
                            avatarUrl={post.userId?.profilePicture || ""}
                            imageUrl={
                                post.mediaType === "video"
                                    ? post.video || ""
                                    : post.image || ""
                            }
                            mediaType={post.mediaType}
                            caption={post.caption || ""}
                            likesCount={post.likes}
                            timeAgo={
                                post.createdAt
                                    ? formatDistanceToNow(
                                          new Date(post.createdAt),
                                          { addSuffix: true },
                                      )
                                    : ""
                            }
                        />
                    ))}
            </div>
            <div className="hidden lg:block w-80 pl-16 mt-8"></div>
        </div>
    );
}
