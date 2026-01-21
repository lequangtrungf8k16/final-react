import { Skeleton } from "../ui/skeleton";

export default function PostSkeleton() {
    return (
        <div className="flex flex-col w-full border-b border-gray-200 pb-6 mb-6 md:border-none">
            {/* 1. Header Skeleton: Avatar + Name */}
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-24" /> {/* Username */}
                        <Skeleton className="h-2 w-16" /> {/* Time */}
                    </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />{" "}
                {/* More option button */}
            </div>

            {/* 2. Image Skeleton */}
            <div className="w-full aspect-square mb-3">
                <Skeleton className="w-full h-full rounded-sm" />
            </div>

            {/* 3. Actions Skeleton */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-6" /> {/* Heart */}
                    <Skeleton className="h-6 w-6" /> {/* Comment */}
                    <Skeleton className="h-6 w-6" /> {/* Share */}
                </div>
                <Skeleton className="h-6 w-6" /> {/* Bookmark */}
            </div>

            {/* 4. Caption Lines */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" /> {/* Likes count */}
                <Skeleton className="h-4 w-full" /> {/* Caption line 1 */}
                <Skeleton className="h-4 w-2/3" /> {/* Caption line 2 */}
            </div>
        </div>
    );
}
