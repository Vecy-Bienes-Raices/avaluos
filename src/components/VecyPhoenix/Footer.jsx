import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    const message = "👋 ¡Hola! Me gustaría que🫰evaluaran esta propiedad ... 🏠 . Mi nombre es ... 👤";
    const whatsappUrl = `https://wa.me/573166569719?text=${encodeURIComponent(message)}`;

    return (
        <footer className="mt-12 px-4 pb-8">
            <div className="max-w-6xl mx-auto rounded-3xl shadow-2xl backdrop-blur-xl border border-white/10 bg-gradient-to-br from-stone-900/90 via-stone-950/90 to-black/90 py-6 px-6 md:px-12 text-slate-400 text-sm flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 relative overflow-hidden">

                {/* 1. Left: Animated Logo */}
                <div className="flex-shrink-0 order-1 md:order-1 relative z-10">
                    <img
                        src="/animacion-vecy-blanco.gif"
                        alt="Vecy Logo"
                        className="w-16 h-auto opacity-90 hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none"
                    />
                </div>

                {/* 2. Center: Branding Text */}
                <div className="text-center order-2 md:order-2 flex flex-col items-center relative z-10 md:absolute md:left-1/2 md:-translate-x-1/2 w-full md:w-auto">
                    <div className="flex justify-center items-center mb-2">
                        <div className="h-px w-8 bg-brand-accent shadow-[0_0_8px_rgba(217,119,6,0.8)]"></div>
                        <span className="mx-3 text-[0.65rem] tracking-[0.2em] font-bold uppercase text-brand-accent drop-shadow-[0_0_8px_rgba(217,119,6,0.8)] whitespace-nowrap">Vecy Bienes Raíces</span>
                        <div className="h-px w-8 bg-brand-accent shadow-[0_0_8px_rgba(217,119,6,0.8)]"></div>
                    </div>
                    <p className="font-medium text-slate-300 text-xs">Departamento de Análisis Inmobiliario</p>
                    <p className="mt-1 text-[0.6rem] text-stone-500 font-mono opacity-60">Agente JanIA v2.0</p>
                </div>

                {/* 3. Right: WhatsApp CTA */}
                <div className="flex-shrink-0 order-3 md:order-3 relative z-10">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-green-400/30 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]"
                    >
                        <div className="bg-green-500/10 p-1.5 rounded-full group-hover:bg-green-500/20 transition-colors">
                            <FontAwesomeIcon icon={faWhatsapp} className="text-[#00ff22] text-xl md:text-2xl drop-shadow-[0_0_5px_rgba(0,255,34,0.6)]" />
                        </div>
                        <div className="text-left leading-none">
                            <div className="text-[0.6rem] text-stone-400 uppercase tracking-wider font-bold mb-0.5 group-hover:text-stone-300 transition-colors">Contáctanos</div>
                            <div className="text-[#00ff22] font-bold font-mono tracking-wide text-sm md:text-base group-hover:text-green-300 transition-colors text-shadow-black">
                                +57 316 656 9719
                            </div>
                        </div>
                    </a>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
