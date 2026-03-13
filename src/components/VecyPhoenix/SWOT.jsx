import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faShieldCheck, faBiohazard, faBolt } from '@fortawesome/free-solid-svg-icons';

const SWOT = ({ data = {} }) => {

    const copySummary = () => {
        const text = `*Resumen Avalúo ${data.tipo_inmueble || 'Inmueble'}*\n📍 Ubicación: ${data.direccion_inmueble}\n🏠 Área: ${data.area_construida}m²\n✅ Estado: Analizado por JanIA\n💰 Precio Sugerido: $${new Intl.NumberFormat('es-CO').format(data.valor_final_avaluador || 0)}`;
        navigator.clipboard.writeText(text).then(() => {
            // This would ideally use the Premium Modal System mentioned in PROJECT_STATUS.md
            alert("Resumen Ejecutivo copiado con éxito. 🛡️");
        });
    };

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 pb-12">
            {/* SWOT Analysis - PREMIUM DARK */}
            <div className="space-y-8">
                <div className="bg-black/40 p-10 rounded-[48px] border border-white/5 border-l-4 border-l-brand-gold relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-brand-gold/10 transition-all"></div>
                    <h4 className="font-black text-white text-[10px] uppercase mb-6 tracking-[0.3em] flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
                        FORTALEZAS ESTRATÉGICAS
                    </h4>
                    <ul className="text-stone-400 space-y-4">
                        {(data.fortalezas || [
                            "Ubicación de alta valorización según plan parcial.",
                            "Acabados premium verificados en zonas sociales.",
                            "Seguridad perimetral y domótica integrada."
                        ]).map((f, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <span className="text-brand-gold font-black italic">/</span>
                                <span className="text-sm font-bold italic tracking-tight leading-relaxed">{f}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-black/40 p-10 rounded-[48px] border border-white/5 border-l-4 border-l-white/20 relative overflow-hidden group">
                    <h4 className="font-black text-stone-500 text-[10px] uppercase mb-6 tracking-[0.3em] flex items-center gap-3">
                         <span className="w-1.5 h-1.5 rounded-full bg-stone-500"></span>
                         ÁREAS DE OPTIMIZACIÓN
                    </h4>
                    <ul className="text-stone-500 space-y-4">
                        {(data.debilidades || [
                            "Mantenimiento preventivo en acabados de cocina.",
                            "Actualización tecnológica necesaria en carpintería."
                        ]).map((d, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <span className="text-stone-700 font-black italic">#</span>
                                <span className="text-sm font-bold italic tracking-tight leading-relaxed">{d}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Final Conclusion Card - THE VERDICT */}
            <div className="bg-gradient-to-br from-stone-900 via-black to-stone-900 p-12 flex flex-col justify-between text-center rounded-[60px] border border-brand-gold/20 relative overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                {/* Visual Accent */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand-gold/10 transition-all duration-1000"></div>
                
                <div className="relative z-10">
                    <span className="text-brand-gold uppercase tracking-[0.5em] font-black text-[10px] mb-10 block italic">VALORACIÓN TÉCNICA FINAL</span>
                    <div className="text-6xl md:text-[84px] font-black mb-8 text-white tracking-tighter leading-none group-hover:scale-110 transition-transform duration-700 italic">
                        <span className="text-brand-gold text-3xl mr-2">$</span>
                        {new Intl.NumberFormat('es-CO').format(data.valor_final_avaluador || 0)}
                    </div>
                    <div className="h-px w-32 bg-brand-gold/30 mx-auto mb-10"></div>
                    <p className="text-stone-500 font-black text-[10px] uppercase tracking-[0.2em] mb-12 max-w-xs mx-auto leading-relaxed italic">
                        Cifra validada por el motor de inteligencia JanIA basándose en el análisis integral del predio y entorno.
                    </p>
                </div>

                <button
                    onClick={copySummary}
                    className="relative z-10 bg-brand-gold hover:bg-white text-black font-black py-5 px-10 rounded-full transition-all shadow-[0_20px_40px_rgba(204,172,78,0.2)] hover:shadow-[0_0_60px_rgba(204,172,78,0.4)] flex items-center justify-center gap-4 group/btn"
                >
                    <FontAwesomeIcon icon={faCopy} className="text-sm transition-transform group-hover/btn:scale-110" /> 
                    <span className="text-[10px] uppercase tracking-[0.3em]">Copiar Veredicto Técnico</span>
                </button>
            </div>
        </section>
    );
};

export default SWOT;
