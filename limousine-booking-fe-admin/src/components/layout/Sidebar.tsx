import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdLocationOn, MdPlace, MdDirectionsCar } from 'react-icons/md';
import { FaRoute } from 'react-icons/fa';

const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: <MdDashboard size={20} /> },
    { title: 'Locations', path: '/locations', icon: <MdLocationOn size={20} /> },
    { title: 'Sublocations', path: '/sublocations', icon: <MdPlace size={20} /> },
    { title: 'Vehicles', path: '/vehicles', icon: <MdDirectionsCar size={20} /> },
    { title: 'Trips', path: '/trips', icon: <FaRoute size={20} /> },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="w-64 bg-white shadow-lg h-screen">
            <div className="p-4 bg-cyan-600">
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <nav className="mt-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-4 py-3 text-gray-700 hover:bg-cyan-50 ${location.pathname === item.path
                            ? 'bg-cyan-50 text-cyan-600 border-r-4 border-cyan-600'
                            : ''
                            }`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.title}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar; 