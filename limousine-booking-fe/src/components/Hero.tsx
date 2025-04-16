import { useState, useEffect } from 'react';
import heroImage1 from '../assets/hero_images/fcbayern.jpg';
import heroImage2 from '../assets/hero_images/becca.jpg';
import heroImage3 from '../assets/hero_images/becca.jpg';
import heroImage4 from '../assets/hero_images/augsburg.jpg';
import heroImage5 from '../assets/hero_images/basel.jpg';
import heroImage6 from '../assets/hero_images/unknown.jpg';

const images = [
    {
        url: heroImage1,
        title: "Dịch Vụ Limousine Sang Trọng",
        description: "Trải nghiệm sự thoải mái và phong cách tối ưu với đội xe limousine cao cấp của chúng tôi."
    },
    {
        url: heroImage2,
        title: "Tài Xế Chuyên Nghiệp",
        description: "Tài xế giàu kinh nghiệm của chúng tôi đảm bảo một hành trình an toàn và thoải mái."
    },
    {
        url: heroImage3,
        title: "Dịch Vụ 24/7",
        description: "Luôn sẵn sàng phục vụ bạn mọi lúc, mọi nơi."
    },
    {
        url: heroImage4,
        title: "Đội Xe Cao Cấp",
        description: "Di chuyển với phong cách cùng những chiếc xe hiện đại và sang trọng của chúng tôi."
    },
    {
        url: heroImage5,
        title: "Dịch Vụ Toàn Cầu",
        description: "Chúng tôi cung cấp dịch vụ limousine trên toàn thế giới."
    },
    {
        url: heroImage6,
        title: "Trải Nghiệm Độc Quyền",
        description: "Tận hưởng một hành trình độc đáo và đáng nhớ cùng chúng tôi."
    }
];

interface HeroProps {
    onBookNowClick: () => void;
}

const Hero = ({ onBookNowClick }: HeroProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 8000);

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
            {/* Images */}
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-2000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={image.url}
                        alt={image.title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
                </div>
            ))}

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 drop-shadow-lg">
                    {images[currentIndex].title}
                </h1>
                <p className="text-xl md:text-2xl text-center max-w-2xl mb-8 drop-shadow-lg">
                    {images[currentIndex].description}
                </p>
                {isMobile && (
                    <button
                        onClick={onBookNowClick}
                        className="px-8 py-3 bg-cyan-500 text-white text-lg font-semibold rounded-lg hover:bg-cyan-600 transition-all duration-300 hover:scale-105"
                    >
                        Đặt Ngay
                    </button>
                )}
            </div>
        </div>
    );
};

export default Hero;
