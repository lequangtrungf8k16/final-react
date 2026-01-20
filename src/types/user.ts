export interface User {
    _id: string;
    username: string;
    email: string;
    fullname?: string;
    profilePicture?: string;
    bio?: string;
    website?: string;

    followersCount: number;
    followingCount: number;
    postCount: number;
    isFollowing?: boolean;
    isVerified?: boolean;

    createdAt: string;
    gender?: "male" | "female" | "other";
}
