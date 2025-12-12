import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-12 px-4 pb-8">
            <div className="max-w-6xl mx-auto rounded-3xl shadow-2xl backdrop-blur-xl border border-white/10 bg-gradient-to-br from-stone-900/70 via-stone-950/70 to-black/70 py-8 px-4 text-center text-slate-400 text-sm">
                <div className="flex justify-center items-center mb-4">
                    <div className="h-px w-12 bg-brand-accent shadow-[0_0_8px_rgba(217,119,6,0.8)]"></div>
                    <span className="mx-4 text-xs tracking-[0.2em] font-bold uppercase text-brand-accent drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]">Vecy Bienes Raíces</span>
                    <div className="h-px w-12 bg-brand-accent shadow-[0_0_8px_rgba(217,119,6,0.8)]"></div>
                </div>
                <p className="font-medium text-slate-300">Departamento de Análisis Inmobiliario</p>
                <p className="mt-2 text-xs text-stone-400 text-shadow-black opacity-80">Informe generado por Agente JanIA | Asistente Inteligente v2.0</p>
            </div>
        </footer>
    );
};

export default Footer;
