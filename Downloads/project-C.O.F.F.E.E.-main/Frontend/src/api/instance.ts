import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true
});

let isRefreshing = false;
let failedQueue: any[] = [];
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

instance.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

const processQueue = (error: any, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const logoutUser = () => {
    setAccessToken(null);
};

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const response = await instance.post('/auth/refresh');
                const { accessToken } = response.data.data;
                setAccessToken(accessToken);
                processQueue(null, accessToken);
                return instance(originalRequest);
            } catch (refreshError: any) {
                processQueue(refreshError, null);
                if (
                    refreshError.response?.status === 401 ||
                    refreshError.response?.status === 403
                ) {
                    logoutUser();
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        } else {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return instance(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }
    }
);

export default instance;