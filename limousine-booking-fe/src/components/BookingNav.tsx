import { FaArrowLeft } from "react-icons/fa";

interface BookingNavProps {
    onBack?: () => void;
    onContinue: () => void;
    totalPrice: number;
    disableContinue?: boolean;
}

const BookingNav = ({ onBack, onContinue, totalPrice, disableContinue }: BookingNavProps) => {
    return (
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
            {/* Left side - Back button or empty div for spacing */}
            <div>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FaArrowLeft />
                        <span>Quay lại</span>
                    </button>
                )}
            </div>

            {/* Right side - Always aligned to the right */}
            <div className="flex items-center gap-6 ml-auto">
                <div className="text-right">
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="text-2xl font-bold text-cyan-500">{Math.floor(totalPrice).toLocaleString('vi-VN')} VND</p>
                </div>
                <button
                    onClick={onContinue}
                    disabled={disableContinue}
                    className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
};

export default BookingNav;