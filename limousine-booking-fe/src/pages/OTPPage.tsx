import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const OTPPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const phoneNumber = location.state?.phoneNumber;

    useEffect(() => {
        if (!phoneNumber) {
            navigate('/login');
        }
    }, [phoneNumber, navigate]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multiple digits
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length === 6) {
            // Handle OTP verification logic here
            console.log('Verifying OTP:', otpString);
            // Navigate to register page with phone number
            navigate('/register', { state: { phoneNumber } });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Quay lại
                    </button>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Nhập mã xác thực
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Vui lòng nhập mã 6 chữ số đã được gửi đến số điện thoại
                        <br />
                        <span className="font-medium">{phoneNumber}</span>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="flex justify-center space-x-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                        ))}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={otp.join('').length !== 6}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Xác nhận
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPPage; 