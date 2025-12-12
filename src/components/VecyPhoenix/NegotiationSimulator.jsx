
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faHandHoldingDollar, faExpand } from '@fortawesome/free-solid-svg-icons';

const NegotiationSimulator = () => {
    // Owner's Accepted Listing Price: 375M (Down from 410M proposal)
    const listPrice = 375000000;
    const fairValue = 350000000;
    const minPrice = 300000000;

    // Initial State: Start at the Listing Price (375M)
    const [price, setPrice] = useState(listPrice);
    const [status, setStatus] = useState({
        msg: 'Precio Base Sugerido',
        colorClass: 'text-emerald-400',
        boxClass: 'bg-emerald-500/10 border-emerald-500/30',
        feedback: ''
    });
    const [gap, setGap] = useState(0);

    useEffect(() => {
        // Gap from Listing Price (375M)
        const diff = listPrice - price;
        const discountPct = ((diff / listPrice) * 100).toFixed(1);
        setGap(discountPct);

        if (price >= 350000000) {
            setStatus({
                msg: "Oferta Viable / Aceptable",
                colorClass: "text-emerald-300 font-extrabold text-shadow-black text-xl",
                boxClass: "bg-emerald-900/80 border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]",
                feedback: "Zona Verde: Precio alineado con la expectativa del propietario ($350M - $375M)."
            });
        } else if (price >= 330000000) {
            setStatus({
                msg: "Oferta Agresiva",
                colorClass: "text-amber-300 font-extrabold text-shadow-black text-xl",
                boxClass: "bg-amber-900/80 border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]",
                feedback: "Zona Amarilla: Requiere negociación fuerte. Margen ajustado."
            });
        } else {
            setStatus({
                msg: "Riesgo de Rechazo",
                colorClass: "text-red-300 font-extrabold text-shadow-black text-xl",
                boxClass: "bg-red-900/80 border-2 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)]",
                feedback: "Zona Roja: Oferta por debajo del límite técnico. Probable no aceptación."
            });
        }
    }, [price]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <section id="valuation" className="mt-12 mb-16 px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-accent mb-8 text-center tracking-tight text-shadow-volcanic">Análisis de Valor Comercial</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Context & Logic */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Insight Card: The Strategy */}
                    <div className="glass-panel bg-white/10 p-5 border-l-4 border-l-emerald-500 relative overflow-hidden">
                        <div className="flex items-start gap-4">
                            <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-500 min-w-[50px] flex justify-center">
                                <FontAwesomeIcon icon={faHandHoldingDollar} className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-bold text-emerald-400 mb-1 text-sm uppercase tracking-wider text-shadow-black">Ajuste de Precio</h4>
                                <p className="text-xs text-stone-200 leading-relaxed font-medium text-shadow-black">
                                    Propietario propuso <span className="text-red-400 line-through">$410M</span>. Se ajustó a <strong className="text-emerald-400">$375M</strong> como base comercial para ser competitivos.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Insight Card: Reality Check */}
                    <div className="glass-panel bg-white/10 p-5 border-l-4 border-l-amber-500 relative overflow-hidden">
                        <div className="flex items-start gap-4">
                            <div className="bg-amber-500/20 p-3 rounded-full text-amber-400 min-w-[50px] flex justify-center">
                                <FontAwesomeIcon icon={faExpand} className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-400 mb-1 text-sm uppercase tracking-wider text-shadow-black">Objetivo Técnico</h4>
                                <p className="text-xs text-stone-200 leading-relaxed font-medium text-shadow-black">
                                    El cierre ideal se estima en <strong className="text-white">$350M</strong>, considerando la antigüedad (35 años) y el área no financiable.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Unified Simulator */}
                <div className="lg:col-span-8 glass-panel bg-white/10 p-6 md:p-8 text-white relative overflow-hidden flex flex-col justify-center">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center relative z-10 text-shadow-volcanic justify-center md:justify-start">
                        <div className="bg-white/10 p-2 rounded-lg mr-3 backdrop-blur-sm hidden md:block">
                            <FontAwesomeIcon icon={faCalculator} className="text-brand-accent" />
                        </div>
                        Simulador de Cierre
                    </h3>

                    <div className="mb-8 relative z-10 px-2">
                        <div className="flex justify-between text-[0.65rem] md:text-xs font-bold uppercase tracking-widest mb-3 text-stone-400 text-shadow-black">
                            <span className="text-emerald-400">Objetivo $350M</span>
                            <span className="text-amber-400">Lista $375M</span>
                        </div>

                        {/* Custom Slider Style */}
                        <style>
                            {`
                                input[type=range]::-webkit-slider-thumb {
                                    -webkit-appearance: none;
                                    height: 24px;
                                    width: 24px;
                                    border-radius: 50%;
                                    background: #D4AF37; /* Gold */
                                    cursor: pointer;
                                    box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
                                    margin-top: -8px;
                                }
                                input[type=range]::-moz-range-thumb {
                                    height: 24px;
                                    width: 24px;
                                    border-radius: 50%;
                                    background: #D4AF37;
                                    cursor: pointer;
                                    border: none;
                                    box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
                                }
                                input[type=range]::-webkit-slider-runnable-track {
                                    width: 100%;
                                    height: 8px;
                                    cursor: pointer;
                                    background: rgba(255,255,255,0.1);
                                    border-radius: 5px;
                                }
                            `}
                        </style>

                        <div className="relative group mt-6">
                            <input
                                type="range"
                                id="priceSlider"
                                min={minPrice}
                                max={listPrice}
                                step="1000000"
                                value={price}
                                onChange={(e) => setPrice(parseInt(e.target.value))}
                                className="mb-2 w-full bg-transparent appearance-none cursor-pointer relative z-10"
                            />
                            {/* Pulse Hint Animation - Centered above thumb */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-10 animate-bounce text-gold-400 text-xs font-bold flex items-center gap-1 pointer-events-none opacity-90 z-20">
                                <span className="bg-brand-accent text-slate-900 px-3 py-1 rounded-full text-[0.6rem] uppercase tracking-wider shadow-lg border border-white/20">
                                    <FontAwesomeIcon icon={faHandHoldingDollar} className="mr-1" />
                                    ¡Desliza!
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between text-[0.55rem] uppercase font-bold text-slate-300 mt-2 px-1 gap-1 text-shadow-black">
                            <span className="text-red-400">Oferta Baja</span>
                            <span className="text-amber-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                                Negociable
                            </span>
                            <span className="text-emerald-400">Zona Segura</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center relative z-10">
                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 flex flex-col justify-center items-center h-full min-h-[100px]">
                            <div className="text-[0.55rem] text-stone-400 text-shadow-black uppercase tracking-widest font-bold mb-1">Precio Simulado</div>
                            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-shadow-black tracking-tight whitespace-nowrap">{formatCurrency(price)}</div>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 flex flex-col justify-center items-center h-full min-h-[100px]">
                            <div className="text-[0.55rem] text-stone-400 text-shadow-black uppercase tracking-widest font-bold mb-1">Descuento</div>
                            <div className="text-2xl md:text-4xl font-bold text-brand-accent text-shadow-volcanic">{gap}%</div>
                        </div>
                        <div className={`rounded-2xl p-4 col-span-1 border transition-all duration-300 ${status.boxClass} flex flex-col justify-center items-center min-h-[100px]`}>
                            <div className="text-[0.65rem] text-stone-300 text-shadow-black uppercase tracking-widest font-bold mb-1 opacity-80">Diagnóstico</div>
                            <div className={`text-base md:text-lg font-bold leading-tight ${status.colorClass}`}>{status.msg}</div>
                        </div>
                    </div>
                    <p className="text-xs mt-4 text-center font-bold text-stone-200 italic px-4 text-shadow-black bg-black/20 p-2 rounded-lg">
                        {status.feedback}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NegotiationSimulator;
