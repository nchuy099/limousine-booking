import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Trip, Location, Vehicle } from '../../types';

interface DailyTripModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Trip> & { startDate: string; endDate: string }) => void;
    locations: Location[];
    vehicles: Vehicle[];
    isLoading: boolean;
}

const DailyTripModal: React.FC<DailyTripModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    locations,
    vehicles,
    isLoading,
}) => {
    const [formData, setFormData] = useState<Partial<Trip> & { startDate: string; endDate: string }>({        
        startDate: '',
        endDate: '',
        departureTime: '',
        arrivalTime: '',
        originLocationCode: '',
        destinationLocationCode: '',
        vehicleLicensePlate: '',
        status: 'SCHEDULED',
        type: 'STANDARD',
        price: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate dates
        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }
        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
            newErrors.endDate = 'End date must be after start date';
        }

        // Validate times
        if (!formData.departureTime) {
            newErrors.departureTime = 'Departure time is required';
        }
        if (!formData.arrivalTime) {
            newErrors.arrivalTime = 'Arrival time is required';
        } else if (formData.departureTime && formData.arrivalTime && formData.departureTime >= formData.arrivalTime) {
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
            onSubmit(formData);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Daily Trip"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Range Section */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.startDate}
                            onChange={(e) => {
                                setFormData({ ...formData, startDate: e.target.value });
                                setErrors({ ...errors, startDate: '' });
                            }}
                            disabled={isLoading}
                            required
                        />
                        {errors.startDate && (
                            <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.endDate}
                            onChange={(e) => {
                                setFormData({ ...formData, endDate: e.target.value });
                                setErrors({ ...errors, endDate: '' });
                            }}
                            disabled={isLoading}
                            required
                        />
                        {errors.endDate && (
                            <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Departure Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.departureTime ? 'border-red-500' : 'border-gray-300'}`}
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
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.arrivalTime ? 'border-red-500' : 'border-gray-300'}`}
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
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.originLocationCode ? 'border-red-500' : 'border-gray-300'}`}
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
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.destinationLocationCode ? 'border-red-500' : 'border-gray-300'}`}
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

                {/* Vehicle and Type Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle <span className="text-red-500">*</span>
                        </label>
                        <select
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.vehicleLicensePlate ? 'border-red-500' : 'border-gray-300'}`}
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
                </div>

                {/* Price Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
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
                                Creating...
                            </>
                        ) : (
                            'Create'
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default DailyTripModal;