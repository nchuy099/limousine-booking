import { useState, useEffect } from 'react';
import BookingCard from '../components/BookingCard';
import TripCard from '../components/TripCard';
import { useLocation } from 'react-router-dom';
import bookingService, { Trip as ApiTrip, SearchTripParams } from '../services/bookingService';

interface Trip {
    id: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    type: 'STANDARD' | 'VIP';
    price: number;
    availableSeats: number;
}

interface SearchParams {
    origin?: string;
    destination?: string;
    departureTime?: string;
    type?: 'STANDARD' | 'VIP' | '';
}

const BookingPage = () => {
    const location = useLocation();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (location.state?.searchParams) {
            handleSearch(location.state.searchParams);
        }
    }, [location.state]);

    const handleSearch = async (params: SearchParams, page: number = 1) => {
        try {
            setIsLoading(true);
            setError(null);
            setSearchParams(params);
            setCurrentPage(page);

            const searchTripParams: SearchTripParams = {
                origin: params.origin,
                destination: params.destination,
                departureTime: params.departureTime,
                type: params.type || undefined,
                limit: itemsPerPage,
                offset: (page - 1) * itemsPerPage
            };

            const response = await bookingService.searchTrips(searchTripParams);

            if (response.success && Array.isArray(response.data?.trips)) {
                const formattedTrips: Trip[] = response.data.trips.map((trip: ApiTrip) => ({
                    id: trip.id,
                    origin: trip.origin,
                    destination: trip.destination,
                    departureTime: trip.departureTime,
                    arrivalTime: trip.arrivalTime,
                    type: trip.type,
                    price: trip.price,
                    availableSeats: trip.availableSeats
                }));
                setTrips(formattedTrips);
                setTotalPages(Math.ceil(response.data.pagination.total / itemsPerPage));
            } else {
                setError(response.message || 'Không tìm thấy chuyến xe phù hợp');
                setTrips([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Search error:', error);
            setError('Có lỗi xảy ra khi tìm kiếm chuyến xe');
            setTrips([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (searchParams && newPage >= 1 && newPage <= totalPages) {
            handleSearch(searchParams, newPage);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-8 py-8">
                <h1 className="text-3xl font-bold text-center mb-4 text-gray-900">Đặt Chỗ</h1>
                <div className="w-20 h-1 bg-cyan-500 mx-auto mb-8"></div>

                {/* Search Form */}
                <div className="flex justify-center mb-8">
                    <div className="w-full">
                        <BookingCard
                            isVisible={true}
                            isAbsolute={false}
                            onSearch={handleSearch}
                        />
                    </div>
                </div>

                {/* Search Results */}
                <div>
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Kết quả tìm kiếm</h2>
                    
                    {isLoading ? (
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500 transform hover:scale-[1.01] transition-transform duration-300">
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mr-3"></div>
                                <span>Đang tìm kiếm chuyến xe...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center text-red-500 transform hover:scale-[1.01] transition-transform duration-300">
                            {error}
                        </div>
                    ) : trips.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {trips.map((trip: Trip) => (
                                    <div key={trip.id} className="transform hover:scale-[1.01] transition-transform duration-300">
                                        <TripCard
                                            id={trip.id}
                                            origin={trip.origin}
                                            destination={trip.destination}
                                            departureTime={trip.departureTime}
                                            arrivalTime={trip.arrivalTime}
                                            type={trip.type}
                                            price={trip.price}
                                            availableSeats={trip.availableSeats}
                                        />
                                    </div>
                                ))}
                            </div>
                            {/* Pagination */}
                            <div className="mt-6 flex justify-center items-center space-x-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-600'} text-white transition-colors duration-300`}
                                >
                                    Trang trước
                                </button>
                                <span className="text-gray-700">
                                    Trang {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-600'} text-white transition-colors duration-300`}
                                >
                                    Trang sau
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500 transform hover:scale-[1.01] transition-transform duration-300">
                            {searchParams ? 'Không tìm thấy chuyến xe phù hợp' : 'Vui lòng tìm kiếm chuyến xe'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;