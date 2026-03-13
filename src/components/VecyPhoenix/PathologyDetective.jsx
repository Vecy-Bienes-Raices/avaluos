import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBiohazard, faDroplet, faTriangleExclamation, faWaveSquare, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const PathologyDetective = ({ data = {} }) => {
    const pathologies = data.patologias || [
        { label: 'Humedad Capilar', status: 'Inexistente', icon: faDroplet, level: 0 },
        { label: 'Fisuras Estructurales', status: 'Inexistente', icon: faTriangleExclamation, level: 0 },
        { label: 'Desgaste de Acabados', status: 'Leve', icon: faWaveSquare, level: 20 },
        { label: 'Integridad de Redes', status: 'Óptima', icon: faCheckCircle, level: 0 }
    ];

    return (
        <section className="p-10 bg-black/20 min-h-full">
            <div className="mb-10 text-center lg:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                    <span className="w-8 h-px bg-red-500/30"></span>
                    <span className="text-red-500 font-black tracking-[0.3em] uppercase text-[10px]">Diagnóstico Clínico</span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-widest uppercase italic mb-8">DETECTOR DE PATOLOGÍAS</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {pathologies.map((p, i) => (
                    <div key={i} className="bg-white/5 p-6 rounded-[32px] border border-white/5 hover:border-red-500/20 transition-all flex items-center gap-6 group">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${p.level > 0 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'}`}>
                            <FontAwesomeIcon icon={p.icon} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{p.label}</span>
                                <span className={`text-[10px] font-black uppercase italic ${p.level > 0 ? 'text-red-500' : 'text-brand-gold'}`}>{p.status}</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1 border border-white/5 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${p.level > 0 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-brand-gold'}`} 
                                    style={{ width: p.level > 0 ? `${p.level}%` : '100%' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 p-6 bg-red-500/5 rounded-[32px] border border-red-500/10">
                <p className="text-[9px] text-stone-500 uppercase font-black leading-relaxed tracking-widest italic text-center">
                    JanIA analiza micro-variaciones en fotos y datos técnicos para detectar anomalías estructurales o estéticas que afecten la depreciación del predio.
                </p>
            </div>
        </section>
    );
};

export default PathologyDetective;
