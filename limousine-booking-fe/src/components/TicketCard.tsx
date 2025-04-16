import { FaTicketAlt, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUser, FaBus } from 'react-icons/fa';

interface TicketProps {
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

const TicketCard = ({
    ticketNumber,
    seatNumber,
    bookingTime,
    origin,
    subOrigin,
    destination,
    subDestination,
    departureTime,
    arrivalTime,
    licensePlate,
    status
}: TicketProps) => {
    // Format dates for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    // Get status color
    const getStatusColor = () => {
        switch (status) {
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status text in Vietnamese
    const getStatusText = () => {
        switch (status) {
            case 'CONFIRMED':
                return 'Đã xác nhận';
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'CANCELLED':
                return 'Đã hủy';
            case 'COMPLETED':
                return 'Đã hoàn thành';
            default:
                return status;
        }
    };

    // Calculate journey duration
    const calculateDuration = () => {
        const departure = new Date(departureTime);
        const arrival = new Date(arrivalTime);
        const durationMs = arrival.getTime() - departure.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
            {/* Ticket header */}
            <div className="bg-cyan-600 text-white p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FaTicketAlt />
                        <span className="font-semibold">Mã vé: {ticketNumber}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                        {getStatusText()}
                    </div>
                </div>
            </div>

            {/* Ticket body */}
            <div className="p-4">
                <div className="flex flex-col md:flex-row md:gap-6">
                    {/* Route information */}
                    <div className="flex-1 mb-6 md:mb-0">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                                <div className="h-5 w-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-white"></div>
                                </div>
                                <div className="h-12 w-0.5 bg-gray-300 mx-auto my-1"></div>
                                <div className="h-5 w-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-white"></div>
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="mb-4">
                                    <p className="text-gray-900 font-medium">{origin}</p>
                                    <p className="text-gray-600 text-sm">{subOrigin}</p>
                                    <p className="text-cyan-600 text-sm font-medium mt-1">
                                        {formatDate(departureTime)} - {formatTime(departureTime)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium">{destination}</p>
                                    <p className="text-gray-600 text-sm">{subDestination}</p>
                                    <p className="text-cyan-600 text-sm font-medium mt-1">
                                        {formatDate(arrivalTime)} - {formatTime(arrivalTime)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking details */}
                    <div className="flex-1 border-t md:border-t-0 md:border-l border-dashed border-gray-200 pt-4 md:pt-0 md:pl-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <FaUser className="text-cyan-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Số ghế</p>
                                    <p className="text-gray-800 font-medium">{seatNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock className="text-cyan-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Thời gian di chuyển</p>
                                    <p className="text-gray-800 font-medium">{calculateDuration()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaBus className="text-cyan-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Biển số xe</p>
                                    <p className="text-gray-800 font-medium">{licensePlate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-cyan-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Ngày đặt</p>
                                    <p className="text-gray-800 font-medium">{formatDate(bookingTime)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticket footer with QR code placeholder */}
            <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <button className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center gap-1">
                        <span>Chi tiết</span>
                    </button>
                    <button className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors text-sm font-medium">
                        Tải vé
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
