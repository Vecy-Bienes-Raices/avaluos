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
        // En Generic Mode, todos los clics llevan al Chat para cotizar
        navigate('/');
    };

    return (
        <div className={`min-h-screen w-full flex flex-col items-center justify-center pt-6 px-6 text-stone-200 transition-colors duration-500 ${bgClass}`} style={bgStyle}>
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
                {/* DISCLAIMER DE PRECIOS GLOBALES */}
                <div className="mt-6 flex justify-center">
                    <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-xl p-4 max-w-2xl flex items-start gap-3 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-gold flex-shrink-0 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                        <p className="text-xs text-stone-300 text-left leading-relaxed">
                            <strong className="text-brand-gold block mb-1">Nota importante sobre costos:</strong>
                            Los precios de los planes <strong>Oro</strong> y <strong>Esmeralda</strong> mostrados son referenciales. El valor final se calcula en tiempo real según las características específicas de cada inmueble (área y complejidad) durante tu conversación con JanIA.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full animate-in fade-in zoom-in-95 duration-500 delay-200">
                <PricingCards onSelect={handlePlanSelect} genericMode={true} filter={['all']} />
            </div>

            {/* VECY NETWORK BUSINESS MODEL SECTION */}
            <div className="w-full max-w-6xl mt-24 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold font-outfit text-brand-gold mb-4 uppercase tracking-widest drop-shadow-md">
                        ¿Quieres que tu avalúo te salga GRATIS? 💸
                    </h2>
                    <p className="text-stone-300 max-w-3xl mx-auto text-sm md:text-base font-light leading-relaxed">
                        Únete a <strong>Vecy Network</strong>. El primer modelo de <em>Real Estate Network Marketing</em> impulsado por IA.
                        Convierte tus contactos en una fuente de ingresos pasivos y recupera tu inversión en tiempo récord.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* CARD 1: COMISIONES DIRECTAS */}
                    <div className="bg-black/40 backdrop-blur-xl border border-brand-gold/30 rounded-2xl p-6 relative overflow-hidden group hover:border-brand-gold/60 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-6xl">💰</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-emerald-400">1.</span> Ganancias Directas
                        </h3>
                        <p className="text-xs text-stone-400 mb-4">Gana dinero de forma inteligente según el estrato del inmueble referido.</p>

                        <div className="space-y-4 font-mono text-[10px]">
                            {/* CAFE */}
                            <div className="space-y-1">
                                <p className="text-brand-gold uppercase font-bold text-[9px]">☕ Plan Café</p>
                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                                    <span className="text-stone-300">Estratos 1-3</span>
                                    <span className="text-emerald-400 font-bold">+ $4.997 COP</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                                    <span className="text-stone-300">Estratos 4-6</span>
                                    <span className="text-emerald-400 font-bold">+ $7.499 COP</span>
                                </div>
                            </div>

                            {/* ESMERALDA */}
                            <div className="space-y-1">
                                <p className="text-emerald-500 uppercase font-bold text-[9px]">💎 Plan Esmeralda</p>
                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                                    <span className="text-stone-300">Estratos 1-3</span>
                                    <span className="text-emerald-400 font-bold">+ $9.997 COP</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                                    <span className="text-stone-300">Estratos 4-6</span>
                                    <span className="text-emerald-400 font-bold">+ $12.499 COP</span>
                                </div>
                            </div>

                            {/* ORO */}
                            <div className="flex justify-between items-center bg-gradient-to-r from-brand-gold/10 to-transparent p-2 rounded-lg border border-brand-gold/20">
                                <span className="text-brand-gold font-bold">👑 Oro King</span>
                                <span className="text-emerald-400 font-bold">10% Neto</span>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: ROI (BREAK-EVEN) */}
                    <div className="bg-gradient-to-br from-brand-gold/10 to-black/60 backdrop-blur-xl border border-brand-gold/50 rounded-2xl p-6 relative overflow-hidden transform md:-translate-y-4 shadow-[0_0_30px_rgba(204,172,78,0.15)]">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="text-6xl">🚀</span>
                        </div>
                        <h3 className="text-xl font-bold text-brand-gold mb-4 flex items-center gap-2">
                            <span className="text-white">2.</span> Autosostenibilidad
                        </h3>
                        <p className="text-xs text-stone-300 mb-6 font-light">
                            ¿Cómo recuperar tu inversión? Si tus amigos compran un Plan Café (Estratos 1-3), solo necesitas:
                        </p>

                        <div className="flex flex-col items-center justify-center gap-2 mb-4">
                            <div className="text-4xl font-bold text-white">6 <span className="text-sm font-normal text-stone-400">AMIGOS</span></div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                            <div className="text-lg font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-4 py-1 rounded-full border border-emerald-500/30">
                                ¡AVALÚO GRATIS!
                            </div>
                        </div>
                        <p className="text-[10px] text-stone-500 text-center italic leading-tight">
                            * 6 Referidos x $4.997 = $29.982<br />
                            (Break-even instantáneo)
                        </p>
                    </div>

                    {/* CARD 3: VECY LEGACY */}
                    <div className="bg-black/40 backdrop-blur-xl border border-brand-gold/30 rounded-2xl p-6 relative overflow-hidden group hover:border-brand-gold/60 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-6xl">💎</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-purple-400">3.</span> Regalías Eternas
                        </h3>
                        <p className="text-xs text-stone-400 mb-4">No es solo recuperar, es construir riqueza. Tu ID de Vecy es vitalicio.</p>

                        <ul className="space-y-3 text-xs text-stone-300">
                            <li className="flex gap-2">
                                <span className="text-brand-gold">✓</span>
                                Sin límites de referidos (Infinito).
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-gold">✓</span>
                                Pagos semanales a tu cuenta.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-gold">✓</span>
                                <span>Ganas incluso si tú <span className="text-white font-bold">NO</span> compras avalúos. Solo necesitas compartir.</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full mt-6 py-2 bg-white/5 hover:bg-brand-gold hover:text-black border border-white/10 rounded-lg transition-all text-xs font-bold uppercase tracking-widest"
                        >
                            Empezar Ahora
                        </button>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Planes;
