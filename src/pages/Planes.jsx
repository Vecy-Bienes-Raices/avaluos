import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import PricingCards from '../components/PricingCards';
import Footer from '../components/VecyPhoenix/Footer';

import { initiateCheckout } from '../services/epaycoService';

const Planes = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const bgClass = theme === 'coffee' ? 'bg-[#423229]' : 'bg-[#0f0f0f]';
    const bgStyle = theme === 'coffee'
        ? { backgroundImage: 'radial-gradient(circle at center, #7D6B65 0%, #4E3D32 40%, #423229 100%)' }
        : { background: '#0f0f0f' };

    const handlePlanSelect = (planId) => {
        if (planId === 'free') {
            navigate('/');
        } else {
            initiateCheckout({ id: planId });
        }
    };

    return (
        <div className={`min-h-screen w-full flex flex-col items-center justify-center p-6 text-stone-200 transition-colors duration-500 ${bgClass}`} style={bgStyle}>
            {/* Header / Back Button */}
            <div className="absolute top-8 left-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-bold backdrop-blur-md group mb-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    Volver con JanIA
                </button>
            </div>

            <div className="max-w-5xl w-full text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700 mt-20 md:mt-0">
                <h1 className="text-3xl md:text-5xl font-bold font-outfit bg-gradient-to-r from-brand-accent via-white to-brand-accent bg-clip-text text-transparent mb-4 pb-2">
                    Selecciona tu nivel de inteligencia
                </h1>
                <p className="text-lg text-stone-300 font-light max-w-2xl mx-auto">
                    Elige el plan que mejor se adapte a tus necesidades de análisis inmobiliario.
                </p>
            </div>

            <div className="w-full animate-in fade-in zoom-in-95 duration-500 delay-200">
                <PricingCards onSelect={handlePlanSelect} />
            </div>

            {/* Footer */}
            <div className="w-full mt-8">
                <Footer />
            </div>
        </div>
    );
};

export default Planes;
