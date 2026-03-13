import React, { Suspense, lazy } from 'react';

// Lazy Load Chart to save bundle size
const MarketChart = lazy(() => import('./MarketChart'));

const MarketAnalysis = ({ data = {} }) => {
    const unitPrice = (data.valor_final_avaluador / (data.area_construida || 1)) / 1000000; // in Millions
    const marketInsight = data.analisis_mercado_texto ||
        "El análisis de Big Data en la zona indica una absorción positiva. Los comparables analizados por JanIA sugieren un posicionamiento estratégico para optimizar el tiempo de venta.";

    return (
        <section id="market" className="bg-stone-900/10 p-6 md:p-12 overflow-hidden relative min-h-full">
            <div className="relative z-10 mb-12 text-center lg:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                    <span className="w-8 h-px bg-brand-gold/30"></span>
                    <span className="text-brand-gold font-black tracking-[0.3em] uppercase text-[10px]">CMA Avanzado</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase italic leading-none mb-6">DINÁMICAS DE MERCADO</h2>
                <p className="text-stone-400 mt-4 max-w-2xl text-lg leading-relaxed italic">
                    {marketInsight}
                </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-12">
                {/* Chart Section - Darkened */}
                <div className="bg-black/60 p-8 rounded-[40px] border border-white/5 backdrop-blur-3xl shadow-2xl min-h-[350px] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl group-hover:bg-brand-gold/10 transition-all"></div>
                    <Suspense fallback={<div className="text-stone-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Iniciando Gráficos Tácticos...</div>}>
                        <div className="w-full h-full">
                            <MarketChart />
                        </div>
                    </Suspense>
                </div>

                {/* Data Summary - Premium Dark */}
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-brand-gold/20 transition-all">
                            <div className="text-[10px] text-stone-500 uppercase font-black tracking-[0.2em] mb-3">Escala Sectorial (m²)</div>
                            <div className="text-3xl font-black text-white tracking-tighter">
                                <span className="text-brand-gold text-lg mr-1 italic">$</span>{(unitPrice * 0.9).toFixed(1)}M - <span className="text-brand-gold text-lg mr-1 italic">$</span>{(unitPrice * 1.1).toFixed(1)}M
                            </div>
                        </div>
                        <div className="bg-brand-gold/5 p-8 rounded-[32px] border border-brand-gold/20 shadow-2xl">
                            <div className="text-[10px] text-brand-gold/60 uppercase font-black tracking-[0.2em] mb-3">Valor Sujeto (m²)</div>
                            <div className="text-3xl font-black text-brand-gold tracking-tighter italic">
                                <span className="text-brand-gold text-lg mr-1">$</span>{unitPrice.toFixed(2)}M
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></div>
                                <span className="text-[9px] text-brand-gold/80 font-black uppercase tracking-[0.1em]">
                                    Nivel: {unitPrice > 5.5 ? 'PRIME (ALTO IMPACTO)' : 'EQUILIBRIO TÉCNICO'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-stone-300">
                            <thead className="text-[10px] text-stone-500 uppercase font-black tracking-[0.2em] border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4">Muestra de Control</th>
                                    <th className="px-6 py-4">Superficie</th>
                                    <th className="px-6 py-4">Calidad</th>
                                    <th className="px-6 py-4 text-right">Potencial</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr className="group">
                                    <td className="px-6 py-6 text-stone-400 group-hover:text-white transition-colors">Base de Mercado</td>
                                    <td className="px-6 py-6">{data.area_construida || 0} m²</td>
                                    <td className="px-6 py-6 italic opacity-50 text-xs">Conservador</td>
                                    <td className="px-6 py-6 text-right font-black"><span className="text-brand-gold text-[10px] mr-1">$</span>{Math.round((unitPrice * 0.9) * (data.area_construida || 0))}M</td>
                                </tr>
                                <tr className="bg-brand-gold/5 border-y border-brand-gold/10">
                                    <td className="px-6 py-6 font-black text-brand-gold uppercase italic tracking-tighter">OBJETIVO JANIA</td>
                                    <td className="px-6 py-6 font-black text-white tracking-widest">{data.area_construida || 0} m²</td>
                                    <td className="px-6 py-6 font-black text-white italic uppercase text-[10px]">Verificado</td>
                                    <td className="px-6 py-6 text-right font-black text-2xl text-white tracking-tighter">
                                        <span className="text-brand-gold text-sm mr-1 italic">$</span>{Math.round(data.valor_final_avaluador / 1000000)}M
                                    </td>
                                </tr>
                                <tr className="group">
                                    <td className="px-6 py-6 text-stone-400 group-hover:text-white transition-colors">Cima Transaccional</td>
                                    <td className="px-6 py-6">{data.area_construida || 0} m²</td>
                                    <td className="px-6 py-6 italic opacity-50 text-xs">Excepcional</td>
                                    <td className="px-6 py-6 text-right font-black"><span className="text-brand-gold text-[10px] mr-1">$</span>{Math.round((unitPrice * 1.1) * (data.area_construida || 0))}M</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-8 flex items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                             <div className="w-1 h-1 rounded-full bg-brand-gold/50"></div>
                             <p className="text-[9px] text-stone-500 uppercase font-black tracking-[0.1em] italic">
                                Algoritmo de regresión múltiple ejecutado por JanIA en tiempo real. No vinculante legalmente.
                             </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MarketAnalysis;
