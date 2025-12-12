import React, { Suspense, lazy } from 'react';

// Lazy Load Chart to save bundle size
const MarketChart = lazy(() => import('./MarketChart'));

const MarketAnalysis = () => {


    return (
        <section id="market" className="glass-panel bg-white/10 p-4 md:p-12 mt-12 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute -left-20 top-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

            <div className="relative z-10 mb-8 text-center md:text-left">
                <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Inteligencia de Mercado</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-brand-accent tracking-tight text-shadow-volcanic">Estudio Comparativo (CMA)</h2>
                <p className="text-stone-300 text-shadow-black mt-4 max-w-3xl text-lg leading-relaxed">
                    Comparables en zona piden ~$5.6M/m², pero son inmuebles con mayor área legalizada.
                    <span className="text-amber-400 font-bold"> El sujeto debe ajustar precio por falta de licencia en ampliaciones.</span>
                </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                {/* Chart Section */}
                <div className="bg-slate-900/50 p-4 md:p-6 rounded-3xl border border-white/10 backdrop-blur-sm shadow-inner min-h-[300px] flex items-center justify-center">
                    <Suspense fallback={<div className="text-stone-400 text-sm animate-pulse">Cargando Análisis Gráfico...</div>}>
                        <div className="w-full h-full">
                            <MarketChart />
                        </div>
                    </Suspense>
                </div>

                {/* Data Summary */}
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/50 p-6 rounded-3xl border border-white/60 shadow-sm backdrop-blur-sm">
                            <div className="text-[0.65rem] text-slate-600 uppercase font-bold tracking-widest mb-1">Rango Sector (m²)</div>
                            <div className="text-2xl font-bold text-slate-700 text-shadow-sm"><span className="text-brand-accent">$</span>4.2M - <span className="text-brand-accent">$</span>5.2M</div>
                        </div>
                        <div className="glass-panel-dark p-6 rounded-3xl text-white">
                            <div className="text-[0.65rem] text-slate-400 uppercase font-bold tracking-widest mb-1">Sujeto (m²)</div>
                            <div className="text-2xl font-bold text-brand-emerald text-shadow-volcanic"><span className="text-brand-accent">$</span>5.20M</div>
                            <div className="text-[0.6rem] text-slate-300 mt-1 opacity-80 uppercase tracking-wider">Posicionamiento: ALTO (Castigar por licencia)</div>
                        </div>
                    </div>

                    <div className="overflow-x-auto max-w-full">
                        <table className="w-full text-sm text-left text-stone-200 text-shadow-black whitespace-nowrap">
                            <thead className="text-xs text-stone-400 text-shadow-black uppercase bg-slate-50/10">
                                <tr>
                                    <th className="px-2 py-2">Ubicación</th>
                                    <th className="px-2 py-2">Área</th>
                                    <th className="px-2 py-2">Estado</th>
                                    <th className="px-2 py-2 text-right">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-white/10">
                                    <td className="px-2 py-2">Portales II</td>
                                    <td className="px-2 py-2">74 m²</td>
                                    <td className="px-2 py-2">Bueno</td>
                                    <td className="px-2 py-2 text-right"><span className="text-brand-accent">$</span>408M</td>
                                </tr>
                                <tr className="border-b bg-green-50/10">
                                    <td className="px-2 py-2 font-bold text-brand-accent text-shadow-volcanic">SUJETO</td>
                                    <td className="px-2 py-2 font-bold">72 m²</td>
                                    <td className="px-2 py-2 font-bold">Remodelado</td>
                                    <td className="px-2 py-2 font-bold text-right text-brand-emerald text-shadow-volcanic"><span className="text-brand-accent">$</span>375M</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="px-2 py-2">Mazurén</td>
                                    <td className="px-2 py-2">73 m²</td>
                                    <td className="px-2 py-2">Promedio</td>
                                    <td className="px-2 py-2 text-right"><span className="text-brand-accent">$</span>424M</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-xs text-stone-400 text-shadow-black mt-2 italic">*Muestra parcial.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MarketAnalysis;
