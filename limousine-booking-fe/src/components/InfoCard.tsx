import { useState, useEffect } from 'react';
import { FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaStickyNote, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BookingNav from './BookingNav';
import { useAuth } from '../contexts';

interface InfoCardProps {
    tripId: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    type: string;
    selectedSubOrigin: { id: string, name: string, address: string } | null;
    selectedSubDestination: { id: string, name: string, address: string } | null;
    price: number;
    selectedSeats: string[];
    onBack: () => void;
}

const InfoCard = ({
    tripId,
    origin,
    destination,
    departureTime,
    arrivalTime,
    type,
    selectedSubOrigin,
    selectedSubDestination,
    price,
    selectedSeats,
    onBack,
}: InfoCardProps) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        note: '',
    });
    const [errors, setErrors] = useState({
        phone: '',
        email: '',
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.fullName,
                phone: user.phoneNumber,
                email: user.email
            }));
        }
    }, [user]);

    const validatePhone = (phone: string) => {
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        return phoneRegex.test(phone);
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Chỉ cho phép thay đổi note nếu đã đăng nhập
        if (user && name !== 'note') {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate on change
        if (name === 'phone') {
            setErrors(prev => ({
                ...prev,
                phone: validatePhone(value) ? '' : 'Số điện thoại không hợp lệ'
            }));
        } else if (name === 'email') {
            setErrors(prev => ({
                ...prev,
                email: validateEmail(value) ? '' : 'Email không hợp lệ'
            }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            setErrors(prev => ({
                ...prev,
                phone: validatePhone(value) ? '' : 'Số điện thoại không hợp lệ'
            }));
        } else if (name === 'email') {
            setErrors(prev => ({
                ...prev,
                email: validateEmail(value) ? '' : 'Email không hợp lệ'
            }));
        }
    };

    const handleContinue = () => {
        // Validate before continuing
        const phoneValid = validatePhone(formData.phone);
        const emailValid = validateEmail(formData.email);

        setErrors({
            phone: phoneValid ? '' : 'Số điện thoại không hợp lệ',
            email: emailValid ? '' : 'Email không hợp lệ'
        });

        if (!phoneValid || !emailValid) {
            return;
        }

        navigate('/payment', {
            state: {
                tripId,
                origin,
                destination,
                departureTime,
                arrivalTime,
                type,
                selectedSubOrigin,
                selectedSubDestination,
                price,
                selectedSeats,
                info: formData,
            }
        });
    };

    const totalPrice = price * selectedSeats.length;
    const isFormValid = formData.fullName && formData.phone && formData.email && !errors.phone && !errors.email;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">1</div>
                    <div className="text-gray-500">Chọn chỗ</div>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">2</div>
                    <div className="text-gray-500">Điểm đón/trả</div>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">3</div>
                    <div className="text-cyan-500 font-semibold">Nhập thông tin</div>
                </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${user ? 'bg-gray-50 text-gray-500' : ''}`}
                            placeholder="Nhập họ và tên"
                            disabled={!!user}
                        />
                    </div>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaPhone className="text-gray-400" />
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className={`block w-full pl-10 pr-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${user ? 'bg-gray-50 text-gray-500' : ''}`}
                            placeholder="Nhập số điện thoại"
                            disabled={!!user}
                        />
                    </div>
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <FaExclamationCircle className="mr-1" />
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${user ? 'bg-gray-50 text-gray-500' : ''}`}
                            placeholder="Nhập email"
                            disabled={!!user}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <FaExclamationCircle className="mr-1" />
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Note */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú
                    </label>
                    <div className="relative">
                        <div className="absolute top-3 left-3 text-gray-400">
                            <FaStickyNote />
                        </div>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            rows={3}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="Nhập ghi chú (nếu có)"
                        />
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center text-lg font-medium">
                    <span>Tổng tiền:</span>
                    <span className="text-cyan-600">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
            </div>

            {/* Navigation */}
            <BookingNav
                onBack={onBack}
                onContinue={handleContinue}
                totalPrice={totalPrice}
                disableContinue={!isFormValid}
            />
        </div>
    );
};

export default InfoCard;