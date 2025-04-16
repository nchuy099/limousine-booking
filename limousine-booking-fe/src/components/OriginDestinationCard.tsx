import { useEffect, useState } from 'react';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaInfoCircle } from 'react-icons/fa';
import bookingService from '../services/bookingService';
import BookingNav from './BookingNav';

interface OriginDestinationCardProps {
    price: number;
    tripId: string;
    selectedSeats: string[];
    onBack: () => void;
    onContinue: (subOrigin: { id: string, name: string, address: string }, subDestination: { id: string, name: string, address: string }) => void;
}

const OriginDestinationCard = ({
    tripId,
    price,
    selectedSeats,
    onBack,
    onContinue,
}: OriginDestinationCardProps) => {
    const totalPrice = price * selectedSeats.length;
    const [subOriginLocations, setSubOriginLocations] = useState<any[]>([]);
    const [subDestinaLocations, setSubDestinaLocations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSubOrigin, setSelectedSubOrigin] = useState<{ id: string, name: string, address: string } | null>(null);
    const [selectedSubDestination, setSelectedSubDestination] = useState<{ id: string, name: string, address: string } | null>(null);

    useEffect(() => {
        const fetchSubLocations = async () => {
            try {
                const data = await bookingService.getSubLocations(tripId);
                setSubOriginLocations(data.subOrigin);
                setSubDestinaLocations(data.subDestination);
            } catch (err) {
                setError('Failed to load sub-locations');
                console.error('Error fetching sub-locations:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubLocations();
    }, [tripId]);

    const handleContinue = () => {
        if (selectedSubOrigin && selectedSubDestination) {
            onContinue(selectedSubOrigin, selectedSubDestination);
        } else {
            console.error('Selected sub-locations are not valid');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Loading and Error States */}
            {isLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading sub-locations...</p>
                </div>
            )}

            {error && !isLoading && (
                <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {!isLoading && !error && (
                <>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left side - Departure Options */}
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Điểm đón</h3>
                            <div className="space-y-4">
                                {subOriginLocations.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedSubOrigin({ id: item.id, name: item.name, address: item.address })} // Update selection
                                        className={`border rounded-lg p-4 transition-colors cursor-pointer ${selectedSubOrigin && selectedSubOrigin.id === item.id ? "border-cyan-500 bg-cyan-50" : "hover:border-cyan-500"}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-cyan-500" />
                                                <span className="font-semibold">{new Date(item.subDepartureTime).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaMapMarkerAlt className="text-cyan-500" />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                                            <FaInfoCircle className="text-cyan-500 mt-1" />
                                            <p>Điểm đón chi tiết: {item.address}</p>
                                        </div>                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right side - Destination Options */}
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Điểm trả</h3>
                            <div className="space-y-4">
                                {subDestinaLocations.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedSubDestination({ id: item.id, name: item.name, address: item.address })} // Update selection
                                        className={`border rounded-lg p-4 transition-colors cursor-pointer ${selectedSubDestination && selectedSubDestination.id === item.id ? "border-cyan-500 bg-cyan-50" : "hover:border-cyan-500"}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-cyan-500" />
                                                <span className="font-semibold">{new Date(item.subArrivalTime).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaMapMarkerAlt className="text-cyan-500" />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                                            <FaInfoCircle className="text-cyan-500 mt-1" />
                                            <p>Điểm trả chi tiết: {item.address}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* Bottom section */}
            <BookingNav
                onBack={onBack}
                onContinue={handleContinue}
                totalPrice={totalPrice}
            />
        </div>
    );
};

export default OriginDestinationCard;