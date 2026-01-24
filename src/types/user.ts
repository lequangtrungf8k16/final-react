export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  profilePicture?: string;
  bio?: string;
  website?: string;

  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isVerified?: boolean;

  createdAt: string;
  gender?: "male" | "female" | "other";
}
