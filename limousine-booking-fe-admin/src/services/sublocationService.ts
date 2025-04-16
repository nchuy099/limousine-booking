import axiosInstance from './axios';
import { Sublocation } from '../types';

export const SublocationService = {
    // Lấy tất cả sublocations
    getSublocations: async () => {
        const response = await axiosInstance.get('/sublocation');
        return response.data.data;
    },

    // Thêm sublocation mới
    createSublocation: async (sublocation: Partial<Sublocation>) => {
        const response = await axiosInstance.post('/sublocation', sublocation);
        return response.data;
    },

    // Cập nhật sublocation
    updateSublocation: async (id: string, sublocation: Partial<Sublocation>) => {
        const response = await axiosInstance.put(`/sublocation/${id}`, sublocation);
        return response.data;
    },

    // Xóa sublocation
    deleteSublocation: async (id: string) => {
        const response = await axiosInstance.delete(`/sublocation/${id}`);
        return response.data;
    }
}; 