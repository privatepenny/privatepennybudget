import { useState, useEffect } from 'react';

const Home = () => {
    const images = [
        { src: '/images/budget.png', alt: 'budget page', label: 'Create a monthly budget!' },
        { src: '/images/transactions.png', alt: 'transaction page', label: 'Track every transaction!' },
        { src: '/images/dashboard.png', alt: 'dashboard page', label: 'View reports on your spending habits!' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative w-full flex justify-center items-center h-[calc(100vh-96px)]">
            <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="w-4/5 h-auto rounded-lg border-4 border-dark1"
            />
            <span
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white py-2 px-4 rounded-lg text-lg text-center"
            >
                {images[currentIndex].label}
            </span>
            <img src='images/logo.png' alt='soldier saluting logo' className='absolute h-52 w-52 bottom-4 -right-20 transform -translate-x-1/2'/>
        </div>
    );
};

export default Home;