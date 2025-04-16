import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdDirectionsCar } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(credentials.email, credentials.password);
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-700">
            <div className="max-w-md w-full mx-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8">
                {/* Logo và Title */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <div className="bg-cyan-600 text-white p-4 rounded-full shadow-lg">
                            <MdDirectionsCar className="text-4xl" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-gray-600">
                        Please sign in to your account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 ml-1">
                                Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors duration-200" />
                                </div>
                                <input
                                    type="email"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                                             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                                             transition-all duration-200 ease-in-out
                                             hover:border-gray-400"
                                    placeholder="Enter your email"
                                    value={credentials.email}
                                    onChange={(e) =>
                                        setCredentials({ ...credentials, email: e.target.value })
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors duration-200" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl
                                             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                                             transition-all duration-200 ease-in-out
                                             hover:border-gray-400"
                                    placeholder="Enter your password"
                                    value={credentials.password}
                                    onChange={(e) =>
                                        setCredentials({ ...credentials, password: e.target.value })
                                    }
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Remember me & Forgot password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded
                                         transition-all duration-200 ease-in-out
                                         cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-cyan-600 hover:text-cyan-500 
                                                transition-colors duration-200">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 border border-transparent rounded-xl
                                 text-white bg-gradient-to-r from-cyan-500 to-cyan-600
                                 hover:from-cyan-600 hover:to-cyan-700
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500
                                 font-medium shadow-lg
                                 transform transition-all duration-200 ease-in-out
                                 hover:scale-[1.02] active:scale-[0.98]
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign in</span>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="#" className="font-medium text-cyan-600 hover:text-cyan-500 
                                           transition-colors duration-200">
                            Contact administrator
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login; 