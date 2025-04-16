import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaBars, FaBell, FaUser, FaSignOutAlt, FaUserCog } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { user, logout } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await logout();
            // Navigation will be handled by AuthContext
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out`}>
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'
                }`}>
                {/* Top Navigation */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100"
                        >
                            <FaBars className="w-6 h-6" />
                        </button>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 relative">
                                <FaBell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100">
                                <IoMdSettings className="w-5 h-5" />
                            </button>

                            {/* User Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white">
                                        <FaUser className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {user?.email || 'User'}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <p className="text-sm text-gray-600">Signed in as</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {user?.email}
                                            </p>
                                        </div>

                                        <a
                                            href="#"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <FaUserCog className="w-4 h-4 mr-3" />
                                            Profile Settings
                                        </a>

                                        <button
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                                        >
                                            {isLoggingOut ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 mr-3" viewBox="0 0 24 24">
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            fill="none"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    <span>Signing out...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FaSignOutAlt className="w-4 h-4 mr-3" />
                                                    Sign Out
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 