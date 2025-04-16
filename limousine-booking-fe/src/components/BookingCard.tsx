import { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaExchangeAlt } from 'react-icons/fa';

interface BookingCardProps {
    isVisible: boolean;
    isAbsolute?: boolean;
    onSearch: (params: { origin?: string; destination?: string; departureTime?: string; type?: 'STANDARD' | 'VIP' | '' }) => void;
}

const CITIES = ['Hải Phòng', 'Hà Nội', 'Nghệ An', 'Đà Nẵng', 'TP. Hồ Chí Minh'];
const TRIP_TYPES = [
    { value: 'STANDARD', label: 'Thường' },
    { value: 'VIP', label: 'VIP' }
];

const BookingCard = ({ isVisible, isAbsolute = true, onSearch }: BookingCardProps) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureTime, setDepartureTime] = useState(new Date().toLocaleDateString('en-CA'));
    const [type, setType] = useState<'STANDARD' | 'VIP' | ''>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSwapLocations = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    const handleOriginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newOrigin = e.target.value;
        setOrigin(newOrigin);
        if (newOrigin === destination) {
            setDestination('');
        }
    };

    const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDestination = e.target.value;
        setDestination(newDestination);
        if (newDestination === origin) {
            setOrigin('');
        }
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value as 'STANDARD' | 'VIP' | '');
    };

    const handleSearch = () => {
        try {
            setIsLoading(true);
            setError(null);

            // Create search params object with only non-empty values
            const searchParams: { origin?: string; destination?: string; departureTime?: string; type?: 'STANDARD' | 'VIP' | '' } = {};

            // Only add origin if it's not empty
            if (origin) {
                searchParams.origin = origin;
            }

            // Only add destination if it's not empty
            if (destination) {
                searchParams.destination = destination;
            }

            // Only add departureTime if it's not empty
            if (departureTime) {
                // Set a default time of 00:00 since we're only collecting the date
                searchParams.departureTime = `${departureTime}T00:00:00.000Z`;
            }

            // Only add type if it's not empty
            if (type) {
                searchParams.type = type;
            }

            onSearch(searchParams);
        } catch (error) {
            console.error('Search error:', error);
            setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tìm kiếm chuyến xe');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={`
                ${isAbsolute ? 'absolute left-1/2 -translate-x-1/2 md:top-[65%] top-1/6 w-[95%] md:w-[85%] lg:w-[70%] max-w-4xl' : 'w-full'} 
                bg-white rounded-lg shadow-lg 
                p-4 md:p-6 lg:p-8 
                z-10 transition-all duration-300 
                ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 pointer-events-none md:pointer-events-auto md:opacity-100 md:translate-y-0'
                }
            `}
        >
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:gap-4">
                {/* Origin - Tăng chiều rộng */}
                <div className="flex-[1.5]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ</label>
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" />
                        <select
                            value={origin}
                            onChange={handleOriginChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 appearance-none bg-white text-gray-700"
                        >
                            <option value="">Nơi đi</option>
                            {CITIES.map((city) => (
                                <option key={city} value={city} disabled={city === destination} className="text-gray-700">
                                    {city}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cyan-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Swap Button */}
                <button
                    onClick={handleSwapLocations}
                    className="self-center -my-2 md:mt-6 p-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors shadow-md"
                >
                    <FaExchangeAlt className="w-5 h-5" />
                </button>

                {/* Destination - Tăng chiều rộng */}
                <div className="flex-[1.5]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến</label>
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" />
                        <select
                            value={destination}
                            onChange={handleDestinationChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 appearance-none bg-white text-gray-700"
                        >
                            <option value="">Nơi đến</option>
                            {CITIES.map((city) => (
                                <option key={city} value={city} disabled={city === origin} className="text-gray-700">
                                    {city}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cyan-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Date */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đi</label>
                    <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" />
                        <input
                            type="date"
                            value={departureTime}
                            onChange={(e) => setDepartureTime(e.target.value)}
                            min={new Date().toLocaleDateString('en-CA')}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-700 [color-scheme:light]"
                        />
                    </div>
                </div>

                {/* Type - Giảm chiều rộng */}
                <div className="flex-[0.8]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe</label>
                    <div className="relative">
                        <select
                            value={type}
                            onChange={handleTypeChange}
                            className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 appearance-none bg-white text-gray-700"
                        >
                            <option value="">Tất cả</option>
                            {TRIP_TYPES.map((tripType) => (
                                <option key={tripType.value} value={tripType.value} className="text-gray-700">
                                    {tripType.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cyan-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="w-full md:w-auto px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-300 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
                    >
                        {isLoading ? 'Đang tìm kiếm...' : 'Tìm Kiếm'}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 text-sm text-red-600 text-center">
                    {error}
                </div>
            )}
        </div>
    );
};

export default BookingCard;