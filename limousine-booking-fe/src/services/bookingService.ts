import axiosInstance from './axios';

export interface SearchTripParams {
    origin?: string;
    destination?: string;
    departureTime?: string;
    type?: 'STANDARD' | 'VIP';
    limit?: number;
    offset?: number;
}

export interface Trip {
    id: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    type: 'STANDARD' | 'VIP';
    price: number;
    availableSeats: number;
}

export interface SearchTripResponse {
    success: boolean;
    data?: {
        trips: Trip[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
        }
    };
    message?: string;
}

export interface TicketData {
    ticketNumber: string;
    seatNumber: string;
    bookingTime: string;
    origin: string;
    subOrigin: string;
    destination: string;
    subDestination: string;
    departureTime: string;
    arrivalTime: string;
    licensePlate: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

export interface TicketResponse {
    success: boolean;
    message: string;
    data: TicketData;
}

export interface BookingListResponse {
    success: boolean;
    message: string;
    data: TicketData[]
}

const bookingService = {
    async searchTrips(params: SearchTripParams): Promise<SearchTripResponse> {
        try {
            const searchParams = {
                limit: 5,
                offset: 0,
                ...params
            };

            const response = await axiosInstance.get<SearchTripResponse>('/trip/search', {
                params: searchParams
            });
            return response.data;
        } catch (error) {
            console.error('Search trips error:', error);
            throw error;
        }
    },

    async getBookedSeats(id: string): Promise<string[]> {
        try {
            const response = await axiosInstance.get<{ success: boolean; data?: string[]; message?: string }>(`/trip/${id}/booked-seats`);
            if (response.data.success) {
                return response.data.data || [];
            }
            throw new Error(response.data.message || 'Failed to fetch booked seats');
        } catch (error) {
            throw error;
        }
    },

    getSubLocations: async (id: string) => {
        try {
            const response = await axiosInstance.get<{ success: boolean; data?: any; message?: string }>(`/trip/${id}/sub-locations`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to fetch sub-locations');
        } catch (error) {
            throw error;
        }
    },

    async createBooking(bookingDetails: any): Promise<{ success: boolean; message: string; data: any }> {
        try {
            const response = await axiosInstance.post<{ success: boolean; message: string; data: any }>('/booking', bookingDetails);
            return response.data;
        } catch (error) {
            console.error('Create booking error:', error);
            throw error;
        }
    },

    async getBookingByTicketNumber(ticketNumber: string): Promise<TicketResponse> {
        try {
            const response = await axiosInstance.get<TicketResponse>(`/booking/${ticketNumber}`);
            return response.data;
        } catch (error) {
            console.error('Get booking by ticket number error:', error);
            throw error;
        }
    },

    async searchBookingsByEmail(email: string): Promise<BookingListResponse> {
        try {
            const response = await axiosInstance.get<BookingListResponse>('/booking/search', {
                params: { email }
            });
            return response.data;
        } catch (error) {
            console.error('Search bookings by email error:', error);
            throw error;
        }
    },

    getMyBookings: async (): Promise<BookingListResponse> => {
        try {
            const response = await axiosInstance.get<BookingListResponse>('/booking/list');
            return response.data;
        } catch (error) {
            console.error('Error fetching my bookings:', error);
            throw error;
        }
    }
};

export default bookingService; 