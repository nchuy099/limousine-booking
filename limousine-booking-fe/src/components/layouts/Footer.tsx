import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-2xl font-bold text-cyan-500 mb-4">Limo</h3>
                        <p className="text-gray-400 mb-4">
                            Cung cấp dịch vụ vận chuyển sang trọng với phong cách và sự thoải mái.
                            Hành trình của bạn là ưu tiên của chúng tôi.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors">
                                <FaFacebook size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors">
                                <FaTwitter size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors">
                                <FaInstagram size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors">
                                <FaLinkedin size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors">
                                    Về Chúng Tôi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors">
                                    Dịch Vụ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors">
                                    Đội Xe
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors">
                                    Đặt Chỗ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors">
                                    Câu Hỏi Thường Gặp
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Thông Tin Liên Hệ</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3">
                                <MdLocationOn className="text-cyan-500" size={20} />
                                <span className="text-gray-400">123 Phố Sang Trọng, Thành Phố, Quốc Gia</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <MdPhone className="text-cyan-500" size={20} />
                                <span className="text-gray-400">+1 234 567 890</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <MdEmail className="text-cyan-500" size={20} />
                                <span className="text-gray-400">info@limoservice.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Bản Tin</h4>
                        <p className="text-gray-400 mb-4">
                            Đăng ký nhận bản tin của chúng tôi để nhận thông tin cập nhật và ưu đãi đặc biệt.
                        </p>
                        <form className="space-y-2">
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                            >
                                Đăng Ký
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Dịch Vụ Limo. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-cyan-500 text-sm transition-colors">
                                Chính Sách Bảo Mật
                            </a>
                            <a href="#" className="text-gray-400 hover:text-cyan-500 text-sm transition-colors">
                                Điều Khoản Dịch Vụ
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
