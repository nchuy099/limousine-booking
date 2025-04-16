import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts';
import Avatar from '../Avatar';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleSignIn = () => {
        navigate('/login');
        setIsOpen(false);
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-cyan-600">
                            Limousine
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-cyan-600">
                            Trang chủ
                        </Link>
                        <Link to="/booking" className="text-gray-700 hover:text-cyan-600">
                            Đặt xe
                        </Link>
                        <Link to="/lookup" className="text-gray-700 hover:text-cyan-600">
                            Tra cứu vé
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-cyan-600">
                            Về chúng tôi
                        </Link>

                        {isAuthenticated ? (
                            <Avatar />
                        ) : (
                            <button
                                onClick={handleSignIn}
                                className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            >
                                Đăng nhập
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-cyan-600 focus:outline-none"
                        >
                            {isOpen ? (
                                <FaTimes className="h-6 w-6" />
                            ) : (
                                <FaBars className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                        >
                            Trang chủ
                        </Link>
                        <Link
                            to="/booking"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                        >
                            Đặt xe
                        </Link>
                        <Link
                            to="/lookup"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                        >
                            Tra cứu vé
                        </Link>
                        <Link
                            to="/about"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                        >
                            Về chúng tôi
                        </Link>

                        {isAuthenticated ? (
                            <div className="px-3 py-2">
                                <Avatar />
                            </div>
                        ) : (
                            <div className="px-3 py-2">
                                <button
                                    onClick={handleSignIn}
                                    className="w-full px-4 py-2 text-base font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 