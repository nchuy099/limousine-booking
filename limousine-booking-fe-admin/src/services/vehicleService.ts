import axiosInstance from './axios';
import { Vehicle } from '../types';

export const VehicleService = {
    // Lấy tất cả vehicles
    getVehicles: async () => {
        const response = await axiosInstance.get('/vehicle');
        return response.data.data;
    },

    // Thêm vehicle mới
    createVehicle: async (vehicle: Partial<Vehicle>) => {
        const response = await axiosInstance.post('/vehicle', vehicle);
        return response.data;
    },

    // Cập nhật vehicle
    updateVehicle: async (id: string, vehicle: Partial<Vehicle>) => {
        const response = await axiosInstance.put(`/vehicle/${id}`, vehicle);
        return response.data;
    },

    // Xóa vehicle
    deleteVehicle: async (id: string) => {
        const response = await axiosInstance.delete(`/vehicle/${id}`);
        return response.data;
    }
}; 