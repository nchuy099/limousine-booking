import { FaClock, FaUserTie, FaCar, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import image1 from '../assets/hero_images/fcbayern.jpg';
import image2 from '../assets/hero_images/becca.jpg';
import image3 from '../assets/hero_images/augsburg.jpg';

const Features = () => {
    const features = [
        {
            icon: <FaClock className="w-6 h-6" />,
            title: "Dịch Vụ 24/7",
            description: "Luôn sẵn sàng phục vụ bạn mọi lúc, mọi nơi. Đặt chỗ bất cứ lúc nào, ở đâu."
        },
        {
            icon: <FaUserTie className="w-6 h-6" />,
            title: "Tài Xế Chuyên Nghiệp",
            description: "Tài xế giàu kinh nghiệm, được đào tạo bài bản và lịch sự để mang đến trải nghiệm cao cấp."
        },
        {
            icon: <FaCar className="w-6 h-6" />,
            title: "Đội Xe Sang Trọng",
            description: "Đa dạng các loại xe cao cấp để đáp ứng mọi nhu cầu và dịp của bạn."
        },
        {
            icon: <FaShieldAlt className="w-6 h-6" />,
            title: "An Toàn Là Trên Hết",
            description: "Bảo trì định kỳ và các quy trình an toàn nghiêm ngặt để bạn yên tâm."
        }
    ];

    const handleBookNow = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Side - Features */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mb-12"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Trải Nghiệm Sang Trọng và Thoải Mái
                            </h2>
                            <p className="text-xl text-gray-600">
                                Chúng tôi tự hào cung cấp dịch vụ limousine xuất sắc với chất lượng và sự chuyên nghiệp không ai sánh kịp.
                            </p>
                        </motion.div>

                        <div className="space-y-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
                                    className="flex items-start group"
                                >
                                    <div className="flex-shrink-0 p-2 rounded-full bg-cyan-50 group-hover:bg-cyan-100 transition-colors">
                                        <div className="text-cyan-500">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            className="mt-12"
                        >
                            <button
                                onClick={handleBookNow}
                                className="bg-cyan-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
                            >
                                Đặt Chỗ Ngay
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Images */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="relative h-[600px]">
                            {/* Main large image */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="absolute top-0 right-0 w-[80%] h-[70%] rounded-lg overflow-hidden"
                            >
                                <img src={image1} alt="Luxury Car 1" className="w-full h-full object-cover" />
                            </motion.div>

                            {/* Bottom left circular image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="absolute bottom-0 left-0 w-[45%] h-[45%] rounded-full overflow-hidden"
                            >
                                <img src={image2} alt="Luxury Car 2" className="w-full h-full object-cover" />
                            </motion.div>

                            {/* Middle triangular/diamond image */}
                            <motion.div
                                initial={{ opacity: 0, rotate: 90 }}
                                whileInView={{ opacity: 1, rotate: 45 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.9 }}
                                className="absolute bottom-[20%] right-[20%] w-[35%] h-[35%] rounded-lg overflow-hidden"
                            >
                                <img
                                    src={image3}
                                    alt="Luxury Car 3"
                                    className="w-[141%] h-[141%] object-cover transform -rotate-45 scale-125"
                                />
                            </motion.div>

                            {/* Decorative circles */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 1 }}
                                className="absolute -top-4 -right-4 w-32 h-32 bg-cyan-50 rounded-full -z-10"
                            />
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 1.2 }}
                                className="absolute bottom-1/4 -left-8 w-24 h-24 bg-cyan-100 rounded-full -z-10"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Features;
