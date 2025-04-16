import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts';
import { useNavigate } from 'react-router-dom';

const Avatar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleViewTickets = () => {
        setIsOpen(false);
        navigate('/my-booking');
    };

    const handleViewProfile = () => {
        setIsOpen(false);
        navigate('/my-profile');
    };

    return (
        <>
            {/* Desktop View */}
            <div className="relative hidden md:block">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    <FaUser className="w-5 h-5 text-cyan-600" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-200 ease-in-out">
                        <div className="py-1">
                            <button
                                onClick={handleViewProfile}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Hồ sơ
                            </button>
                            <button
                                onClick={handleViewTickets}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Vé của tôi
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    <FaUser className="w-5 h-5 text-cyan-600" />
                </button>

                {isOpen && (
                    <div className="fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black opacity-25" onClick={() => setIsOpen(false)}></div>
                        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl">
                            <div className="py-2">
                                <button
                                    onClick={handleViewProfile}
                                    className="block w-full px-4 py-3 text-left text-base text-gray-700 hover:bg-gray-100"
                                >
                                    Hồ sơ
                                </button>
                                <button
                                    onClick={handleViewTickets}
                                    className="block w-full px-4 py-3 text-left text-base text-gray-700 hover:bg-gray-100"
                                >
                                    Vé của tôi
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full px-4 py-3 text-left text-base text-red-600 hover:bg-gray-100"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Avatar;