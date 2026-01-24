import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getUserById, clearSelectedUser } from "@/store/slices/userSlice";
import { fetchUserPosts, clearUserPosts } from "@/store/slices/postSlice";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import PostDetailModal from "@/components/home/PostDetailModal";
import CreatePostModal from "@/components/create-post/CreatePostModal";
import EditProfileModal from "@/components/profile/EditProfileModal";
import {
  Loader2,
  Heart,
  MessageCircle,
  Play,
  Camera,
  AlertCircle,
} from "lucide-react";
import type { Post } from "@/types/post";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_BASE_URL;

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux State
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const {
    selectedUser,
    isLoading: isUserLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user);
  const { userPosts, isLoading: isPostLoading } = useSelector(
    (state: RootState) => state.post,
  );

  // Local State
  const [activeTab, setActiveTab] = useState<"all" | "video" | "saved">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Xác định ID
  const profileId = id || currentUser?._id;
  const isOwnProfile = currentUser?._id === profileId;

  // Fetch User Info
  useEffect(() => {
    if (profileId) {
      dispatch(getUserById(profileId));
    }
  }, [dispatch, profileId]);

  // Fetch Posts
  useEffect(() => {
    if (profileId) {
      dispatch(
        fetchUserPosts({
          userId: profileId,
          filter: activeTab,
          limit: 20,
          offset: 0,
        }),
      );
    }
  }, [dispatch, profileId, activeTab]);

  // Cleanup
  useEffect(() => {
    return () => {
      dispatch(clearSelectedUser());
      dispatch(clearUserPosts());
    };
  }, [dispatch]);

  const getFullMediaUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  // Loading
  if (isUserLoading && !selectedUser) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-gray-500" size={40} />
      </div>
    );
  }

  // Error State
  if (userError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4 text-center px-4">
        <AlertCircle className="text-red-500" size={50} />
        <p className="text-xl font-semibold">Something went wrong</p>
        <p className="text-gray-500">{userError}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Not Found State
  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-xl font-semibold">User not found</p>
        <p className="text-gray-500 text-sm">
          {profileId
            ? `ID: ${profileId}`
            : "No Profile ID found. Are you logged in?"}
        </p>
        <Button
          variant="default"
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            navigate("/login");
          }}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* HEADER */}
      <ProfileHeader
        onEditProfile={() => setIsEditProfileOpen(true)}
        user={selectedUser}
        isOwnProfile={isOwnProfile}
      />

      {/* TABS */}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
        isOwnProfile={isOwnProfile}
      />

      {/* POST GRID */}
      <div className="px-4 md:px-0 mt-4">
        {isPostLoading && userPosts.length === 0 ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" />
          </div>
        ) : userPosts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {userPosts.map((post) => (
              <div
                key={post._id}
                onClick={() => handlePostClick(post)}
                className="relative aspect-square cursor-pointer group bg-gray-100 dark:bg-gray-800"
              >
                {post.mediaType === "video" ? (
                  <video
                    src={getFullMediaUrl(post.video || "")}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={getFullMediaUrl(post.image)}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                )}

                {post.mediaType === "video" && (
                  <Play className="absolute top-2 right-2 text-white fill-white w-4 h-4 z-10" />
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                  <div className="flex items-center gap-1">
                    <Heart className="fill-white" size={18} />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle
                      className="fill-white -rotate-90"
                      size={18}
                    />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="border-2 border-black dark:border-white rounded-full p-4">
              <Camera size={40} />
            </div>
            <h2 className="text-2xl font-bold">
              {activeTab === "saved" ? "No saved posts" : "No posts yet"}
            </h2>
            {isOwnProfile && activeTab === "all" && (
              <Button
                variant="link"
                className="text-blue-500"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Share your first photo
              </Button>
            )}
          </div>
        )}
      </div>

      {selectedUser && (
        <EditProfileModal
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
          currentUser={selectedUser}
        />
      )}

      <CreatePostModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {selectedPost && (
        <PostDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          post={selectedPost}
        />
      )}
    </div>
  );
}
