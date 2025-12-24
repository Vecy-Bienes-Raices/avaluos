import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faFileSignature, faAward } from '@fortawesome/free-solid-svg-icons';

const AppraiserCertification = ({ appraiser = {} }) => {
    // Default values if not provided (Master Appraiser Jani Alves Souza)
    const {
        name = 'Jani Alves Souza',
        title = 'Avaluador Profesional Especializado',
        raa = 'Registro RAA: 16718-2025',
        profile_image = 'https://ui-avatars.com/api/?name=Jani+Alves&background=CCAC4E&color=fff', // Usar avatar dinámico por ahora
        signature_image = 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Hancock_Signature.png' // Firma placeholder visible
    } = appraiser;

    return (
        <section className="mt-16 mb-20 p-8 glass-panel bg-white/10 border-brand-accent/30 relative overflow-hidden backdrop-blur-2xl min-h-[300px] flex flex-col justify-center">
            {/* Background Decorative Stamp */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <FontAwesomeIcon icon={faCertificate} className="text-[20rem] text-brand-accent" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                {/* Left Side: Photo and Titles */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-brand-accent/40 overflow-hidden shadow-2xl">
                            <img src={profile_image} alt={name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-brand-accent text-black p-2 rounded-full shadow-lg border-2 border-slate-900">
                            <FontAwesomeIcon icon={faAward} />
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-2xl font-black text-white text-shadow-volcanic tracking-tighter mb-1">{name}</h4>
                        <p className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-2 opacity-90">{title}</p>
                        <div className="inline-block px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[10px] text-stone-300 font-bold tracking-widest uppercase">
                            {raa}
                        </div>
                    </div>
                </div>

                {/* Right Side: Certification & Signature */}
                <div className="flex flex-col items-center md:items-end gap-4 text-center md:text-right max-w-sm">
                    <div className="space-y-2">
                        <p className="text-stone-400 text-[10px] leading-relaxed italic uppercase tracking-wider font-medium">
                            CERTIFICACIÓN: El presente documento constituye un concepto técnico profesional emitido bajo estándares de valoración de la Lonja Digital de Vecy.
                        </p>
                    </div>
                    <div className="mt-4 relative group">
                        <img src={signature_image} alt="Firma Profesional" className="h-16 md:h-20 object-contain drop-shadow-xl brightness-125" />
                        <div className="h-[1px] w-full bg-stone-500 mt-2 opacity-50"></div>
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mt-2 block">Sello Digital Verificado</span>
                    </div>
                </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                <div className="text-[9px] text-stone-500 uppercase font-black tracking-widest flex items-center gap-2">
                    <FontAwesomeIcon icon={faFileSignature} className="text-brand-accent text-[12px]" />
                    ID Certificado: VECY-AR-PORTALES-2025
                </div>
                <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    Válido para Trámites Particulares
                </div>
            </div>
        </section>
    );
};

export default AppraiserCertification;
