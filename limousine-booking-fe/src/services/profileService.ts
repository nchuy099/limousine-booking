import axiosInstance from './axios';

interface ProfileResponse {
    success: boolean;
    message?: string;
    data?: {
        fullName: string;
        email: string;
        phoneNumber: string;
    };
}

interface UpdateProfileData {
    fullName: string;
    email: string;
    phoneNumber: string;
}

const profileService = {
    async getProfile(): Promise<ProfileResponse> {
        const response = await axiosInstance.get<ProfileResponse>('/profile');
        return response.data;
    },

    async updateProfile(data: UpdateProfileData): Promise<ProfileResponse> {
        const response = await axiosInstance.put<ProfileResponse>('/profile', data);
        if (response.data.success && response.data.data) {
            // Lấy user hiện tại từ localStorage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            // Cập nhật thông tin mới
            const updatedUser = {
                ...currentUser,
                fullName: data.fullName,
                email: data.email,
                phoneNumber: data.phoneNumber
            };
            // Lưu lại vào localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Trigger event để AuthContext cập nhật
            window.dispatchEvent(new Event('authStateChange'));
        }
        return response.data;
    }
};

export default profileService;
