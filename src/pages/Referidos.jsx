import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/VecyPhoenix/Footer';

const Referidos = () => {
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
            <main className="flex-grow flex flex-col items-center justify-start max-w-6xl mx-auto w-full pt-20 pb-12">
                
                {/* Hero Section */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700 w-full">
                    <div className="inline-block py-1 px-3 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(204,172,78,0.2)]">
                        Exclusivo Vecy Network
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-inter bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-clip-text text-transparent mb-4 pb-2 drop-shadow-lg">
                        Modelo de Ganancias en Red
                    </h1>
                    <p className="text-xl md:text-2xl text-emerald-400 font-medium mb-4 tracking-wide">
                        El Primer Sistema de Referidos Inmobiliarios con IA
                    </p>
                    <p className="text-stone-300 max-w-2xl mx-auto leading-relaxed text-base font-light">
                        Convierte tu red de contactos en una fuente inagotable de <strong>ingresos pasivos</strong>. Recomienda la tecnología de JanIA, ayuda a otros a tasar sus inmuebles y <span className="text-white font-bold">cobra comisiones en efectivo</span> por cada avalúo generado bajo tu enlace.
                    </p>
                </div>

                {/* Compensation Plan Breakdown - THE NEW SPECTACULAR TABLE */}
                <div className="w-full mb-20 animate-in fade-in zoom-in-95 duration-700 delay-150">
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <span className="w-16 h-px bg-gradient-to-r from-transparent to-brand-gold/50"></span>
                        <h2 className="text-3xl font-bold font-inter text-white text-center uppercase tracking-widest drop-shadow-md">
                            💰 <span className="text-brand-gold">Tabla de</span> Recompensas
                        </h2>
                        <span className="w-16 h-px bg-gradient-to-l from-transparent to-brand-gold/50"></span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
                        
                        {/* TIERS OF EARNINGS */}
                        
                        {/* Cafe Earning */}
                        <div className="bg-gradient-to-b from-[#5D493A]/30 to-black/60 backdrop-blur-2xl border border-[#A1887F]/40 rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-[0_0_40px_rgba(161,136,127,0.1)]">
                            <div className="absolute -top-10 -right-10 text-9xl opacity-5 transform group-hover:scale-110 group-hover:rotate-12 transition-all">☕</div>
                            <div className="text-center mb-6 relative z-10">
                                <h3 className="text-2xl font-bold text-[#A1887F] font-inter">Plan Café</h3>
                                <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest">Sondeo Básico</p>
                            </div>
                            
                            <div className="space-y-4 relative z-10">
                                <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center text-center group-hover:border-[#A1887F]/30 transition-colors">
                                    <p className="text-xs text-stone-300 mb-1">Si tu referido es estrato 1, 2 o 3:</p>
                                    <p className="text-3xl font-bold text-emerald-400">+$4.997 <span className="text-sm text-emerald-400/50">COP</span></p>
                                </div>
                                <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center text-center group-hover:border-[#A1887F]/30 transition-colors">
                                    <p className="text-xs text-stone-300 mb-1">Si tu referido es estrato 4, 5 o 6:</p>
                                    <p className="text-3xl font-bold text-emerald-400">+$7.499 <span className="text-sm text-emerald-400/50">COP</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Esmeralda Earning */}
                        <div className="bg-gradient-to-b from-[#0DBB83]/20 to-black/80 backdrop-blur-2xl border border-[#0DBB83]/50 rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-[0_0_50px_rgba(13,187,131,0.15)] lg:scale-105 z-10">
                            <div className="absolute -top-10 -right-10 text-9xl opacity-[0.03] transform group-hover:scale-110 group-hover:rotate-12 transition-all">💎</div>
                            
                            <div className="absolute -top-0 left-1/2 -translate-x-1/2 bg-[#0DBB83] text-black text-[10px] font-black px-4 py-1 rounded-b-lg uppercase tracking-widest shadow-lg">
                                Mayor Rentabilidad
                            </div>

                            <div className="text-center mb-6 mt-4 relative z-10">
                                <h3 className="text-2xl font-bold text-[#0DBB83] font-inter drop-shadow-md">Plan Esmeralda</h3>
                                <p className="text-xs text-stone-300 mt-1 uppercase tracking-widest">Inteligencia PRO</p>
                            </div>
                            
                            <div className="space-y-4 relative z-10">
                                <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center text-center group-hover:border-[#0DBB83]/30 transition-colors">
                                    <p className="text-xs text-stone-300 mb-1">Si tu referido es estrato 1, 2 o 3:</p>
                                    <p className="text-4xl font-bold text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">+$9.997 <span className="text-sm text-emerald-400/50">COP</span></p>
                                </div>
                                <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center text-center group-hover:border-[#0DBB83]/30 transition-colors">
                                    <p className="text-xs text-stone-300 mb-1">Si tu referido es estrato 4, 5 o 6:</p>
                                    <p className="text-4xl font-bold text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">+$12.499 <span className="text-sm text-emerald-400/50">COP</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Oro Earning */}
                        <div className="bg-gradient-to-br from-[#CCAC4E]/20 via-black/80 to-[#CCAC4E]/10 backdrop-blur-2xl border border-brand-gold/50 rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-[0_0_40px_rgba(204,172,78,0.15)] flex flex-col justify-center">
                            <div className="absolute -top-10 -right-10 text-9xl opacity-5 transform group-hover:scale-110 group-hover:rotate-12 transition-all">👑</div>
                            <div className="text-center mb-6 relative z-10">
                                <h3 className="text-2xl font-bold text-brand-gold font-inter drop-shadow-md">Plan Oro</h3>
                                <p className="text-xs text-stone-300 mt-1 uppercase tracking-widest">Avalúo Inversionista</p>
                            </div>
                            
                            <div className="bg-black/40 rounded-2xl p-6 border border-brand-gold/30 flex flex-col items-center justify-center text-center relative z-10 shadow-inner">
                                <p className="text-sm text-stone-300 mb-2 font-light">Comisión Premium por Avalúo</p>
                                <p className="text-5xl font-black text-brand-gold bg-clip-text drop-shadow-[0_0_20px_rgba(204,172,78,0.6)] animate-pulse">10%</p>
                                <p className="text-xs text-stone-400 mt-2 font-mono bg-white/5 px-3 py-1 rounded-full">Neto del valor total</p>
                            </div>
                        </div>

                    </div>

                    {/* SaaS Memberships Earnings */}
                    <div className="w-full mt-16 max-w-5xl mx-auto">
                        <div className="flex items-center justify-center gap-3 mb-10">
                            <span className="w-16 h-px bg-gradient-to-r from-transparent to-[#0DBB83]/50"></span>
                            <h2 className="text-2xl font-bold font-inter text-white text-center uppercase tracking-widest drop-shadow-md">
                                ♾️ <span className="text-[#0DBB83]">Ingresos Recurrentes</span> SaaS
                            </h2>
                            <span className="w-16 h-px bg-gradient-to-l from-transparent to-[#0DBB83]/50"></span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* PRO Earning */}
                            <div className="bg-gradient-to-br from-black/80 to-[#CCAC4E]/5 backdrop-blur-2xl border border-white/10 hover:border-[#CCAC4E]/40 rounded-3xl p-8 relative overflow-hidden transition-all duration-300 group">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-white font-inter">Suscripción <span className="text-[#CCAC4E]">PRO</span></h3>
                                    <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest">Ingreso Mensual o Anual</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center group-hover:bg-white/10 transition-colors">
                                        <span className="text-sm text-stone-300">Mensualidad ($100k)</span>
                                        <span className="text-2xl font-black text-[#CCAC4E]">10% <span className="text-[10px] text-stone-400 font-normal uppercase">/mes</span></span>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center group-hover:bg-white/10 transition-colors">
                                        <span className="text-sm text-stone-300">Anualidad ($1.1M)</span>
                                        <span className="text-3xl font-black text-[#CCAC4E] drop-shadow-[0_0_10px_rgba(204,172,78,0.5)]">15% <span className="text-[10px] text-stone-400 font-normal uppercase">/año</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* AGENCIA Earning */}
                            <div className="bg-gradient-to-br from-black/80 to-[#0DBB83]/10 backdrop-blur-2xl border border-[#0DBB83]/20 hover:border-[#0DBB83]/50 rounded-3xl p-8 relative overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(13,187,131,0.05)] group">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-white font-inter">Suscripción <span className="text-[#0DBB83]">AGENCIA</span></h3>
                                    <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest">Alto Volumen</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex justify-between items-center group-hover:border-[#0DBB83]/30 transition-colors">
                                        <span className="text-sm text-stone-300">Mensualidad ($300k)</span>
                                        <span className="text-3xl font-black text-[#0DBB83] drop-shadow-[0_0_10px_rgba(13,187,131,0.5)]">15% <span className="text-[10px] text-stone-400 font-normal uppercase">/mes</span></span>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex justify-between items-center group-hover:border-[#0DBB83]/30 transition-colors">
                                        <span className="text-sm text-stone-300">Anualidad ($3.3M)</span>
                                        <span className="text-4xl font-black text-[#0DBB83] drop-shadow-[0_0_15px_rgba(13,187,131,0.8)]">20% <span className="text-[10px] text-stone-400 font-normal uppercase">/año</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="w-full max-w-5xl mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    
                    {/* El Poder del Break-Even */}
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">🚀</div>
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="bg-white/10 p-2 rounded-lg text-xl">🎯</span>
                            Rompe el Break-Even
                        </h3>
                        <p className="text-stone-300 mb-6 font-light leading-relaxed">
                            ¿Quieres que tu propio avalúo te salga <strong>completamente GRATIS</strong>? Es pura matemática. Si adquieres un Plan Café para estrato 1-3, solo necesitas que <strong>6 amigos</strong> hagan su avalúo para recuperar tu dinero.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div className="text-center">
                                <div className="text-3xl font-black text-white">6</div>
                                <div className="text-[10px] text-stone-400 uppercase tracking-widest">Amigos</div>
                            </div>
                            <span className="text-emerald-400 font-bold hidden sm:block">➔</span>
                            <span className="text-emerald-400 font-bold sm:hidden">↓</span>
                            <div className="bg-emerald-500/10 border border-emerald-500/30 px-6 py-3 rounded-full text-emerald-400 font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                ¡AVALÚO GRATIS!
                            </div>
                        </div>
                    </div>

                    {/* Regalías Vitalicias */}
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">♾️</div>
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="bg-white/10 p-2 rounded-lg text-xl">📈</span>
                            Regalías Vitalicias
                        </h3>
                        <p className="text-stone-300 mb-6 font-light leading-relaxed">
                            No es solo recuperar tu inversión, es construir un activo. Tu código de referido (ID) en Vecy Avalúos es <strong>vitalicio</strong>. 
                        </p>
                        <ul className="space-y-3 text-stone-300 font-light text-sm">
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-xs font-bold">✓</div>
                                <span>No hay límite de referidos (Comisiones Infinitas).</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-xs font-bold">✓</div>
                                <span>Pagos depositados directamente en tu cuenta.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-xs font-bold">✓</div>
                                <span>Ganas dinero incluso si tú NO compras más avalúos.</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Final Call to Action */}
                <div className="w-full max-w-4xl text-center bg-gradient-to-r from-brand-gold/10 via-brand-gold/5 to-brand-gold/10 backdrop-blur-xl border border-brand-gold/30 rounded-3xl p-12 shadow-[0_0_50px_rgba(204,172,78,0.15)] animate-in fade-in zoom-in duration-1000 delay-500">
                    <h3 className="text-3xl md:text-4xl font-bold font-inter text-white mb-4 drop-shadow-lg">
                        ¿Listo para Monetizar tu Red?
                    </h3>
                    <p className="text-stone-300 mb-8 max-w-2xl mx-auto leading-relaxed font-light text-lg">
                        El Ecosistema Vecy recompensa tu visión. Si la inteligencia de JanIA te sirvió a ti, imagina lo que hará por tus colegas, vecinos y amigos. <strong>Crea tu cuenta, comparte tu link y empieza a facturar.</strong>
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-10 py-5 bg-gradient-to-r from-brand-gold to-brand-accent text-black font-black rounded-2xl text-lg uppercase tracking-[0.2em] shadow-2xl hover:shadow-[0_0_40px_rgba(204,172,78,0.6)] hover:scale-105 transition-all duration-300"
                    >
                        Comenzar Ahora
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Referidos;
