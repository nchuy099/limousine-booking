import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaUser, FaCheck, FaArrowRight } from 'react-icons/fa';
import bookingService from '../services/bookingService';
import BookingNav from './BookingNav';

interface SeatCardProps {
    price: number;
    type: 'STANDARD' | 'VIP';
    id: string;
    onContinue: (seats: string[]) => void;
}

const SeatCard = ({ price, type, id, onContinue }: SeatCardProps) => {
    const [bookedSeats, setBookedSeats] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookedSeats = async () => {
            try {
                const seats = await bookingService.getBookedSeats(id);
                setBookedSeats(seats);
            } catch (err) {
                setError('Failed to load seat availability');
                console.error('Error fetching booked seats:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookedSeats();
    }, [id]);

    // Generate seats based on type
    const seats = Array.from({ length: type === 'STANDARD' ? 36 : 20 }, (_, i) => {
        if (type === 'STANDARD') {
            const col = Math.floor(i / 6);
            const row = (i % 6) + 1;
            const floor = col < 3 ? 1 : 2;
            const colLetter = floor === 1 ? ['A', 'B', 'C'][col] : ['D', 'E', 'F'][col - 3];
            return {
                id: i + 1,
                seatNumber: `${colLetter}${row}`,
                isOccupied: bookedSeats.includes(`${colLetter}${row}`),
                isSelected: false
            };
        } else {
            // VIP configuration
            const col = Math.floor(i / 5);
            const row = (i % 5) + 1;
            const floor = col < 2 ? 1 : 2;
            const colLetter = floor === 1 ? ['A', 'B'][col] : ['C', 'D'][col - 2];
            return {
                id: i + 1,
                seatNumber: `${colLetter}${row}`,
                isOccupied: bookedSeats.includes(`${colLetter}${row}`),
                isSelected: false
            };
        }
    });

    // Group seats by column letter for better rendering
    const groupSeatsByColumn = (seats: any[], letters: string[]) => {
        return letters.map(letter =>
            seats.filter(seat => seat.seatNumber.startsWith(letter))
                .sort((a, b) => parseInt(a.seatNumber.slice(1)) - parseInt(b.seatNumber.slice(1)))
        );
    };

    const floor1Columns = groupSeatsByColumn(
        seats.filter(seat => (type === 'STANDARD' ? ['A', 'B', 'C'] : ['A', 'B']).some(letter => seat.seatNumber.startsWith(letter))),
        type === 'STANDARD' ? ['A', 'B', 'C'] : ['A', 'B']
    );

    const floor2Columns = groupSeatsByColumn(
        seats.filter(seat => (type === 'STANDARD' ? ['D', 'E', 'F'] : ['C', 'D']).some(letter => seat.seatNumber.startsWith(letter))),
        type === 'STANDARD' ? ['D', 'E', 'F'] : ['C', 'D']
    );

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const toggleSeat = (seatNumber: string) => {
        setSelectedSeats((prev: string[]) => {
            if (prev.includes(seatNumber)) {
                return prev.filter((number: string) => number !== seatNumber);
            }
            return [...prev, seatNumber];
        });
    };

    const totalPrice = selectedSeats.length * price;

    const handleContinue = () => {
        onContinue(selectedSeats);
    };

    const renderSeatButton = (seat: any) => (
        <button
            key={seat.id}
            onClick={() => !seat.isOccupied && toggleSeat(seat.seatNumber)}
            disabled={seat.isOccupied}
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                ${seat.isOccupied
                    ? 'bg-gray-300 cursor-not-allowed'
                    : selectedSeats.includes(seat.seatNumber)
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white border-2 border-gray-300 hover:border-cyan-500'
                }`}
        >
            {seat.seatNumber}
        </button>
    );

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Loading and Error States */}
            {isLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading seat availability...</p>
                </div>
            )}

            {error && !isLoading && (
                <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {!isLoading && !error && (
                <>
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-cyan-500">
                                <FaUser className="text-sm" />
                                <span className="font-medium">Chọn chỗ</span>
                            </div>
                            <FaArrowRight className="text-gray-400" />
                            <div className="flex items-center gap-1 text-gray-400">
                                <FaMapMarkerAlt className="text-sm" />
                                <span>Điểm đón/trả</span>
                            </div>
                            <FaArrowRight className="text-gray-400" />
                            <div className="flex items-center gap-1 text-gray-400">
                                <FaCheck className="text-sm" />
                                <span>Nhập thông tin</span>
                            </div>
                        </div>
                    </div>

                    {/* Bus Map */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                                <span className="text-sm text-gray-600">Ghế còn trống</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                <span className="text-sm text-gray-600">Ghế đã đặt</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                                <span className="text-sm text-gray-600">Ghế đang chọn</span>
                            </div>
                        </div>

                        <div className="flex gap-8">
                            {/* Floor 1 */}
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Tầng 1</h4>
                                <div className="flex justify-center gap-8 p-4 bg-gray-50 rounded-lg">
                                    {floor1Columns.map((column, idx) => (
                                        <div key={idx} className="flex flex-col gap-4">
                                            {column.map(seat => renderSeatButton(seat))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floor 2 */}
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Tầng 2</h4>
                                <div className="flex justify-center gap-8 p-4 bg-gray-50 rounded-lg">
                                    {floor2Columns.map((column, idx) => (
                                        <div key={idx} className="flex flex-col gap-4">
                                            {column.map(seat => renderSeatButton(seat))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Nav */}
                    <BookingNav
                        onContinue={handleContinue}
                        totalPrice={totalPrice}
                    />
                </>
            )}
        </div>
    );
};

export default SeatCard; 