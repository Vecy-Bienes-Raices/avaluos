import React from 'react';

const RewardModelCard = ({ onSelect, user }) => {
    const referralLink = user?.id
        ? `${window.location.origin}/?ref=${user.id}`
        : "Inicia sesión para ver tu link";

    const copyToClipboard = () => {
        if (user?.id) {
            navigator.clipboard.writeText(referralLink);
            // Simple visual feedback could be added here
        }
    };

    return (
        <div className="w-full max-w-2xl mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
            <div className="bg-[#141210] md:bg-black/80 md:backdrop-blur-2xl border border-brand-gold/20 md:border-brand-gold/30 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:shadow-2xl relative">
                <div className="absolute top-0 right-0 p-6 opacity-20">
                    <span className="text-4xl text-brand-gold">💰</span>
                </div>

                <h2 className="text-xl md:text-2xl font-black font-inter text-brand-gold mb-2 uppercase tracking-widest">
                    ¿Quieres que tu avalúo sea GRATIS? 💸
                </h2>
                <p className="text-stone-300 text-xs md:text-sm font-light leading-relaxed mb-6">
                    Únete a <strong>Vecy Network</strong>. Convierte tus contactos en una fuente de ingresos pasivos y recupera tu inversión.
                </p>

                {/* --- SECCIÓN LINK DE REFERIDO --- */}
                <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <p className="text-[10px] text-brand-gold uppercase font-bold mb-1">Tu Enlace de Socio:</p>
                        <code className="block w-full bg-black/50 border border-white/10 rounded-lg p-3 text-emerald-400 font-mono text-xs truncate">
                            {referralLink}
                        </code>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="bg-brand-gold text-black font-bold text-xs px-4 py-3 rounded-lg hover:bg-white transition-colors uppercase"
                    >
                        Copiar Link
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
                    {/* Ganancias Directas */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <h3 className="text-brand-gold font-bold text-xs uppercase mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
                            Ganancias Directas
                        </h3>
                        <div className="space-y-2 text-[10px] md:text-xs">
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-stone-400">Plan Café</span>
                                <span className="text-emerald-400 font-bold">+$4.997 - $7.499</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-stone-400">Plan Esmeralda</span>
                                <span className="text-emerald-400 font-bold">+$9.997 - $12.499</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-400">Oro King</span>
                                <span className="text-emerald-400 font-bold">10% Neto</span>
                            </div>
                        </div>
                    </div>

                    {/* Meta 6 Amigos */}
                    <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] text-brand-gold font-bold uppercase mb-1">Tu Meta Inmediata</p>
                        <div className="text-3xl font-black text-white">6 AMIGOS</div>
                        <div className="text-[10px] text-emerald-400 font-bold mt-1 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/30">
                            = ¡AVALÚO GRATIS!
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-4 rounded-xl border border-emerald-500/20 mb-6">
                    <p className="text-[10px] text-stone-300">
                        <strong>Regalías Eternas:</strong> Pagos semanales, sin límites de referidos y de por vida. ¡Así crece el ecosistema!
                    </p>
                </div>

                <button
                    onClick={() => onSelect && onSelect('start_now')}
                    className="w-full py-3.5 bg-gradient-to-r from-black via-neutral-900 to-black border border-brand-gold/50 text-brand-gold font-black uppercase tracking-widest rounded-xl transition-all hover:bg-brand-gold hover:text-black hover:shadow-[0_0_20px_rgba(204,172,78,0.4)] active:scale-95 shadow-lg"
                >
                    EMPEZAR AHORA 🚀
                </button>
            </div>
        </div>
    );
};

export default RewardModelCard;
