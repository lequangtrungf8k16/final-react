import axios, {
    AxiosError,
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from "axios";

const baseURL = "https://dummyjson.com";

const http: AxiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) config.headers.Authorization = `Bearer ${token}`;

        return config;
    },
    (error) => Promise.reject(error)
);

let isRefresh = false;
let listener: Array<(token: string) => void> = [];

http.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig; // Kiểm tra xem có quyền refresh hay không

        if (error.response?.status === 401 && originalRequest) {
            const refreshToken = localStorage.getItem("refresh_token");

            if (refreshToken) {
                if (!isRefresh) {
                    isRefresh = true; // Chặn không cho refresh nữa

                    try {
                        const response = await axios.post(
                            `${baseURL}/auth/refresh-token`,
                            {
                                refreshToken: refreshToken,
                            }
                        );

                        // access_token và refresh_token sửa lại theo API thầy An
                        const { access_token, refresh_token } = response.data;

                        localStorage.setItem("token", access_token);
                        localStorage.setItem("refresh_token", refresh_token);

                        originalRequest.headers.Authorization = `Bearer ${access_token}`;

                        listener.forEach((item) => item(access_token));

                        listener = [];

                        return http(originalRequest); // gọi lại api lỗi được phải hồi đầu tiên
                    } catch (refreshError) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("refresh_token");

                        window.location.href = "/login";
                        return Promise.reject(refreshError);
                    } finally {
                        isRefresh = false;
                    }
                } else {
                    return new Promise((resolve) => {
                        listener.push((newToken: string) => {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            resolve(http(originalRequest)); // những api phản hồi chậm hơn sẽ được push vào mảng trong trạng thai pending
                        });
                    });
                }
            }
        }
        return Promise.reject(error);
    }
);

export default http;
