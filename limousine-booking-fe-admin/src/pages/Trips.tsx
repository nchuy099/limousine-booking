import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import DailyTripModal from '../components/common/DailyTripModal';
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';
import { Trip, Location, Vehicle } from '../types';
import { TripService, LocationService, VehicleService } from '../services';
import { toast } from 'react-toastify';

const TripsPage = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isLoading, setIsLoading] = useState(false);

    const columns = [
        {
            key: 'origin',
            title: 'From',
            render: (code: string) => locations.find(l => l.code === code)?.name || code
        },
        {
            key: 'destination',
            title: 'To',
            render: (code: string) => locations.find(l => l.code === code)?.name || code
        },
        {
            key: 'departureTime',
            title: 'Departure Time',
            render: (time: string) => new Date(time).toLocaleString()
        },
        {
            key: 'arrivalTime',
            title: 'Arrival Time',
            render: (time: string) => new Date(time).toLocaleString()
        },
        // { key: 'vehicleLicensePlate', title: 'Vehicle' },
        // {
        //     key: 'status',
        //     title: 'Status',
        //     render: (status: Trip['status']) => (
        //         <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
        //             {status}
        //         </span>
        //     )
        // },
        {
            key: 'type',
            title: 'Type',
            render: (type: Trip['type']) => (
                <span className={`px-2 py-1 rounded-full text-sm ${type === 'VIP' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {type}
                </span>
            )
        },
        {
            key: 'price',
            title: 'Price',
            render: (price: any) => {
                const numericPrice = parseFloat(price);
                return isNaN(numericPrice)
                    ? '0 ₫'
                    : `${numericPrice.toLocaleString('vi-VN')} ₫`;
            }
        },
    ];

    const getStatusColor = (status: Trip['status']) => {
        switch (status) {
            case 'SCHEDULED':
                return 'bg-yellow-100 text-yellow-800';
            case 'ONGOING':
                return 'bg-blue-100 text-blue-800';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [tripsData, locationsData, vehiclesData] = await Promise.all([
                TripService.getTrips(),
                LocationService.getLocations(),
                VehicleService.getVehicles()
            ]);
            setTrips(Array.isArray(tripsData) ? tripsData : []);
            setLocations(Array.isArray(locationsData) ? locationsData : []);
            setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
        } catch (error) {
            toast.error('Failed to fetch data');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingTrip(null);
        setIsModalOpen(true);
    };

    const handleEdit = (trip: Trip) => {
        setEditingTrip(trip);
        setIsModalOpen(true);
    };

    const handleDelete = async (trip: Trip) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            try {
                setIsLoading(true);
                await TripService.deleteTrip(trip.id);
                toast.success('Trip deleted successfully');
                await fetchData();
            } catch (error) {
                toast.error('Failed to delete trip');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSubmit = async (formData: Partial<Trip>) => {
        try {
            setIsLoading(true);
            if (editingTrip) {
                await TripService.updateTrip(editingTrip.id, formData);
                toast.success('Trip updated successfully');
            } else {
                await TripService.createTrip(formData);
                toast.success('Trip created successfully');
            }
            await fetchData();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(editingTrip ? 'Failed to update trip' : 'Failed to create trip');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDailyTripSubmit = async (formData: Partial<Trip> & { startDate: string; endDate: string }) => {
        try {
            setIsLoading(true);
            await TripService.createDailyTrip(formData);
            toast.success('Daily trips created successfully');
            await fetchData();
            setIsDailyModalOpen(false);
        } catch (error) {
            toast.error('Failed to create daily trips');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const paginatedTrips = trips.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(trips.length / itemsPerPage);

    return (
        <>
            <PageHeader
                title="Trips"
                subtitle="Manage your trips"
                actions={
                    <div className="flex gap-3">
                        <Button
                            variant="primary"
                            icon={<FaPlus />}
                            onClick={handleAdd}
                            disabled={isLoading}
                        >
                            Add Trip
                        </Button>
                        <Button
                            variant="secondary"
                            icon={<FaCalendarAlt />}
                            onClick={() => setIsDailyModalOpen(true)}
                            disabled={isLoading}
                        >
                            Add Daily Trip
                        </Button>
                    </div>
                }
            />

            <Card>
                {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="space-x-1 text-cyan-600 text-lg">
                            <span className="inline-block animate-[bounce_1s_infinite]">.</span>
                            <span className="inline-block animate-[bounce_1s_infinite_.1s]">.</span>
                            <span className="inline-block animate-[bounce_1s_infinite_.2s]">.</span>
                        </div>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={paginatedTrips}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </Card>

            <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </Button>
                ))}
            </div>

            <TripModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                trip={editingTrip}
                locations={locations}
                vehicles={vehicles}
                isLoading={isLoading}
            />

            <DailyTripModal
                isOpen={isDailyModalOpen}
                onClose={() => setIsDailyModalOpen(false)}
                onSubmit={handleDailyTripSubmit}
                locations={locations}
                vehicles={vehicles}
                isLoading={isLoading}
            />
        </>
    );
};

interface TripModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Trip>) => void;
    trip: Trip | null;
    locations: Location[];
    vehicles: Vehicle[];
    isLoading: boolean;
}

const TripModal: React.FC<TripModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    trip,
    locations,
    vehicles,
    isLoading,
}) => {
    const [formData, setFormData] = useState<Partial<Trip>>(
        trip || {
            departureTime: '',
            arrivalTime: '',
            originLocationCode: '',
            destinationLocationCode: '',
            vehicleLicensePlate: '',
            status: 'SCHEDULED',
            type: 'STANDARD',
            price: 0,
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (trip) {
            setFormData({
                ...trip,
                departureTime: formatDateForInput(trip.departureTime),
                arrivalTime: formatDateForInput(trip.arrivalTime),
                price: typeof trip.price === 'string' ? parseFloat(trip.price) : trip.price,
            });
        } else {
            setFormData({
                departureTime: '',
                arrivalTime: '',
                originLocationCode: '',
                destinationLocationCode: '',
                vehicleLicensePlate: '',
                status: 'SCHEDULED',
                type: 'STANDARD',
                price: 0,
            });
        }
        setErrors({});
    }, [trip]);

    const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate departure time
        if (!formData.departureTime) {
            newErrors.departureTime = 'Departure time is required';
        }

        // Validate arrival time
        if (!formData.arrivalTime) {
            newErrors.arrivalTime = 'Arrival time is required';
        } else if (formData.arrivalTime && formData.departureTime && new Date(formData.arrivalTime) <= new Date(formData.departureTime)) {
            newErrors.arrivalTime = 'Arrival time must be after departure time';
        }

        // Validate locations
        if (!formData.originLocationCode) {
            newErrors.originLocationCode = 'Origin location is required';
        }
        if (!formData.destinationLocationCode) {
            newErrors.destinationLocationCode = 'Destination location is required';
        }
        if (formData.originLocationCode === formData.destinationLocationCode && formData.originLocationCode) {
            newErrors.destinationLocationCode = 'Destination must be different from origin';
        }

        // Validate vehicle
        if (!formData.vehicleLicensePlate) {
            newErrors.vehicleLicensePlate = 'Vehicle is required';
        }

        // Validate price
        if (typeof formData.price !== 'number' || formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                ...formData,
                price: Number(formData.price),
                departureTime: formData.departureTime ? new Date(formData.departureTime).toISOString() : '',
                arrivalTime: formData.arrivalTime ? new Date(formData.arrivalTime).toISOString() : '',
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={trip ? 'Edit Trip' : 'Add Trip'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Time Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Departure Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.departureTime ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.departureTime}
                            onChange={(e) => {
                                setFormData({ ...formData, departureTime: e.target.value });
                                setErrors({ ...errors, departureTime: '' });
                            }}
                            disabled={isLoading}
                            required
                        />
                        {errors.departureTime && (
                            <p className="mt-1 text-sm text-red-500">{errors.departureTime}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Arrival Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.arrivalTime ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.arrivalTime}
                            onChange={(e) => {
                                setFormData({ ...formData, arrivalTime: e.target.value });
                                setErrors({ ...errors, arrivalTime: '' });
                            }}
                            disabled={isLoading}
                            required
                        />
                        {errors.arrivalTime && (
                            <p className="mt-1 text-sm text-red-500">{errors.arrivalTime}</p>
                        )}
                    </div>
                </div>

                {/* Location Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Origin Location <span className="text-red-500">*</span>
                        </label>
                        <select
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.originLocationCode ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.originLocationCode}
                            onChange={(e) => {
                                setFormData({ ...formData, originLocationCode: e.target.value });
                                setErrors({ ...errors, originLocationCode: '' });
                            }}
                            disabled={isLoading}
                            required
                        >
                            <option value="">Select origin</option>
                            {locations.map(location => (
                                <option key={location.code} value={location.code}>
                                    {location.name}
                                </option>
                            ))}
                        </select>
                        {errors.originLocationCode && (
                            <p className="mt-1 text-sm text-red-500">{errors.originLocationCode}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destination Location <span className="text-red-500">*</span>
                        </label>
                        <select
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.destinationLocationCode ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.destinationLocationCode}
                            onChange={(e) => {
                                setFormData({ ...formData, destinationLocationCode: e.target.value });
                                setErrors({ ...errors, destinationLocationCode: '' });
                            }}
                            disabled={isLoading}
                            required
                        >
                            <option value="">Select destination</option>
                            {locations.map(location => (
                                <option
                                    key={location.code}
                                    value={location.code}
                                    disabled={location.code === formData.originLocationCode}
                                >
                                    {location.name}
                                </option>
                            ))}
                        </select>
                        {errors.destinationLocationCode && (
                            <p className="mt-1 text-sm text-red-500">{errors.destinationLocationCode}</p>
                        )}
                    </div>
                </div>

                {/* Vehicle and Status Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle <span className="text-red-500">*</span>
                        </label>
                        <select
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.vehicleLicensePlate ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.vehicleLicensePlate}
                            onChange={(e) => {
                                setFormData({ ...formData, vehicleLicensePlate: e.target.value });
                                setErrors({ ...errors, vehicleLicensePlate: '' });
                            }}
                            disabled={isLoading}
                            required
                        >
                            <option value="">Select vehicle</option>
                            {vehicles.map(vehicle => (
                                <option key={vehicle.licensePlate} value={vehicle.licensePlate}>
                                    {vehicle.licensePlate} ({vehicle.capacity})
                                </option>
                            ))}
                        </select>
                        {errors.vehicleLicensePlate && (
                            <p className="mt-1 text-sm text-red-500">{errors.vehicleLicensePlate}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as Trip['status'] })}
                            disabled={isLoading}
                            required
                        >
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="ONGOING">Ongoing</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Type and Price Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as Trip['type'] })}
                            disabled={isLoading}
                            required
                        >
                            <option value="STANDARD">Standard</option>
                            <option value="VIP">VIP</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.price ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                value={formData.price || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                        ...formData,
                                        price: value === '' ? 0 : Math.round(parseFloat(value))
                                    });
                                    setErrors({ ...errors, price: '' });
                                }}
                                min="0"
                                step="1"
                                disabled={isLoading}
                                required
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">₫</span>
                        </div>
                        {errors.price && (
                            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                        )}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block animate-spin mr-2">⌛</span>
                                {trip ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            trip ? 'Update' : 'Create'
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TripsPage;