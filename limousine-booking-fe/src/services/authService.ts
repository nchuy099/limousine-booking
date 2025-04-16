import axiosInstance from './axios';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

interface AuthResponse {
    success: boolean;
    data?: {
        accessToken: string;
        refreshToken: string;
        user?: {
            id: string;
            fullName: string;
            email: string;
            phoneNumber: string;
        };
    };
    message?: string;
}

interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data?: {
        accessToken: string;
    };
}

// Create event emitter for auth state changes
const authStateChange = new Event('authStateChange');

const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
        if (response.data.success && response.data.data) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
            if (response.data.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            window.dispatchEvent(authStateChange);
        }
        return response.data;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    async logout() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await axiosInstance.post('/auth/logout', { refreshToken });
            }
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.dispatchEvent(authStateChange);
        }
    },

    async refreshToken(): Promise<RefreshTokenResponse> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            this.logout();
            return { success: false, message: 'No refresh token available' };
        }

        try {
            const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh-token', {
                refreshToken
            });

            if (response.data.success && response.data.data) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                window.dispatchEvent(authStateChange);
                return response.data;
            }

            // Nếu refresh token hết hạn hoặc không hợp lệ
            this.logout();
            return { success: false, message: 'Invalid refresh token' };
        } catch (error) {
            this.logout();
            return { success: false, message: 'Failed to refresh token' };
        }
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    }
};

export default authService;