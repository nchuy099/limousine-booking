import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import { authService } from '../services';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(location.state?.phoneNumber || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Validate terms agreement
        if (!agreeToTerms) {
            toast.error('Vui lòng đồng ý với điều khoản và điều kiện!');
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        try {
            setIsLoading(true);
            const userData = {
                fullName,
                email,
                phoneNumber,
                password
            };

            await authService.register(userData);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (error: any) {
            console.error('Đăng ký thất bại:', error);
            toast.error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Đăng ký tài khoản
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Vui lòng nhập thông tin của bạn
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="h-5 w-5 text-cyan-500" />
                            </div>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                placeholder="Họ và tên"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={isLoading}
                                title="Nhập họ và tên đầy đủ của bạn"
                            />
                        </div>

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
                                title="Nhập địa chỉ email hợp lệ"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaPhone className="h-5 w-5 text-cyan-500" />
                            </div>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                required
                                className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                placeholder="Số điện thoại"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={!!location.state?.phoneNumber || isLoading}
                                title="Nhập số điện thoại của bạn"
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
                                title="Mật khẩu phải có ít nhất 6 ký tự"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-5 w-5 text-cyan-500" />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                title="Nhập lại mật khẩu để xác nhận"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="agreeToTerms"
                            name="agreeToTerms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            disabled={isLoading}
                            title="Bạn phải đồng ý với điều khoản để tiếp tục"
                        />
                        <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                            Tôi đồng ý với{' '}
                            <a href="#" className="font-medium text-cyan-600 hover:text-cyan-500">
                                điều khoản và điều kiện
                            </a>
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={!agreeToTerms || isLoading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${agreeToTerms && !isLoading
                                ? 'bg-cyan-500 hover:bg-cyan-600 focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
                                : 'bg-gray-400 cursor-not-allowed'
                                } focus:outline-none`}
                            title={!agreeToTerms ? "Bạn phải đồng ý với điều khoản" : "Hoàn tất đăng ký"}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Đã có tài khoản?</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            to="/login"
                            className="w-full inline-flex justify-center py-3 px-4 border border-cyan-500 rounded-lg shadow-sm bg-white text-sm font-medium text-cyan-500 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            title="Chuyển đến trang đăng nhập"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>

            {/* Added footer section */}
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Dịch Vụ Limo. Tất cả quyền được bảo lưu.</p>
                <p className="mt-2">Khi đăng ký, bạn đồng ý với các điều khoản và chính sách bảo mật của chúng tôi.</p>
            </div>
        </div>
    );
};

export default RegisterPage; 