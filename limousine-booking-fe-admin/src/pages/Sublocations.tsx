import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { FaPlus } from 'react-icons/fa';
import { Sublocation, Location } from '../types';
import { SublocationService, LocationService } from '../services';
import { toast } from 'react-toastify';

const SublocationsPage = () => {
    const [sublocations, setSublocations] = useState<Sublocation[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSublocation, setEditingSublocation] = useState<Sublocation | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isLoading, setIsLoading] = useState(false);

    const columns = [
        { key: 'name', title: 'Name' },
        {
            key: 'locationCode',
            title: 'Location',
            render: (code: string) => locations.find(l => l.code === code)?.name || code
        },
        {
            key: 'durationFromLocation',
            title: 'Duration from Location',
            dataIndex: 'durationFromLocation',
            render: (value: number) => formatDuration(value),
        },
        { key: 'address', title: 'Address' },
    ];

    function formatDuration(minutes: number) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h > 0 && m > 0) return `${h}h${m}`;
        if (h > 0) return `${h}h`;
        return `${m}m`;
    }

    const fetchLocations = async () => {
        try {
            const data = await LocationService.getLocations();
            setLocations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch locations:', error);
            setLocations([]);
        }
    };

    const fetchSublocations = async () => {
        try {
            setIsLoading(true);
            const data = await SublocationService.getSublocations();
            setSublocations(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to fetch sublocations');
            console.error(error);
            setSublocations([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
        fetchSublocations();
    }, []);

    const handleAdd = () => {
        setEditingSublocation(null);
        setIsModalOpen(true);
    };

    const handleEdit = (sublocation: Sublocation) => {
        setEditingSublocation(sublocation);
        setIsModalOpen(true);
    };

    const handleDelete = async (sublocation: Sublocation) => {
        if (window.confirm('Are you sure you want to delete this sublocation?')) {
            try {
                setIsLoading(true);
                await SublocationService.deleteSublocation(sublocation.id);
                toast.success('Sublocation deleted successfully');
                await fetchSublocations();
            } catch (error) {
                toast.error('Failed to delete sublocation');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSubmit = async (formData: Partial<Sublocation>) => {
        try {
            setIsLoading(true);
            if (editingSublocation) {
                await SublocationService.updateSublocation(editingSublocation.id, formData);
                toast.success('Sublocation updated successfully');
            } else {
                await SublocationService.createSublocation(formData);
                toast.success('Sublocation created successfully');
            }
            await fetchSublocations();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(editingSublocation ? 'Failed to update sublocation' : 'Failed to create sublocation');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const paginatedSublocations = sublocations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sublocations.length / itemsPerPage);

    return (
        <>
            <PageHeader
                title="Sublocations"
                subtitle="Manage your sublocation points"
                actions={
                    <Button
                        variant="primary"
                        icon={<FaPlus />}
                        onClick={handleAdd}
                        disabled={isLoading}
                    >
                        Add Sublocation
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
                        data={paginatedSublocations}
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

            <SublocationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                sublocation={editingSublocation}
                locations={locations}
                isLoading={isLoading}
            />
        </>
    );
};

interface SublocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Sublocation>) => void;
    sublocation: Sublocation | null;
    locations: Location[];
    isLoading: boolean;
}

const SublocationModal: React.FC<SublocationModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    sublocation,
    locations,
    isLoading,
}) => {
    const [formData, setFormData] = useState<Partial<Sublocation>>(
        sublocation || { name: '', locationCode: '', address: '', durationFromLocation: 0 }
    );

    React.useEffect(() => {
        if (sublocation) {
            setFormData(sublocation);
        } else {
            setFormData({ name: '', locationCode: '', address: '', durationFromLocation: 0 });
        }
    }, [sublocation]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={sublocation ? 'Edit Sublocation' : 'Add Sublocation'}
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
                            placeholder="Enter sublocation name"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            value={formData.locationCode}
                            onChange={(e) => setFormData({ ...formData, locationCode: e.target.value })}
                            required
                            disabled={isLoading}
                        >
                            <option value="">Select a location</option>
                            {locations.map(location => (
                                <option key={location.code} value={location.code}>
                                    {location.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration from Location (minutes)
                        </label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            value={formData.durationFromLocation}
                            onChange={(e) => setFormData({ ...formData, durationFromLocation: Number(e.target.value) })}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Enter address"
                            rows={3}
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
                                {sublocation ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            sublocation ? 'Update' : 'Create'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SublocationsPage; 