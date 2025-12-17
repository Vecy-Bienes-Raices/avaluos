
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCheckCircle, faChartLine } from '@fortawesome/free-solid-svg-icons';

const Hero = ({ data }) => {
    // Helper to format currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(price));
    };

    return (
        <header id="hero" className="relative pt-8 pb-12 px-4">
            <div className="max-w-6xl mx-auto glass-panel bg-gradient-to-br from-white/10 via-white/5 to-transparent border-white/10 p-8 md:p-16 text-center relative overflow-hidden backdrop-blur-3xl shadow-2xl">
                {/* Background Gradients for Depth */}
                {/* Background Gradients for Depth */}
                {/* REMOVED YELLOW GRADIENT AS PER USER REQUEST */}


                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-bold tracking-widest text-stone-100 text-shadow-black uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff22] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff22] shadow-[0_0_8px_#00ff22]"></span>
                        </span>
                        Concepto Técnico de Valoración
                    </div>

                    <h1 className="text-3xl md:text-6xl font-extrabold mb-4 tracking-tight text-brand-accent text-shadow-volcanic drop-shadow-xl leading-tight">
                        {data.tipo_inmueble} {data.ciudad}
                    </h1>

                    <p className="text-stone-200 text-shadow-black text-lg md:text-xl mb-10 font-light flex items-center justify-center gap-2 opacity-90">
                        <FontAwesomeIcon icon={faLocationDot} className="text-brand-accent text-shadow-volcanic" />
                        {data.direccion_inmueble}
                    </p>

                    <div className="glass-panel bg-white/10 bg-gradient-to-br from-white/30 via-white/20 to-white/10 border-white/20 shadow-2xl max-w-2xl mx-auto p-8 backdrop-blur-2xl transition-colors duration-500">
                        <p className="text-xs text-stone-900 font-bold uppercase tracking-[0.2em] mb-2">Precio Comercial Sugerido</p>
                        <div className="text-3xl md:text-7xl font-bold text-brand-emerald text-shadow-volcanic mb-4 tracking-tighter" id="heroPrice">{formatPrice(data.valor_final_avaluador)}</div>

                        <div className="flex flex-wrap justify-center gap-3">
                            <span className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-400 text-sm font-bold flex items-center backdrop-blur-sm shadow-[0_4px_15px_rgba(6,78,59,0.3)] hover:shadow-[0_6px_20px_rgba(6,78,59,0.4)] transition-all" style={{ textShadow: '1px 1px 3px rgba(6, 78, 59, 0.9)' }}>
                                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" style={{ filter: 'drop-shadow(1px 2px 2px rgba(6, 78, 59, 0.9))' }} /> Precio de Mercado
                            </span>
                            <span className="bg-amber-500/10 text-amber-300 px-4 py-2 rounded-full border border-amber-300 text-sm font-bold flex items-center backdrop-blur-sm shadow-[0_4px_15px_rgba(120,53,15,0.3)] hover:shadow-[0_6px_20px_rgba(120,53,15,0.4)] transition-all" style={{ textShadow: '1px 1px 3px rgba(120, 53, 15, 0.9)' }}>
                                <FontAwesomeIcon icon={faChartLine} className="mr-2" style={{ filter: 'drop-shadow(1px 2px 2px rgba(120, 53, 15, 0.9))' }} /> Alta Rentabilidad
                            </span>
                        </div>
                    </div>
                </div>

                {/* JanIA CTA Button */}
                <div className="mt-8 relative z-20">
                    <Link to="/" className="inline-flex items-center gap-3 px-8 py-4 bg-brand-accent text-black font-bold text-lg rounded-full shadow-[0_0_20px_rgba(217,119,6,0.4)] hover:shadow-[0_0_30px_rgba(217,119,6,0.6)] hover:scale-105 transition-all duration-300 group font-outfit">
                        <span>Hablar con JanIA</span>
                        <span className="bg-black/10 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                        </span>
                    </Link>
                    <p className="mt-2 text-xs text-stone-400 font-light tracking-wide">Asistente IA disponible 24/7</p>
                </div>
            </div>
        </header>
    );
};

export default Hero;

