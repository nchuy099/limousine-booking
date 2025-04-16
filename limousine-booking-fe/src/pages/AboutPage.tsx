import {
    FaCar,
    FaUsers,
    FaClipboardList,
    FaUserTie,
    FaMapMarkedAlt,
    FaWifi,
    FaUtensils,
    FaTv,
    FaSnowflake,
    FaWater,
    FaClock,
    FaPhoneAlt,
    FaCheckCircle
} from 'react-icons/fa';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Giới Thiệu Về Chúng Tôi
                    </h1>
                    <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
                </div>

                {/* Introduction Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-cyan-100 rounded-full">
                            <FaCar className="text-3xl text-cyan-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Nhà Xe Limo</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Chúng tôi là một trong những nhà cung cấp dịch vụ vận chuyển limousine hàng đầu, cam kết mang đến cho khách hàng những trải nghiệm sang trọng và thoải mái nhất. Với đội ngũ tài xế chuyên nghiệp và các loại xe hiện đại, chúng tôi tự hào phục vụ khách hàng trên mọi hành trình.
                    </p>
                </div>

                {/* Vehicle Types Section - Updated */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <FaUsers className="text-3xl text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Loại Xe Sử Dụng</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 border border-gray-200 rounded-lg hover:border-purple-500 transition-colors">
                            <FaUsers className="text-3xl text-purple-500 mb-3" />
                            <h3 className="text-xl font-semibold mb-3">Xe Thường 36 Chỗ</h3>
                            <p className="text-gray-600">
                                Xe giường nằm cao cấp 36 chỗ, thiết kế thoải mái với:
                            </p>
                            <ul className="mt-3 space-y-2 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    Ghế nằm rộng rãi
                                </li>
                                <li className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    Điều hòa tiêu chuẩn
                                </li>
                                <li className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    Nước uống miễn phí
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 border border-gray-200 rounded-lg hover:border-purple-500 transition-colors">
                            <FaCar className="text-3xl text-purple-500 mb-3" />
                            <h3 className="text-xl font-semibold mb-3">Xe VIP 20 Chỗ</h3>
                            <p className="text-gray-600">
                                Xe VIP cao cấp 20 chỗ với tiện nghi đẳng cấp:
                            </p>
                            <ul className="mt-3 space-y-2 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    Ghế massage cao cấp
                                </li>
                                <li className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    Điều hòa riêng từng ghế
                                </li>
                                <li className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    Wifi tốc độ cao
                                </li>
                                <li className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    Đồ ăn nhẹ & nước uống
                                </li>
                                <li className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    Màn hình giải trí riêng
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <FaClipboardList className="text-3xl text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Tiện Nghi & Dịch Vụ</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                            <FaWifi className="text-xl text-blue-500" />
                            <span className="text-gray-700">Wifi miễn phí</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                            <FaUtensils className="text-xl text-blue-500" />
                            <span className="text-gray-700">Đồ ăn & nước uống</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                            <FaTv className="text-xl text-blue-500" />
                            <span className="text-gray-700">Màn hình giải trí</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                            <FaSnowflake className="text-xl text-blue-500" />
                            <span className="text-gray-700">Điều hòa riêng</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                            <FaWater className="text-xl text-blue-500" />
                            <span className="text-gray-700">Khăn lạnh miễn phí</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                            <FaMapMarkedAlt className="text-xl text-blue-500" />
                            <span className="text-gray-700">Đón/trả tận nơi</span>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-green-100 rounded-full">
                            <FaUserTie className="text-3xl text-green-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Đội Ngũ Tài Xế</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-green-100 rounded-full">
                                <FaCheckCircle className="text-xl text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Chuyên Nghiệp</h3>
                                <p className="text-gray-600">Đội ngũ tài xế được đào tạo bài bản, có nhiều năm kinh nghiệm</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-green-100 rounded-full">
                                <FaClock className="text-xl text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Đúng Giờ</h3>
                                <p className="text-gray-600">Luôn đảm bảo đón và trả khách đúng giờ, tôn trọng thời gian của quý khách</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service Process Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-orange-100 rounded-full">
                            <FaClipboardList className="text-3xl text-orange-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Quy Trình Đặt Xe</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-orange-600">1</span>
                            </div>
                            <h3 className="font-semibold mb-2">Đặt Chỗ</h3>
                            <p className="text-gray-600 text-sm">Đặt chỗ qua website hoặc điện thoại</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-orange-600">2</span>
                            </div>
                            <h3 className="font-semibold mb-2">Xác Nhận</h3>
                            <p className="text-gray-600 text-sm">Nhận xác nhận và thông tin chi tiết</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-orange-600">3</span>
                            </div>
                            <h3 className="font-semibold mb-2">Đón Khách</h3>
                            <p className="text-gray-600 text-sm">Tài xế đón khách đúng giờ</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-orange-600">4</span>
                            </div>
                            <h3 className="font-semibold mb-2">Di Chuyển</h3>
                            <p className="text-gray-600 text-sm">Tận hưởng chuyến đi an toàn</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage; 