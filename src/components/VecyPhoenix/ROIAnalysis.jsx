import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faChartLine, faGem, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';

const ROIAnalysis = ({ data = {} }) => {
    const investments = data.mejoras_sugeridas || [
        { label: 'Remodelación Cocina (Open Concept)', cost: '12M', roi: '+25M', impact: 'Alto' },
        { label: 'Actualización Baños (Premium)', cost: '8M', roi: '+15M', impact: 'Medio' },
        { label: 'Iluminación LED & Domótica', cost: '3M', roi: '+7M', impact: 'Medio' }
    ];

    return (
        <section className="p-10 bg-black/20 min-h-full">
            <div className="mb-10 text-center lg:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                    <span className="w-8 h-px bg-brand-gold/30"></span>
                    <span className="text-brand-gold font-black tracking-[0.3em] uppercase text-[10px]">Optimización de Capital</span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-widest uppercase italic mb-8">ANÁLISIS DE MEJORAS & ROI</h2>
            </div>

            <div className="space-y-6">
                <table className="w-full text-left">
                    <thead className="text-[9px] font-black text-stone-500 uppercase tracking-widest border-b border-white/5">
                        <tr>
                            <th className="pb-4 px-2">Proyecto Sugerido</th>
                            <th className="pb-4 px-2">Costo Est.</th>
                            <th className="pb-4 px-2 text-right">Plusvalía</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {investments.map((inv, i) => (
                            <tr key={i} className="group transition-colors hover:bg-white/5">
                                <td className="py-5 px-2">
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm tracking-tight italic">{inv.label}</span>
                                        <span className="text-[9px] text-brand-gold font-black uppercase tracking-widest mt-1">Impacto {inv.impact}</span>
                                    </div>
                                </td>
                                <td className="py-5 px-2 text-stone-400 font-bold text-sm italic">${inv.cost}</td>
                                <td className="py-5 px-2 text-right">
                                    <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full border border-brand-gold/20 text-[10px] font-black italic">
                                        <FontAwesomeIcon icon={faArrowTrendUp} />
                                        {inv.roi}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 text-center">
                    <span className="text-[9px] text-stone-500 font-black uppercase tracking-widest block mb-2">Total Inversión</span>
                    <span className="text-xl font-black text-white italic tracking-tighter">$23M</span>
                </div>
                <div className="bg-brand-gold/10 p-6 rounded-[32px] border border-brand-gold/20 text-center">
                    <span className="text-[9px] text-brand-gold font-black uppercase tracking-widest block mb-2">Cap. Revalorización</span>
                    <span className="text-xl font-black text-brand-gold italic tracking-tighter">+$47M</span>
                </div>
            </div>
        </section>
    );
};

export default ROIAnalysis;
