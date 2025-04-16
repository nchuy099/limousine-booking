import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '../contexts';
import bookingService from '../services/bookingService';
import TicketCard from '../components/TicketCard';

const MyBooking = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setIsLoading(true);
                const response = await bookingService.getMyBookings();
                if (response.success && response.data) {
                    setTickets(response.data);
                } else {
                    setError('Không thể tải danh sách vé');
                }
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <FaSpinner className="animate-spin h-12 w-12 text-cyan-600" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Đã có lỗi xảy ra</h2>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900">Vé của tôi</h1>
                    <p className="mt-2 text-gray-600">
                        Danh sách vé đã đặt của {user?.fullName}
                    </p>
                </div>

                {tickets.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Bạn chưa có vé nào</h3>
                        <p className="text-gray-600">Hãy đặt vé để bắt đầu hành trình của bạn</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {tickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticketNumber={ticket.ticketNumber}
                                seatNumber={ticket.seatNumber}
                                bookingTime={ticket.bookingTime}
                                origin={ticket.origin}
                                subOrigin={ticket.subOrigin}
                                destination={ticket.destination}
                                subDestination={ticket.subDestination}
                                departureTime={ticket.departureTime}
                                arrivalTime={ticket.arrivalTime}
                                licensePlate={ticket.licensePlate}
                                status={ticket.status}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBooking;
