import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { FaPlus } from 'react-icons/fa';
import { VehicleService } from '../services';
import { toast } from 'react-toastify';
import { Vehicle, VehicleCapacity } from '../types'; // Import types từ file types/index.ts

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isLoading, setIsLoading] = useState(false);

    const columns = [
        { key: 'licensePlate', title: 'License Plate' },
        {
            key: 'capacity',
            title: 'Capacity',
            render: (capacity: VehicleCapacity) => {
                const [type, seats] = capacity.split('-');
                return `${type} (${seats} seats)`;
            }
        },
    ];

    const fetchVehicles = async () => {
        try {
            setIsLoading(true);
            const data = await VehicleService.getVehicles();
            setVehicles(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to fetch vehicles');
            console.error(error);
            setVehicles([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleAdd = () => {
        setEditingVehicle(null);
        setIsModalOpen(true);
    };

    const handleEdit = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setIsModalOpen(true);
    };

    const handleDelete = async (vehicle: Vehicle) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                setIsLoading(true);
                await VehicleService.deleteVehicle(vehicle.id);
                toast.success('Vehicle deleted successfully');
                await fetchVehicles();
            } catch (error) {
                toast.error('Failed to delete vehicle');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSubmit = async (formData: Partial<Vehicle>) => {
        try {
            setIsLoading(true);
            if (editingVehicle) {
                await VehicleService.updateVehicle(editingVehicle.id, formData);
                toast.success('Vehicle updated successfully');
            } else {
                await VehicleService.createVehicle(formData);
                toast.success('Vehicle created successfully');
            }
            await fetchVehicles();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(editingVehicle ? 'Failed to update vehicle' : 'Failed to create vehicle');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const paginatedVehicles = vehicles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(vehicles.length / itemsPerPage);

    return (
        <>
            <PageHeader
                title="Vehicles"
                subtitle="Manage your vehicles"
                actions={
                    <Button
                        variant="primary"
                        icon={<FaPlus />}
                        onClick={handleAdd}
                        disabled={isLoading}
                    >
                        Add Vehicle
                    </Button>
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
                        data={paginatedVehicles}
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

            <VehicleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                vehicle={editingVehicle}
                isLoading={isLoading}
            />
        </>
    );
};

interface VehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Vehicle>) => void;
    vehicle: Vehicle | null;
    isLoading: boolean;
}

const VehicleModal: React.FC<VehicleModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    vehicle,
    isLoading,
}) => {
    const [formData, setFormData] = useState<Partial<Vehicle>>(
        vehicle || { licensePlate: '', capacity: 'Standard-34' }
    );

    const [licenseError, setLicenseError] = useState('');

    React.useEffect(() => {
        if (vehicle) {
            setFormData(vehicle);
        } else {
            setFormData({ licensePlate: '', capacity: 'Standard-34' });
        }
        setLicenseError('');
    }, [vehicle]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateLicensePlate(formData.licensePlate || '')) {
            setLicenseError('License plate must match pattern: 29A-12345.12');
            return;
        }
        onSubmit(formData);
    };

    const validateLicensePlate = (value: string) => {
        // Pattern: 29A-12345.12 hoặc 29A-1234
        return /^\d{2}[A-Z]-\d{4,5}(\.\d{2})?$/.test(value);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={vehicle ? 'Edit Vehicle' : 'Add Vehicle'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            License Plate
                        </label>
                        <input
                            type="text"
                            className={`w-full px-4 py-2 border ${licenseError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                            value={formData.licensePlate}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase();
                                setFormData({ ...formData, licensePlate: value });
                                if (validateLicensePlate(value)) {
                                    setLicenseError('');
                                }
                            }}
                            placeholder="Example: 29A-12345.12"
                            required
                            disabled={isLoading}
                        />
                        {licenseError ? (
                            <p className="mt-1 text-sm text-red-500">
                                {licenseError}
                            </p>
                        ) : (
                            <p className="mt-1 text-sm text-gray-500">
                                Format: 29A-12345.12 or 29A-1234
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Capacity
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value as VehicleCapacity })}
                            required
                            disabled={isLoading}
                        >
                            <option value="Standard-34">Standard - 34 seats</option>
                            <option value="VIP-20">VIP - 20 seats</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 flex items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {vehicle ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            vehicle ? 'Update' : 'Create'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default VehiclesPage; 