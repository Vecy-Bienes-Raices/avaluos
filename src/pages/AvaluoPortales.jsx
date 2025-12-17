import React, { Suspense, lazy } from 'react';
import Navbar from '../components/VecyPhoenix/Navbar';
import Hero from '../components/VecyPhoenix/Hero';
import PropertyDetails from '../components/VecyPhoenix/PropertyDetails';
import MarketAnalysis from '../components/VecyPhoenix/MarketAnalysis';
import NegotiationSimulator from '../components/VecyPhoenix/NegotiationSimulator';
import SWOT from '../components/VecyPhoenix/SWOT';
import Footer from '../components/VecyPhoenix/Footer';
import FloatingConcierge from '../components/VecyPhoenix/FloatingConcierge';

// Lazy Load Map
const LocationMap = lazy(() => import('../components/VecyPhoenix/LocationMap'));

import { useParams } from 'react-router-dom';
import { useAvaluo } from '../hooks/useAvaluo';

import { useTheme } from '../context/ThemeContext';

const AvaluoPortales = () => {
    const { id } = useParams();
    const { theme } = useTheme();
    const { data, loading, error } = useAvaluo(id);

    const bgClass = theme === 'dark' ? 'bg-[#0f0f0f] text-stone-200' : 'bg-stone-50 text-slate-800';

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="animate-pulse">Cargando Avalúo...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
                <div className="text-center p-8 glass-panel bg-red-500/10 border-red-500/20">
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Avalúo No Encontrado</h2>
                    <p className="text-stone-400">{error || 'El reporte solicitado no existe o ha sido eliminado.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`font-sans antialiased min-h-screen transition-colors duration-500 ${bgClass}`}>
            <Navbar />
            <Hero data={data} />

            <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20 mb-16">
                <div className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6 transform hover:-translate-y-1 transition-transform duration-500">
                    <div className="text-stone-200 text-shadow-black text-sm md:text-base leading-relaxed">
                        <p>Este informe interactivo presenta el análisis técnico detallado para la valoración del inmueble. Navegue a continuación para explorar las características físicas, el estudio jurídico, el análisis comparativo de mercado (CMA) y la estrategia de negociación sugerida.</p>
                    </div>
                    <div className="text-right whitespace-nowrap pl-6 md:border-l border-slate-200">
                        <div className="text-[0.65rem] text-stone-300 text-shadow-black uppercase tracking-widest font-bold">Solicitado por</div>
                        <div className="font-bold text-brand-accent text-shadow-volcanic text-lg">{data.cliente_nombre}</div>
                        <div className="text-xs text-stone-300 text-shadow-black font-medium">{data.cliente_fecha}</div>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 pb-20">
                <PropertyDetails data={data} />
                <MarketAnalysis />
                <NegotiationSimulator />
                <SWOT />
                <Suspense fallback={<div className="h-96 w-full glass-panel flex items-center justify-center text-stone-500 animate-pulse">Cargando Mapa...</div>}>
                    <LocationMap data={data} />
                </Suspense>
            </main>

            <Footer />
            <FloatingConcierge />
        </div>
    );
};

export default AvaluoPortales;
