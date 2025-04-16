import React, { useState, useEffect } from 'react';
import { Trip, Vehicle, Location } from '../types';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Đăng ký các components của ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const DashboardPage = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedTimeRange, setSelectedTimeRange] = useState('week');

    useEffect(() => {
        // Fetch data from API
        const fetchData = async () => {
            // const tripsResponse = await api.getTrips();
            // const vehiclesResponse = await api.getVehicles();
            // const locationsResponse = await api.getLocations();
            // setTrips(tripsResponse.data);
            // setVehicles(vehiclesResponse.data);
            // setLocations(locationsResponse.data);
        };
        fetchData();
    }, []);

    // Tính toán các thống kê tổng quan
    const stats = {
        totalTrips: trips.length,
        completedTrips: trips.filter(t => t.status === 'COMPLETED').length,
        activeVehicles: vehicles.length,
        totalRevenue: trips
            .filter(t => t.status === 'COMPLETED')
            .reduce((sum, trip) => sum + trip.price, 0),
    };

    // Data cho biểu đồ doanh thu theo thời gian
    const revenueChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Revenue',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    // Data cho biểu đồ số chuyến xe theo trạng thái
    const tripStatusChartData = {
        labels: ['Pending', 'Ongoing', 'Completed', 'Cancelled'],
        datasets: [
            {
                data: [
                    trips.filter(t => t.status === 'SCHEDULED').length,
                    trips.filter(t => t.status === 'ONGOING').length,
                    trips.filter(t => t.status === 'COMPLETED').length,
                    trips.filter(t => t.status === 'CANCELLED').length,
                ],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                ],
            },
        ],
    };

    // Data cho biểu đồ top tuyến đường phổ biến
    const popularRoutesData = {
        labels: ['Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5'],
        datasets: [
            {
                label: 'Number of Trips',
                data: [65, 59, 80, 81, 56],
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Header với filter thời gian */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <select
                    className="p-2 border rounded"
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="year">Last 12 months</option>
                </select>
            </div>

            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Trips</h3>
                    <p className="text-2xl font-bold">{stats.totalTrips}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Completed Trips</h3>
                    <p className="text-2xl font-bold">{stats.completedTrips}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Active Vehicles</h3>
                    <p className="text-2xl font-bold">{stats.activeVehicles}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Revenue</h3>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Biểu đồ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Biểu đồ doanh thu */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
                    <Line
                        data={revenueChartData}
                        options={{
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>

                {/* Biểu đồ trạng thái chuyến */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Trip Status Distribution</h2>
                    <Doughnut
                        data={tripStatusChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                            },
                        }}
                    />
                </div>

                {/* Biểu đồ tuyến phổ biến */}
                <div className="bg-white p-6 rounded-lg shadow col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Popular Routes</h2>
                    <Bar
                        data={popularRoutesData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {/* Bảng chuyến xe gần đây */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Recent Trips</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Route
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vehicle
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {trips.slice(0, 5).map((trip) => (
                                <tr key={trip.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {`${locations.find(l => l.code === trip.originLocationCode)?.name} → 
                      ${locations.find(l => l.code === trip.destinationLocationCode)?.name}`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {trip.vehicleLicensePlate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(trip.status)}`}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${trip.price.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Helper function để lấy màu cho status (copy từ Trips page)
const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING':
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

export default DashboardPage; 