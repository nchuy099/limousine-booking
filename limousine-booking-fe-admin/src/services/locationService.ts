import axiosInstance from './axios';
import { Location } from '../types';

export const LocationService = {
    // Lấy tất cả locations
    getLocations: async () => {
        const response = await axiosInstance.get('/location');
        return response.data.data;
    },

    // Thêm location mới
    createLocation: async (location: Partial<Location>) => {
        const response = await axiosInstance.post('/location', location);
        return response.data;
    },

    // Cập nhật location
    updateLocation: async (id: string, location: Partial<Location>) => {
        const response = await axiosInstance.put(`/location/${id}`, location);
        return response.data;
    },

    // Xóa location
    deleteLocation: async (id: string) => {
        const response = await axiosInstance.delete(`/location/${id}`);
        return response.data;
    }
}; 