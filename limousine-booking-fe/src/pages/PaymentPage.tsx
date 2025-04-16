import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaStickyNote, FaUniversity, FaCopy, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { FaClockRotateLeft } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import { toast } from 'react-hot-toast';

interface PaymentData {
    tripId: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    selectedSeats: string[];
    selectedSubOrigin: { id: string, name: string, address: string };
    selectedSubDestination: { id: string, name: string, address: string };
    info: {
        fullName: string;
        phone: string;
        email: string;
        note: string;
    }
}

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bank' | null>(null);
    const [showCopied, setShowCopied] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const paymentData = location.state as PaymentData;
    console.log(location);

    useEffect(() => {
        if (!paymentData) {
            navigate('/booking');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate, paymentData]);

    // Add effect to control body overflow
    useEffect(() => {
        if (showConfirmModal || showSuccessModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showConfirmModal, showSuccessModal]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    const handlePaymentSubmit = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmPayment = async () => {
        const res = await bookingService.createBooking({
            fullName: paymentData.info.fullName,
            phoneNumber: paymentData.info.phone,
            email: paymentData.info.email,
            note: paymentData.info.note,
            seatNumbers: paymentData.selectedSeats,
            tripId: paymentData.tripId,
            subOriginId: paymentData.selectedSubOrigin.id,
            subDestinationId: paymentData.selectedSubDestination.id
        });

        if (!res.success) {
            toast.error(res?.message);
            setShowConfirmModal(false);
            return;
        }

        setShowConfirmModal(false);
        setShowSuccessModal(true);
        return;
    };

    const handleViewTicketDetails = () => {
        // Navigate to the ticket details page (you may need to adjust the path)
        navigate(`/my-booking`);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const totalPrice = paymentData.price * paymentData.selectedSeats.length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Payment Timer */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-red-700">Thời gian thanh toán còn lại</h3>
                            <p className="text-2xl font-bold text-red-600 mt-1">{formatTime(timeLeft)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-red-600">Vui lòng hoàn tất thanh toán</p>
                            <p className="text-sm text-red-600">trước khi hết thời gian</p>
                        </div>
                    </div>
                </div>

                {/* Trip Information */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin chuyến đi</h2>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left side - Trip Details */}
                        <div className="flex-1">
                            <div className="flex flex-col items-center">
                                {/* Times and Locations Row */}
                                <div className="flex items-center gap-4 w-full">
                                    {/* Departure */}
                                    <div className="flex-1 text-center">
                                        <p className="text-2xl font-bold text-cyan-500">{new Date(paymentData.departureTime).toLocaleString()}</p>
                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            <FaMapMarkerAlt className="text-cyan-500" />
                                            <p className="font-medium">{paymentData.origin}</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2 mb-2">
                                            <FaInfoCircle className="text-cyan-500" />
                                            <p><span className="font-bold">Điểm đón:</span> {paymentData.selectedSubOrigin.name}, {paymentData.selectedSubOrigin.address}</p>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex-shrink-0">
                                        <FaClock className="text-cyan-500 text-xl" />
                                    </div>

                                    {/* Arrival */}
                                    <div className="flex-1 text-center">
                                        <p className="text-2xl font-bold text-cyan-500">{new Date(paymentData.arrivalTime).toLocaleString()}</p>
                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            <FaMapMarkerAlt className="text-cyan-500" />
                                            <p className="font-medium">{paymentData.destination}</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2 mb-2">
                                            <FaInfoCircle className="text-cyan-500" />
                                            <p><span className="font-bold">Điểm trả:</span> {paymentData.selectedSubDestination.name}, {paymentData.selectedSubDestination.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Date and Duration */}
                                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <FaCalendarAlt />
                                        <span>{new Date(paymentData.departureTime).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaClock />
                                        <span>~{Math.round((new Date(paymentData.arrivalTime).getTime() - new Date(paymentData.departureTime).getTime()) / (1000 * 60 * 60))} giờ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Information */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin người đi</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            <span>{paymentData.info.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaPhone className="text-gray-400" />
                            <span>{paymentData.info.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" />
                            <span>{paymentData.info.email}</span>
                        </div>
                        {paymentData.info.note && (
                            <div className="flex items-start gap-2">
                                <FaStickyNote className="text-gray-400 mt-1" />
                                <span>{paymentData.info.note}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Tổng kết thanh toán</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Số ghế đã chọn</span>
                            <span className="font-semibold">{paymentData.selectedSeats.length} ghế</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Giá mỗi ghế</span>
                            <span className="font-semibold">{Math.floor(paymentData.price).toLocaleString('vi-VN')} VND</span>
                        </div>
                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">Tổng tiền</span>
                                <span className="text-2xl font-bold text-cyan-500">{totalPrice.toLocaleString('vi-VN')} VND</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn hình thức thanh toán</h2>
                    <div className="space-y-4">
                        {/* Bank Transfer Option */}
                        <div
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'bank'
                                ? 'border-cyan-500 bg-cyan-50'
                                : 'border-gray-200 hover:border-cyan-500'
                                }`}
                            onClick={() => setSelectedPaymentMethod('bank')}
                        >
                            <div className="flex items-center gap-3">
                                <FaUniversity className="text-2xl text-cyan-500" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Chuyển khoản ngân hàng</h3>
                                    <p className="text-sm text-gray-500">Thanh toán qua chuyển khoản ngân hàng</p>
                                </div>
                            </div>
                        </div>

                        {/* Bank Transfer Information */}
                        {selectedPaymentMethod === 'bank' && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-4">Thông tin chuyển khoản</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Ngân hàng:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">Vietcombank</span>
                                            <button
                                                onClick={() => handleCopyToClipboard('Vietcombank')}
                                                className="text-cyan-500 hover:text-cyan-600"
                                            >
                                                <FaCopy />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Số tài khoản:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">1234567890</span>
                                            <button
                                                onClick={() => handleCopyToClipboard('1234567890')}
                                                className="text-cyan-500 hover:text-cyan-600"
                                            >
                                                <FaCopy />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Chủ tài khoản:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">NGUYEN VAN A</span>
                                            <button
                                                onClick={() => handleCopyToClipboard('NGUYEN VAN A')}
                                                className="text-cyan-500 hover:text-cyan-600"
                                            >
                                                <FaCopy />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Nội dung chuyển khoản:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">DATVE {paymentData.info.phone}</span>
                                            <button
                                                onClick={() => handleCopyToClipboard(`DATVE ${paymentData.info.phone}`)}
                                                className="text-cyan-500 hover:text-cyan-600"
                                            >
                                                <FaCopy />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {showCopied && (
                                    <p className="text-sm text-green-600 mt-2">Đã sao chép vào clipboard!</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handlePaymentSubmit}
                        disabled={!selectedPaymentMethod}
                        className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Thanh toán
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-white/50"></div>
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl relative z-10">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Xác nhận thanh toán</h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn thanh toán {totalPrice.toLocaleString('vi-VN')} VND cho chuyến đi này?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmPayment}
                                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-white/50"></div>
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center shadow-xl relative z-10">
                        <div className="flex justify-center mb-4">
                            <FaCheckCircle className="text-6xl text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thanh toán thành công!</h3>
                        <p className="text-gray-600 mb-6">
                            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleViewTicketDetails}
                                className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                            >
                                Xem thông tin vé
                            </button>
                            <button
                                onClick={handleGoHome}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage; 