import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const SWOT = () => {

    const copySummary = () => {
        const text = `*Resumen Avalúo Portales del Norte*\n📍 Ubicación: Cra 65 # 167-18\n🏠 Área: 72m² (3 Niveles)\n✅ Estado: Remodelado (Cocina/Baño Ppal)\n💰 Precio Base: $375.000.000\n📉 Cierre Estimado: $350.000.000\n⚖️ Documentación: Saneada 100%`;
        navigator.clipboard.writeText(text).then(() => {
            alert("Resumen copiado al portapapeles.");
        });
    };

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pb-12">
            {/* SWOT Analysis */}
            <div className="space-y-6">
                <div className="glass-panel bg-white/10 p-8 border-l-[6px] border-l-emerald-400">
                    <h4 className="font-bold text-emerald-700 text-sm uppercase mb-4 tracking-wider flex items-center text-shadow-black">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                        Fortalezas
                    </h4>
                    <ul className="text-sm text-stone-300 text-shadow-black space-y-3">
                        <li className="flex items-start"><span className="mr-2 text-emerald-400 text-shadow-volcanic">✓</span> Cocina y baño principal remodelados con acabados premium.</li>
                        <li className="flex items-start"><span className="mr-2 text-emerald-400 text-shadow-volcanic">✓</span> Ubicación estratégica (Mazurén/Calle 170) de alta valorización.</li>
                        <li className="flex items-start"><span className="mr-2 text-emerald-400 text-shadow-volcanic">✓</span> Documentación 100% saneada lista para escrituración.</li>
                    </ul>
                </div>
                <div className="glass-panel bg-white/10 p-8 border-l-[6px] border-l-red-400 opacity-90">
                    <h4 className="font-bold text-red-500 text-sm uppercase mb-4 tracking-wider flex items-center text-shadow-black">
                        <div className="w-2 h-2 rounded-full bg-red-400 mr-2 shadow-[0_0_8px_rgba(248,113,113,0.8)]"></div>
                        Debilidades (Objeciones)
                    </h4>
                    <ul className="text-sm text-stone-300 text-shadow-black space-y-3">
                        <li className="flex items-start"><span className="mr-2 text-red-400 text-shadow-volcanic">•</span> Requiere mantenimiento de pintura locativa en áreas generales.</li>
                        <li className="flex items-start"><span className="mr-2 text-red-400 text-shadow-volcanic">•</span> Baño auxiliar con acabados estándar (Originales).</li>
                    </ul>
                </div>
            </div>

            {/* Final Conclusion Card */}
            <div className="glass-panel bg-white/10 p-10 flex flex-col justify-center text-center relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                {/* Glow Effects */}
                <div className="absolute top-0 left-1/2 -ml-32 w-64 h-64 bg-brand-accent/20 rounded-full blur-[80px] pointer-events-none"></div>

                <h3 className="text-brand-accent uppercase tracking-[0.3em] font-bold text-xs mb-6 relative z-10 text-shadow-black">Conclusión Final</h3>
                <div className="text-5xl md:text-6xl font-extrabold mb-4 text-brand-emerald text-shadow-volcanic tracking-tighter relative z-10"><span className="text-brand-accent">$</span>375.000.000</div>
                <p className="text-stone-300 text-shadow-black text-sm mb-8 leading-relaxed max-w-sm mx-auto relative z-10">Precio ajustado desde la propuesta inicial de $410M. Permite margen de negociación hacia el valor técnico de $350M.</p>

                <button
                    onClick={copySummary}
                    className="relative z-10 bg-brand-accent hover:bg-[#dcb95b] text-white font-bold py-4 px-8 rounded-full transition-all shadow-[0_4px_15px_rgba(204,172,78,0.4)] hover:shadow-[0_0_25px_rgba(204,172,78,0.6)] flex items-center justify-center mx-auto w-full md:w-auto transform active:scale-95 text-shadow-black border border-white/10"
                >
                    <FontAwesomeIcon icon={faCopy} className="mr-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]" /> Copiar Resumen Ejecutivo
                </button>
            </div>
        </section>
    );
};

export default SWOT;
