import { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowRight, FaWifi, FaUtensils, FaWater, FaTv, FaSnowflake, FaUserTie } from 'react-icons/fa';
import SeatCard from './SeatCard';
import OriginDestinationCard from './OriginDestinationCard';
import InfoCard from './InfoCard';
import { useNavigate } from 'react-router-dom';

interface TripCardProps {
    id: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    type: 'STANDARD' | 'VIP';
    price: number;
    availableSeats: number;
}

const TripCard = ({ id, origin, destination, departureTime, arrivalTime, type, price, availableSeats }: TripCardProps) => {
    const navigate = useNavigate();
    const [showSeatCard, setShowSeatCard] = useState(false);
    const [showOriginDestinationCard, setShowOriginDestinationCard] = useState(false);
    const [showInfoCard, setShowInfoCard] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [selectedSubOrigin, setSelectedSubOrigin] = useState<{ id: string, name: string, address: string } | null>(null);
    const [selectedSubDestination, setSelectedSubDestination] = useState<{ id: string, name: string, address: string } | null>(null);


    const handleContinue = () => {
        setShowSeatCard(true);
    };

    const handleSeatContinue = (seats: string[]) => {
        setSelectedSeats(seats);
        setShowOriginDestinationCard(true);
    };

    const handleOriginDestinationBack = () => {
        setShowOriginDestinationCard(false);
    };

    const handleOriginDestinationContinue = (subOrigin: { id: string, name: string, address: string }, subDestination: { id: string, name: string, address: string }) => {
        setSelectedSubOrigin(subOrigin);
        setSelectedSubDestination(subDestination);
        setShowInfoCard(true);
    };

    const handleInfoBack = () => {
        setShowInfoCard(false);
    };


    const getServiceDetails = (tripType: 'STANDARD' | 'VIP') => {
        if (tripType === 'VIP') {
            return [
                { icon: <FaUserTie />, text: 'Tài xế chuyên nghiệp' },
                { icon: <FaWifi />, text: 'Wifi miễn phí' },
                { icon: <FaUtensils />, text: 'Đồ ăn nhẹ & nước uống' },
                { icon: <FaTv />, text: 'Màn hình giải trí' },
                { icon: <FaSnowflake />, text: 'Điều hòa riêng' },
                { icon: <FaWater />, text: 'Khăn lạnh miễn phí' }
            ];
        } else {
            return [
                { icon: <FaUserTie />, text: 'Tài xế chuyên nghiệp' },
                { icon: <FaWater />, text: 'Nước uống miễn phí' },
                { icon: <FaSnowflake />, text: 'Điều hòa' }
            ];
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left side - Trip Information */}
                    <div className="flex-1 relative">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Chi Tiết Chuyến Đi</h3>
                        <div className="flex flex-col items-center">
                            {/* Locations Row */}
                            <div className="flex items-center gap-4 w-full mb-6">
                                {/* Departure */}
                                <div className="flex-1 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <FaMapMarkerAlt className="text-cyan-500 text-3xl" />
                                        <p className="font-bold text-4xl text-black">{origin}</p>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="flex-shrink-0">
                                    <FaArrowRight className="text-cyan-500 text-2xl" />
                                </div>

                                {/* Arrival */}
                                <div className="flex-1 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <FaMapMarkerAlt className="text-cyan-500 text-3xl" />
                                        <p className="font-bold text-4xl text-black">{destination}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Times Row */}
                            <div className="flex items-center w-full">
                                <div className="flex-1 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center text-lg text-gray-600">
                                            <FaClock className="mr-2" />
                                            {new Date(departureTime).toLocaleTimeString()}
                                        </div>
                                        <div className="flex items-center text-lg text-gray-600">
                                            <FaCalendarAlt className="mr-2" />
                                            {new Date(departureTime).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="text-base font-semibold text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-200 shadow-sm">
                                        ~{Math.round((new Date(arrivalTime).getTime() - new Date(departureTime).getTime()) / (1000 * 60 * 60))}h
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col items-center gap-1">

                                        <div className="flex items-center text-lg text-gray-600">
                                            <FaClock className="mr-2" />
                                            {new Date(arrivalTime).toLocaleTimeString()}
                                        </div>
                                        <div className="flex items-center text-lg text-gray-600">
                                            <FaCalendarAlt className="mr-2" />
                                            {new Date(arrivalTime).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full opacity-20 -z-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100 rounded-full opacity-20 -z-10"></div>
                        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-cyan-200 rounded-full opacity-20 -z-10 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>

                    {/* Right side - Trip Type and Price */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xl font-bold text-gray-900">{type === 'STANDARD' ? 'Thường' : 'VIP'}</h4>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{Math.floor(price).toLocaleString('vi-VN')} VND</p>
                                    <p className="text-sm text-gray-500">mỗi ghế</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <span>Số ghế còn trống: {availableSeats}</span>
                            </div>
                            <div className="border-t pt-4">
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Dịch vụ bao gồm:</h5>
                                <div className="grid grid-cols-2 gap-2">
                                    {getServiceDetails(type).map((service, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="text-cyan-500">{service.icon}</span>
                                            <span>{service.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleContinue}
                                className="w-full mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                            >
                                Tiếp Tục
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* SeatCard */}
            {showSeatCard && !showOriginDestinationCard && !showInfoCard && (
                <div className="max-w-5xl mx-auto">
                    <SeatCard
                        price={price}
                        type={type}
                        id={id}
                        onContinue={handleSeatContinue}
                    />
                </div>
            )}

            {/* DepartDestinaCard */}
            {showOriginDestinationCard && !showInfoCard && (
                <div className="max-w-5xl mx-auto">
                    <OriginDestinationCard
                        price={price}
                        selectedSeats={selectedSeats}
                        tripId={id}
                        onBack={handleOriginDestinationBack}
                        onContinue={handleOriginDestinationContinue}
                    />
                </div>
            )}

            {/* InfoCard */}
            {showInfoCard && (
                <div className="max-w-5xl mx-auto">
                    <InfoCard
                        tripId={id}
                        origin={origin}
                        destination={destination}
                        departureTime={departureTime}
                        arrivalTime={arrivalTime}
                        type={type}
                        selectedSubOrigin={selectedSubOrigin}
                        selectedSubDestination={selectedSubDestination}
                        price={price}
                        selectedSeats={selectedSeats}
                        onBack={handleInfoBack}
                    />
                </div>
            )}
        </div>
    );
};

export default TripCard;