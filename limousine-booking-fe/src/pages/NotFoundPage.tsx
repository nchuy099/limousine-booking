import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-cyan-500">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mt-4">Không tìm thấy trang</h2>
                <p className="text-gray-500 mt-2">Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-8 flex items-center justify-center mx-auto px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                    <FaHome className="mr-2" />
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage; 