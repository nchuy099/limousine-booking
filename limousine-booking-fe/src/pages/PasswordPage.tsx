import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLock } from 'react-icons/fa';

const PasswordPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState(['', '', '', '', '', '']);
    const [confirmPassword, setConfirmPassword] = useState(['', '', '', '', '', '']);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const userData = location.state?.userData;

    useEffect(() => {
        if (!userData) {
            navigate('/register');
        }
    }, [userData, navigate]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multiple digits
        if (!/^\d*$/.test(value)) return; // Only allow digits

        if (!showConfirm) {
            const newPassword = [...password];
            newPassword[index] = value;
            setPassword(newPassword);

            // Auto-focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            } else if (value && index === 5) {
                setShowConfirm(true);
            }
        } else {
            const newConfirmPassword = [...confirmPassword];
            newConfirmPassword[index] = value;
            setConfirmPassword(newConfirmPassword);

            // Auto-focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !(showConfirm ? confirmPassword[index] : password[index]) && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const passwordString = showConfirm ? confirmPassword.join('') : password.join('');

        if (!showConfirm) {
            setShowConfirm(true);
            setError('');
        } else {
            if (password.join('') !== confirmPassword.join('')) {
                setError('Mật khẩu không khớp');
                return;
            }
            // Handle password setup logic here
            console.log('Setting up password:', passwordString);
            // Navigate to home page after successful password setup
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <button
                        onClick={() => navigate('/register')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Quay lại
                    </button>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        {showConfirm ? 'Xác nhận mật khẩu' : 'Tạo mật khẩu'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {showConfirm
                            ? 'Vui lòng nhập lại mật khẩu 6 chữ số'
                            : 'Vui lòng tạo mật khẩu 6 chữ số cho tài khoản của bạn'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-center space-x-2">
                            {(showConfirm ? confirmPassword : password).map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        if (el) {
                                            inputRefs.current[index] = el;
                                        }
                                    }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            ))}
                        </div>
                        {error && (
                            <p className="mt-4 text-center text-sm text-red-600">
                                {error}
                            </p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={(showConfirm ? confirmPassword : password).join('').length !== 6}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {showConfirm ? 'Xác nhận' : 'Tiếp tục'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordPage; 