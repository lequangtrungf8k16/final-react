export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Phân trang
export interface Pagination {
    currentPage: number;
    totalPages: number;
    hasMore: boolean;

    totalPosts?: number;
    totalComments?: number;
    totalFollowers?: number;
    totalFConversations?: number;
    totalFMessage?: number;
}

export interface PaginatedList<T> {
    item: T[];
    pagination: Pagination;
}
