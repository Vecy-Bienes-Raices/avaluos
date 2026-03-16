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
                <h1 className="text-3xl md:text-5xl font-bold font-inter bg-gradient-to-r from-brand-accent via-white to-brand-accent bg-clip-text text-transparent mb-4 pb-2">
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

            {/* DETAILED EXPLANATION SECTION */}
            <div className="w-full max-w-6xl mt-16 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold font-inter text-white mb-4 drop-shadow-md">
                        ¿Qué incluye exactamente cada plan?
                    </h2>
                    <p className="text-stone-300 max-w-3xl mx-auto text-sm md:text-base font-light leading-relaxed">
                        En Vecy no hay letras pequeñas. Queremos que sepas exactamente qué vas a recibir, en cuánto tiempo y para qué te sirve cada nivel de inteligencia artificial o servicio profesional.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Explicación Café */}
                    <div className="bg-gradient-to-b from-[#5D493A]/20 to-black/40 backdrop-blur-xl border border-[#A1887F]/30 rounded-3xl p-8 hover:border-[#A1887F]/60 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-[#5D493A]/50 flex items-center justify-center border border-[#A1887F]/30">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#A1887F]"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#A1887F] font-inter">Sondeo Café</h3>
                                <p className="text-xs text-stone-400">Rápido y preciso para uso personal</p>
                            </div>
                        </div>
                        <div className="space-y-5 text-sm font-light text-stone-300">
                            <div>
                                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><span className="text-[#A1887F]">⚡</span> Tiempo de Entrega</h4>
                                <p><strong>Inmediato (Segundos).</strong> Tras el pago, JanIA procesa la data al instante.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><span className="text-[#A1887F]">📄</span> Formato de Entrega</h4>
                                <p>Reporte digital dinámico en pantalla y exportable a <strong>PDF básico</strong> para compartir fácilmente por WhatsApp o correo.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><span className="text-[#A1887F]">🎯</span> Casos de Uso Ideales</h4>
                                <p>Perfecto para propietarios curiosos, compradores que quieren saber si un precio es justo antes de ofertar, o arrendatarios negociando el canon.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><span className="text-[#A1887F]">⚠️</span> Limitaciones</h4>
                                <p>No incluye mapa de calor, análisis socioeconómico profundo ni es válido para trámites legales.</p>
                            </div>
                        </div>
                    </div>

                    {/* Explicación Esmeralda */}
                    <div className="bg-gradient-to-b from-[#0DBB83]/10 to-black/60 backdrop-blur-xl border border-[#0DBB83]/40 rounded-3xl p-8 hover:border-[#0DBB83]/70 transition-all duration-300 lg:-translate-y-4 shadow-[0_0_40px_rgba(13,187,131,0.1)] relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#0DBB83] text-black text-[10px] font-black px-4 py-1 rounded-b-lg uppercase tracking-widest shadow-lg">
                            El Más Popular
                        </div>
                        <div className="flex items-center gap-3 mb-6 mt-2">
                            <div className="w-12 h-12 rounded-xl bg-[#0DBB83]/20 flex items-center justify-center border border-[#0DBB83]/40">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#0DBB83]"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#0DBB83] font-inter drop-shadow-md">Inteligencia Esmeralda</h3>
                                <p className="text-xs text-stone-300">Data PRO para negociaciones reales</p>
                            </div>
                        </div>
                        <div className="space-y-5 text-sm font-light text-stone-300">
                            <div>
                                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><span className="text-[#0DBB83]">⚡</span> Tiempo de Entrega</h4>
                                <p><strong>~1 Minuto.</strong> JanIA realiza un análisis exhaustivo de miles de datos concurrentes.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><span className="text-[#0DBB83]">📊</span> Formato de Entrega</h4>
                                <p><strong>Web Dashboard Interactivo</strong> (con mapas y gráficos dinámicos) y un <strong>PDF Profesional Premium</strong> altamente estético con marca Vecy, listo para presentar a clientes.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><span className="text-[#0DBB83]">🎯</span> Casos de Uso Ideales</h4>
                                <p>Indispensable para <strong>Agentes Inmobiliarios (Brokers)</strong>, inversionistas fijando precios de mercado, constructoras analizando zonas, y sustento robusto de valor (Incluye POT, Zonas de Riesgo y Calor).</p>
                            </div>
                        </div>
                    </div>

                    {/* Explicación Oro */}
                    <div className="bg-gradient-to-br from-[#CCAC4E]/10 to-black/40 backdrop-blur-xl border border-brand-gold/40 rounded-3xl p-8 hover:border-brand-gold/70 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-brand-gold/20 flex items-center justify-center border border-brand-gold/40">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-gold"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-brand-gold font-inter drop-shadow-md">Avalúo Oro King</h3>
                                <p className="text-xs text-stone-300">Inteligencia Financiera Avanzada</p>
                            </div>
                        </div>
                        <div className="space-y-5 text-sm font-light text-stone-300">
                            <div>
                                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><span className="text-brand-gold">⏱️</span> Tiempo de Entrega</h4>
                                <p><strong>~3 Minutos.</strong> Análisis deep-learning masivo procesado en tiempo récord por JanIA.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><span className="text-brand-gold">📊</span> Formato de Entrega</h4>
                                <p><strong>Dashboard Financiero PRO + Reporte Ejecutivo Técnico.</strong> Data cruzada en tiempo real de absorción, tendencias y rentabilidad.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><span className="text-brand-gold">🎯</span> Casos de Uso Ideales</h4>
                                <p>Exclusivo para <strong>Inversionistas, Flippers y Brókers Top</strong>. Incluye cálculo de ROI, Cap Rate, proyecciones a 5 años y análisis de proyectos comerciales complejos.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SAAS MEMBERSHIPS SECTION */}
            <div className="w-full max-w-6xl mt-20 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <div className="inline-block py-1 px-3 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(204,172,78,0.2)]">
                        Software as a Service (SaaS)
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold font-inter text-white mb-4 drop-shadow-md">
                        Membresías para Profesionales
                    </h2>
                    <p className="text-stone-300 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
                        Ten el Analista Financiero de Inteligencia Artificial más avanzado del mundo Inmobiliario directamente en tu bolsillo. Evaluaciones ilimitadas, rentabilidad instantánea.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Suscripción PRO */}
                    <div className="bg-black/60 backdrop-blur-2xl border border-white/10 hover:border-brand-accent/50 rounded-3xl p-8 relative overflow-hidden transition-all duration-500 group">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white font-inter">Suscripción PRO</h3>
                            <p className="text-sm text-stone-400 mt-1">Para el Agente Inmobiliario Top</p>
                        </div>
                        
                        <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/5 text-center transition-colors group-hover:bg-white/10">
                            <p className="text-sm font-bold text-brand-accent mb-2 uppercase tracking-widest">Incluye</p>
                            <p className="text-4xl font-black text-white mb-1">20 Avalúos</p>
                            <p className="text-xs text-stone-400 font-mono">Café, Esmeralda u Oro al Mes</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-stone-300 text-sm">Plan Mensual</span>
                                <span className="font-bold text-white">$100.000 <span className="text-[10px] text-stone-400 font-normal uppercase">COP/mes</span></span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-stone-300 text-sm flex items-center gap-1">Plan Anual <span className="text-[10px] bg-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded-md font-bold uppercase">(1 mes GRATIS)</span></span>
                                <span className="font-bold text-brand-gold">$1.100.000 <span className="text-[10px] text-stone-400 font-normal uppercase">COP/año</span></span>
                            </div>
                        </div>

                        <button onClick={() => navigate('/')} className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-brand-accent hover:text-black border border-white/10 font-bold transition-all text-xs uppercase tracking-widest shadow-lg">
                            Seleccionar PRO
                        </button>
                    </div>

                    {/* Suscripción AGENCIA */}
                    <div className="bg-gradient-to-b from-[#0DBB83]/10 to-black/80 backdrop-blur-2xl border border-[#0DBB83]/40 hover:border-[#0DBB83]/70 rounded-3xl p-8 relative overflow-hidden transition-all duration-500 shadow-[0_0_40px_rgba(13,187,131,0.1)] group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0DBB83]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="text-center mb-6 relative z-10">
                            <h3 className="text-2xl font-bold text-[#0DBB83] font-inter drop-shadow-md">Suscripción AGENCIA</h3>
                            <p className="text-sm text-stone-400 mt-1">Para Inmobiliarias y Equipos</p>
                        </div>
                        
                        <div className="bg-black/40 rounded-2xl p-6 mb-6 border border-white/5 text-center relative z-10 transition-colors group-hover:border-[#0DBB83]/30">
                            <p className="text-sm font-bold text-[#0DBB83] mb-2 uppercase tracking-widest">Incluye</p>
                            <p className="text-4xl font-black text-white mb-1">70 Avalúos</p>
                            <p className="text-xs text-stone-400 font-mono">Café, Esmeralda u Oro al Mes (60 Anual)</p>
                        </div>

                        <div className="space-y-4 mb-8 relative z-10">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-stone-300 text-sm">Plan Mensual</span>
                                <span className="font-bold text-white">$300.000 <span className="text-[10px] text-stone-400 font-normal uppercase">COP/mes</span></span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-stone-300 text-sm flex items-center gap-1">Plan Anual <span className="text-[10px] bg-brand-gold/20 text-brand-gold px-1.5 py-0.5 rounded-md font-bold uppercase">(1 mes GRATIS)</span></span>
                                <span className="font-bold text-[#0DBB83] drop-shadow-[0_0_10px_rgba(13,187,131,0.5)]">$3.300.000 <span className="text-[10px] text-stone-400 font-normal uppercase">COP/año</span></span>
                            </div>
                        </div>

                        <button onClick={() => navigate('/')} className="relative w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0DBB83] to-[#0aa674] hover:to-[#0DBB83] text-white font-bold transition-all text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(13,187,131,0.4)] z-10">
                            Seleccionar Agencia
                        </button>
                    </div>
                </div>
            </div>

            {/* STRIPPED: NETWORK MODEL is now in /referidos */}

            {/* CTA Redirección a Modelo de Ganancias en Red */}
            <div className="w-full max-w-5xl mt-12 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="bg-gradient-to-r from-brand-gold/5 via-brand-gold/10 to-brand-gold/5 border border-brand-gold/20 rounded-3xl p-8 md:p-12 shadow-[0_0_30px_rgba(204,172,78,0.1)] text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                        <span className="text-9xl">💰</span>
                    </div>
                    
                    <h2 className="text-2xl md:text-4xl font-bold font-inter text-brand-gold mb-4 uppercase tracking-widest drop-shadow-md">
                        ¿Quieres que tu avalúo te salga GRATIS?
                    </h2>
                    <p className="text-stone-300 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed mb-8">
                        Conoce el primer modelo de <em>Real Estate Network Marketing</em> impulsado por IA. Convierte tus contactos en una fuente de ingresos pasivos.
                    </p>
                    
                    <button
                        onClick={() => navigate('/referidos')}
                        className="px-8 py-4 bg-white/5 hover:bg-brand-gold hover:text-black border border-white/10 rounded-xl transition-all duration-300 text-sm font-bold uppercase tracking-widest shadow-lg hover:shadow-[0_0_30px_rgba(204,172,78,0.4)] relative z-10"
                    >
                        Ver Modelo de Ganancias en Red
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Planes;
