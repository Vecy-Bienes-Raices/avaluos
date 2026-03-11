import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/VecyPhoenix/Footer';

const Network = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const bgClass = theme === 'coffee' ? 'bg-[#423229]' : 'bg-[#0f0f0f]';
    const bgStyle = theme === 'coffee'
        ? { backgroundImage: 'radial-gradient(circle at center, #7D6B65 0%, #4E3D32 40%, #423229 100%)' }
        : { background: '#0f0f0f' };

    return (
        <div className={`min-h-screen w-full flex flex-col pt-6 px-6 text-stone-200 transition-colors duration-500 ${bgClass}`} style={bgStyle}>
            {/* Header / Back Button */}
            <div className="absolute top-8 left-8 z-50">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-bold backdrop-blur-md group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    Volver con JanIA
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center max-w-6xl mx-auto w-full pt-20 pb-12">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl md:text-6xl font-bold font-outfit bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-clip-text text-transparent mb-4 pb-2">
                        Vecy Network
                    </h1>
                    <p className="text-xl md:text-2xl text-brand-gold font-medium mb-3">
                        El Primer Real Estate Network Marketing Impulsado por IA
                    </p>
                    <p className="text-stone-300 max-w-2xl mx-auto leading-relaxed">
                        Convierte tu red de contactos en una fuente de <strong>ingresos pasivos</strong>. Recupera tu inversión en avalúos y empieza a facturar hoy mismo.
                    </p>
                </div>

                {/* Pricing Table */}
                <div className="w-full mb-20">
                    <h2 className="text-3xl font-bold font-outfit text-brand-gold text-center mb-8 uppercase tracking-widest">
                        📊 Tabla Oficial de Precios 2026
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Plan Café */}
                        <div className="bg-white/5 backdrop-blur-xl border border-[#A1887F]/30 rounded-2xl p-6">
                            <div className="text-center mb-4">
                                <div className="text-4xl mb-2">☕</div>
                                <h3 className="text-xl font-bold text-[#A1887F]">Plan Café Express</h3>
                                <p className="text-xs text-stone-400 mt-1">Sondeo de Mercado Rápido</p>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-[#5D493A]/20 rounded-lg p-3 border border-[#A1887F]/20">
                                    <p className="text-xs text-stone-400">Estratos 1, 2, 3</p>
                                    <p className="text-2xl font-bold text-white">$29.997<span className="text-xs text-stone-400 ml-1">COP</span></p>
                                </div>
                                <div className="bg-[#5D493A]/20 rounded-lg p-3 border border-[#A1887F]/20">
                                    <p className="text-xs text-stone-400">Estratos 4, 5, 6</p>
                                    <p className="text-2xl font-bold text-white">$49.997<span className="text-xs text-stone-400 ml-1">COP</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Plan Esmeralda */}
                        <div className="bg-white/5 backdrop-blur-xl border border-[#0DBB83]/30 rounded-2xl p-6">
                            <div className="text-center mb-4">
                                <div className="text-4xl mb-2">💎</div>
                                <h3 className="text-xl font-bold text-[#0DBB83]">Plan Esmeralda Plus</h3>
                                <p className="text-xs text-stone-400 mt-1">Inteligencia de Datos PRO</p>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-[#0DBB83]/10 rounded-lg p-3 border border-[#0DBB83]/20">
                                    <p className="text-xs text-stone-400">Estratos 1, 2, 3</p>
                                    <p className="text-2xl font-bold text-white">$99.997<span className="text-xs text-stone-400 ml-1">COP</span></p>
                                </div>
                                <div className="bg-[#0DBB83]/10 rounded-lg p-3 border border-[#0DBB83]/20">
                                    <p className="text-xs text-stone-400">Estratos 4, 5, 6</p>
                                    <p className="text-2xl font-bold text-white">$149.997<span className="text-xs text-stone-400 ml-1">COP</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Plan Oro */}
                        <div className="bg-gradient-to-br from-brand-gold/10 to-transparent backdrop-blur-xl border border-brand-gold/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(204,172,78,0.2)]">
                            <div className="text-center mb-4">
                                <div className="text-4xl mb-2">👑</div>
                                <h3 className="text-xl font-bold text-brand-gold">Plan Oro King</h3>
                                <p className="text-xs text-stone-400 mt-1">Avalúo Corporativo Certificado</p>
                            </div>
                            <div className="bg-brand-gold/10 rounded-lg p-4 border border-brand-gold/30 text-center">
                                <p className="text-sm text-stone-300 mb-2">Precio:</p>
                                <p className="text-3xl font-bold text-brand-gold">COTIZACIÓN</p>
                                <p className="text-xs text-stone-400 mt-2">Por Vecy Perito Partner</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="mt-4 w-full py-2 bg-brand-gold hover:bg-brand-gold/80 text-black font-bold rounded-lg text-sm transition-all"
                                >
                                    Solicitar Cotización
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compensation Plan */}
                <div className="w-full mb-16">
                    <h2 className="text-3xl font-bold font-outfit text-brand-gold text-center mb-8 uppercase tracking-widest">
                        💰 Plan de Compensación
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Ganancias Directas */}
                        <div className="bg-black/40 backdrop-blur-xl border border-brand-gold/30 rounded-2xl p-6 hover:border-brand-gold/60 transition-all duration-300">
                            <div className="text-center mb-4">
                                <div className="text-5xl mb-2">💰</div>
                                <h3 className="text-xl font-bold text-emerald-400">Ganancias Directas</h3>
                            </div>

                            <div className="space-y-4 font-mono text-xs">
                                {/* Café */}
                                <div>
                                    <p className="text-[#A1887F] font-bold text-sm mb-2">☕ Plan Café</p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between bg-white/5 p-2 rounded-lg">
                                            <span className="text-stone-300">Estratos 1-3</span>
                                            <span className="text-emerald-400 font-bold">+$4.997</span>
                                        </div>
                                        <div className="flex justify-between bg-white/5 p-2 rounded-lg">
                                            <span className="text-stone-300">Estratos 4-6</span>
                                            <span className="text-emerald-400 font-bold">+$7.499</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Esmeralda */}
                                <div>
                                    <p className="text-[#0DBB83] font-bold text-sm mb-2">💎 Plan Esmeralda</p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between bg-white/5 p-2 rounded-lg">
                                            <span className="text-stone-300">Estratos 1-3</span>
                                            <span className="text-emerald-400 font-bold">+$9.997</span>
                                        </div>
                                        <div className="flex justify-between bg-white/5 p-2 rounded-lg">
                                            <span className="text-stone-300">Estratos 4-6</span>
                                            <span className="text-emerald-400 font-bold">+$12.499</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Oro */}
                                <div className="bg-gradient-to-r from-brand-gold/10 to-transparent p-3 rounded-lg border border-brand-gold/30">
                                    <p className="text-brand-gold font-bold text-sm mb-1">👑 Plan Oro</p>
                                    <p className="text-emerald-400 font-bold text-lg">10% NETO</p>
                                    <p className="text-xs text-stone-400 mt-1">Del valor del avalúo</p>
                                </div>
                            </div>
                        </div>

                        {/* ROI Avalúo Gratis */}
                        <div className="bg-gradient-to-br from-brand-gold/10 to-black/60 backdrop-blur-xl border border-brand-gold/50 rounded-2xl p-6 transform md:-translate-y-4 shadow-[0_0_30px_rgba(204,172,78,0.15)]">
                            <div className="text-center mb-4">
                                <div className="text-5xl mb-2">🚀</div>
                                <h3 className="text-xl font-bold text-brand-gold">Avalúo Gratis</h3>
                            </div>

                            <p className="text-sm text-stone-300 mb-6 text-center">
                                Si tus amigos compran un Plan Café (Estratos 1-3), solo necesitas:
                            </p>

                            <div className="flex flex-col items-center gap-3 mb-4">
                                <div className="text-5xl font-bold text-white">6 <span className="text-base font-normal text-stone-400">AMIGOS</span></div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                <div className="text-lg font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/30">
                                    ¡AVALÚO GRATIS!
                                </div>
                            </div>
                            <p className="text-xs text-stone-500 text-center italic">
                                6 Referidos × $4.997 = $29.982<br />
                                (Break-even instantáneo)
                            </p>
                        </div>

                        {/* Regalías Eternas */}
                        <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/60 transition-all duration-300">
                            <div className="text-center mb-4">
                                <div className="text-5xl mb-2">💎</div>
                                <h3 className="text-xl font-bold text-purple-400">Regalías Eternas</h3>
                            </div>

                            <p className="text-sm text-stone-400 mb-6 text-center">
                                Tu ID de Vecy es <strong>vitalicio</strong>. Construye riqueza a largo plazo.
                            </p>

                            <ul className="space-y-3 text-sm text-stone-300">
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
                                    <span>Ganas incluso si tú <strong className="text-white">NO</strong> compras avalúos. Solo comparte.</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full mt-6 py-3 bg-gradient-to-r from-brand-gold to-brand-accent text-black font-bold rounded-xl text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(204,172,78,0.5)]"
                            >
                                Empezar Ahora
                            </button>
                        </div>
                    </div>
                </div>

                {/* CTA Final */}
                <div className="w-full max-w-4xl text-center bg-gradient-to-r from-brand-gold/10 via-brand-gold/5 to-brand-gold/10 backdrop-blur-xl border border-brand-gold/30 rounded-3xl p-12 shadow-[0_0_50px_rgba(204,172,78,0.15)]">
                    <h3 className="text-3xl font-bold font-outfit text-brand-gold mb-4">
                        ¿Listo para Monetizar tu Red?
                    </h3>
                    <p className="text-stone-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                        No dejes dinero sobre la mesa. El Ecosistema Vecy recompensa tu red de contactos. Si el avalúo te fue útil, imagina lo que hará por tus vecinos. <strong>Comparte tu link y empieza a facturar hoy mismo.</strong>
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-12 py-4 bg-gradient-to-r from-brand-gold to-brand-accent text-black font-bold rounded-2xl text-lg uppercase tracking-widest hover:brightness-110 transition-all shadow-2xl hover:shadow-[0_0_40px_rgba(204,172,78,0.6)] hover:scale-105"
                    >
                        Hablar con JanIA
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Network;
