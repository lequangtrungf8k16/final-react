export interface User {
    id: string;
    username: string;
    fullname: string;
    avatarUrl?: string;
}

export interface UserProfile extends User {
    website?: string;
    followersCount: number;
    followingCount: number;
    postCount: number;
    isFollowing?: boolean;
}
