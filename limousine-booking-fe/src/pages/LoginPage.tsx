import { useState } from 'react';
import { FaEnvelope, FaLock, FaArrowLeft, FaUserPlus } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');

        try {
            setIsLoading(true);
            await login(email, password);
            navigate('/');
        } catch (error: any) {
            setError('Email hoặc mật khẩu không chính xác');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <FaArrowLeft className="mr-2" />
                        Quay lại trang chủ
                    </button>

                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đăng nhập
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Vui lòng nhập thông tin đăng nhập của bạn
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="h-5 w-5 text-cyan-500" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-5 w-5 text-cyan-500" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Ghi nhớ đăng nhập
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-cyan-600 hover:text-cyan-500">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${!isLoading
                                ? 'bg-cyan-500 hover:bg-cyan-600 focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
                                : 'bg-gray-400 cursor-not-allowed'
                                } focus:outline-none`}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Bạn chưa có tài khoản?</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            to="/register"
                            className="w-full inline-flex justify-center py-3 px-4 border border-cyan-500 rounded-lg shadow-sm bg-white text-sm font-medium text-cyan-500 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                        >
                            <FaUserPlus className="h-5 w-5 mr-2" />
                            Đăng ký tài khoản mới
                        </Link>
                    </div>
                </div>
            </div>

            {/* Added footer section */}
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Dịch Vụ Limo. Tất cả quyền được bảo lưu.</p>
                <p className="mt-2">Bằng việc đăng nhập, bạn đồng ý với các điều khoản và điều kiện sử dụng của chúng tôi.</p>
            </div>
        </div>
    );
};

export default LoginPage;