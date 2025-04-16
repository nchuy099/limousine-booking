import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { Location } from '../types';
import Button from '../components/common/Button';
import { FaPlus } from 'react-icons/fa';
import { LocationService } from '../services';
import { toast } from 'react-toastify';

const LocationsPage = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isLoading, setIsLoading] = useState(false);

    const columns = [
        { key: 'name', title: 'Name' },
        { key: 'code', title: 'Code' },
    ];

    const handleAdd = () => {
        setEditingLocation(null);
        setIsModalOpen(true);
    };

    const handleEdit = (location: Location) => {
        setEditingLocation(location);
        setIsModalOpen(true);
    };

    const handleDelete = async (location: Location) => {
        if (window.confirm('Are you sure you want to delete this location?')) {
            try {
                setIsLoading(true);
                await LocationService.deleteLocation(location.id);
                toast.success('Location deleted successfully');
                await fetchLocations(); // Refresh list
            } catch (error) {
                toast.error('Failed to delete location');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const fetchLocations = async () => {
        try {
            setIsLoading(true);
            const data = await LocationService.getLocations();
            setLocations(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to fetch locations');
            console.error(error);
            setLocations([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (formData: Partial<Location>) => {
        try {
            setIsLoading(true);
            if (editingLocation) {
                // Update existing location
                await LocationService.updateLocation(editingLocation.id, formData);
                toast.success('Location updated successfully');
            } else {
                // Create new location
                await LocationService.createLocation(formData);
                toast.success('Location created successfully');
            }
            await fetchLocations(); // Refresh list
            setIsModalOpen(false);
        } catch (error) {
            toast.error(editingLocation ? 'Failed to update location' : 'Failed to create location');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const filteredLocations = Array.isArray(locations) ? locations.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const paginatedLocations = filteredLocations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);

    return (
        <>
            <PageHeader
                title="Locations"
                subtitle="Manage your location points"
                actions={
                    <Button
                        variant="primary"
                        icon={<FaPlus />}
                        onClick={handleAdd}
                        disabled={isLoading}
                    >
                        Add Location
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
                        data={paginatedLocations}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </Card>

            <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${currentPage === i + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <LocationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                location={editingLocation}
                isLoading={isLoading}
            />
        </>
    );
};

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Location>) => void;
    location: Location | null;
    isLoading: boolean;
}

const LocationModal: React.FC<LocationModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    location,
    isLoading
}) => {
    const [formData, setFormData] = useState<Partial<Location>>(
        location || { name: '', code: '' }
    );

    React.useEffect(() => {
        if (location) {
            setFormData(location);
        } else {
            setFormData({ name: '', code: '' });
        }
    }, [location]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={location ? 'Edit Location' : 'Add Location'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter location name"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Code
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="Enter location code"
                            required
                            disabled={isLoading}
                        />
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
                                {location ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            location ? 'Update' : 'Create'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default LocationsPage; 