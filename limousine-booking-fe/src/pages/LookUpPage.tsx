import { useState } from 'react';
import { FaEnvelope, FaTicketAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import TicketCard from '../components/TicketCard';
import bookingService, { TicketData } from '../services/bookingService';

const LookUpPage = () => {
    const [searchType, setSearchType] = useState<'email' | 'ticketNumber'>('email');
    const [searchValue, setSearchValue] = useState('');
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) {
            toast.error('Vui lòng nhập thông tin tìm kiếm');
            return;
        }

        setIsSearching(true);
        setError(null);
        setTickets([]);

        try {
            if (searchType === 'ticketNumber') {
                // Using API for ticket number search
                const response = await bookingService.getBookingByTicketNumber(searchValue);
                if (response.success) {
                    setTickets([response.data]);
                } else {
                    setError(response.message || 'Không tìm thấy vé');
                    toast.error('Không tìm thấy vé');
                }
            } else {
                // Using API for email search
                const response = await bookingService.searchBookingsByEmail(searchValue);
                if (response.success && response.data.length > 0) {
                    setTickets(response.data);
                } else {
                    setError('Không tìm thấy vé cho email này');
                    toast.error('Không tìm thấy vé cho email này');
                }
            }
        } catch (err) {
            console.error('Error searching for ticket:', err);
            setError('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.');
            toast.error('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-8 py-8">
                <h1 className="text-3xl font-bold text-center mb-4 text-gray-900">Tra cứu vé</h1>
                <div className="w-20 h-1 bg-cyan-500 mx-auto mb-8"></div>

                {/* Search options */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
                    <div className="flex justify-center mb-6">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                className={`flex items-center px-4 py-2 rounded-md transition-colors ${searchType === 'email'
                                    ? 'bg-cyan-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-200'}`}
                                onClick={() => setSearchType('email')}
                            >
                                <FaEnvelope className="mr-2" />
                                <span>Tra cứu bằng Email</span>
                            </button>
                            <button
                                className={`flex items-center px-4 py-2 rounded-md transition-colors ${searchType === 'ticketNumber'
                                    ? 'bg-cyan-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-200'}`}
                                onClick={() => setSearchType('ticketNumber')}
                            >
                                <FaTicketAlt className="mr-2" />
                                <span>Tra cứu bằng Mã vé</span>
                            </button>
                        </div>
                    </div>

                    {/* Search input */}
                    <form onSubmit={handleSearch}>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label htmlFor="searchInput" className="block text-sm font-medium mb-1 text-gray-700">
                                    {searchType === 'email' ? 'Email' : 'Mã vé'}
                                </label>
                                <input
                                    id="searchInput"
                                    type={searchType === 'email' ? 'email' : 'text'}
                                    placeholder={searchType === 'email' ? 'Nhập địa chỉ email' : 'Nhập mã vé'}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-2 bg-cyan-500 text-white font-medium rounded-md hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                                    disabled={isSearching}
                                >
                                    {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Tickets list */}
                <div>
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Kết quả tra cứu</h2>

                    {isSearching ? (
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mr-3"></div>
                                <span>Đang tìm kiếm...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center text-red-500">
                            {error}
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
                            Chưa có kết quả tra cứu. Vui lòng nhập thông tin tìm kiếm.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {tickets.map((ticket, index) => (
                                <TicketCard
                                    key={index}
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
        </div>
    );
};

export default LookUpPage;
