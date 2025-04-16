import axios, { AxiosError } from 'axios';
import authService from './authService';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to track if we're refreshing token
let isRefreshing = false;
// Store pending requests
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu là lỗi 401 và request không phải là refresh token
        if (error.response?.status === 401 && !originalRequest.url?.includes('/auth/refresh-token')) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => instance(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const response = await authService.refreshToken();
                
                if (!response.success) {
                    processQueue(new Error('Token refresh failed'));
                    return Promise.reject(error);
                }

                if (response.data?.accessToken) {
                    originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                    processQueue();
                    return instance(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;