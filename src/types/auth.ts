export interface LoginPayload {
    email?: string;
    username?: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    username: string;
    fullname: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}
