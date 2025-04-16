import axiosInstance from './axios';
import { Trip } from '../types';

export const TripService = {
    // Lấy tất cả trips
    getTrips: async () => {
        const response = await axiosInstance.get('/trip');
        return response.data.data;
    },

    // Thêm trip mới
    createTrip: async (trip: Partial<Trip>) => {
        const response = await axiosInstance.post('/trip', trip);
        return response.data;
    },

    // Thêm daily trip với khoảng thời gian
    createDailyTrip: async (trip: Partial<Trip> & { startDate: string; endDate: string }) => {
        const response = await axiosInstance.post('/trip/daily', trip);
        return response.data;
    },


    // Cập nhật trip
    updateTrip: async (id: string, trip: Partial<Trip>) => {
        const response = await axiosInstance.put(`/trip/${id}`, trip);
        return response.data;
    },

    // Xóa trip
    deleteTrip: async (id: string) => {
        const response = await axiosInstance.delete(`/trip/${id}`);
        return response.data;
    }
};