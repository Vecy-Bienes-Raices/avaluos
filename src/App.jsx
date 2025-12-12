import React from 'react';
import Navbar from './components/VecyPhoenix/Navbar';
import Hero from './components/VecyPhoenix/Hero';
import PropertyDetails from './components/VecyPhoenix/PropertyDetails';
import MarketAnalysis from './components/VecyPhoenix/MarketAnalysis';
import NegotiationSimulator from './components/VecyPhoenix/NegotiationSimulator';
import SWOT from './components/VecyPhoenix/SWOT';
import Footer from './components/VecyPhoenix/Footer';

function App() {
    return (
        <div className="text-slate-800 font-sans antialiased min-h-screen">
            <Navbar />
            <Hero />

            <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20 mb-16">
                <div className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6 transform hover:-translate-y-1 transition-transform duration-500">
                    <div className="text-stone-200 text-shadow-black text-sm md:text-base leading-relaxed">
                        <p>Este informe interactivo presenta el análisis técnico detallado para la valoración del inmueble. Navegue a continuación para explorar las características físicas, el estudio jurídico, el análisis comparativo de mercado (CMA) y la estrategia de negociación sugerida.</p>
                    </div>
                    <div className="text-right whitespace-nowrap pl-6 md:border-l border-slate-200">
                        <div className="text-[0.65rem] text-stone-300 text-shadow-black uppercase tracking-widest font-bold">Solicitado por</div>
                        <div className="font-bold text-brand-accent text-shadow-volcanic text-lg">Jani Alves Souza</div>
                        <div className="text-xs text-stone-300 text-shadow-black font-medium">10 Diciembre 2025</div>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 pb-20">
                <PropertyDetails />
                <MarketAnalysis />
                <NegotiationSimulator />
                <SWOT />
            </main>

            <Footer />
        </div>
    )
}
export default App;
