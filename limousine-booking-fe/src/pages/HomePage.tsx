import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import BookingCard from '../components/BookingCard';

const HomePage = () => {
    const [showBookingCard, setShowBookingCard] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (searchParams: { origin?: string; destination?: string; departureTime?: string; type?: 'STANDARD' | 'VIP' | '' }) => {
        navigate('/booking', { state: { searchParams } });
    };

    return (
        <>
            <div className="relative">
                <Hero onBookNowClick={() => setShowBookingCard(true)} />
                <div className="container mx-auto px-8">
                    <BookingCard
                        isVisible={showBookingCard}
                        onSearch={handleSearch}
                    />
                </div>
            </div>
            <Features />
        </>
    );
};

export default HomePage;