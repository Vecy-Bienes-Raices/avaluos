import React, { useState } from 'react';

const PricingCards = ({ onSelect, propertyData = {}, filter = ['all'], genericMode = false }) => {
    const [selectionStep, setSelectionStep] = useState(null); // 'cafe' | 'esmeralda' | null

    const handleBuy = (plan) => {
        // Si ya hay estrato en la data (JanIA lo sabe), cobramos directo
        const foundStratum = propertyData.estrato || propertyData.stratum;
        if (foundStratum) {
            const stratum = parseInt(foundStratum);
            let finalAmount = plan.amount;

            if (plan.id === 'cafe') {
                finalAmount = stratum <= 3 ? 29997 : 49997;
            } else if (plan.id === 'esmeralda') {
                finalAmount = stratum <= 3 ? 99997 : 149997;
            } else if (plan.id === 'oro') {
                finalAmount = stratum <= 3 ? 250000 : 350000;
            }

            onSelect({ ...plan, amount: finalAmount });
            return;
        }

        // 3. Si NO hay estrato, mostramos selector en la tarjeta
        setSelectionStep(plan.id);
    };

    const handleStratumSelect = (plan, range) => {
        let finalAmount;
        if (plan.id === 'cafe') {
            finalAmount = range === 'low' ? 29997 : 49997;
        } else if (plan.id === 'esmeralda') {
            finalAmount = range === 'low' ? 99997 : 149997;
        } else if (plan.id === 'oro') {
            finalAmount = range === 'low' ? 250000 : 350000;
        }
        onSelect({ ...plan, amount: finalAmount, stratumRange: range });
        setSelectionStep(null);
    };

    const allPlans = [
        {
            id: 'cafe',
            name: 'Café Express',
            subtitle: 'Sondeo de Mercado Rápido',
            image: '/cafe.png',
            price: 'Desde $29.997',
            features: [
                'Análisis de Mercado Inmediato.',
                'Valor Estratificado (E1-3: $29k | E4-6: $49k).',
                'Reporte PDF con Comparables.',
                '💸 Gana hasta $7.499 por Referido.',
                '🚀 Plan Carrera: Escala a Socio Estratega.'
            ],
            style: {
                cardBg: 'bg-[#5D493A]/15 backdrop-blur-2xl',
                borderColor: 'border-[#A1887F]/80',
                shadow: 'hover:shadow-[0_0_60px_rgba(161,136,127,0.6)]',
                textColor: 'text-[#d7ccc8]',
                priceColor: 'text-[#a1887f]',
                buttonBg: 'bg-[#5D493A] hover:bg-[#8D6E63]',
                buttonText: 'text-[#efebe9]',
                buttonGlow: 'hover:shadow-[0_0_35px_rgba(161,136,127,0.8)]',
                buttonTextShadow: 'drop-shadow-[0_2px_2px_rgba(43,29,22,0.8)]',
                iconColor: 'text-[#937E74]'
            }
        },
        {
            id: 'oro',
            name: 'Oro King',
            subtitle: 'Inteligencia Financiera Avanzada',
            image: '/oro.png',
            price: 'Desde $250.000',
            amount: 0,
            features: [
                'Análisis para Inversionistas PRO.',
                'Valor Estratificado (E1-3: $250k | E4-6: $350k).',
                'Cálculo de Cap Rate y ROI.',
                'Absorción y Proyecciones de Mercado.',
                '👑 Gana 10% Comisión por Referido.'
            ],
            isPopular: true,
            style: {
                cardBg: 'bg-[#CCAC4E]/10 backdrop-blur-2xl',
                borderColor: 'border-[#CCAC4E]/50',
                shadow: 'shadow-[0_0_30px_rgba(204,172,78,0.1)] hover:shadow-[0_0_50px_rgba(204,172,78,0.3)]',
                textColor: 'text-[#CCAC4E]',
                priceColor: 'text-white',
                buttonBg: 'bg-gradient-to-r from-[#CCAC4E] to-[#EAC968] hover:to-[#CCAC4E]',
                buttonText: 'text-white',
                buttonGlow: 'hover:shadow-[0_0_40px_rgba(204,172,78,0.7)]',
                buttonTextShadow: 'drop-shadow-[0_1px_2px_rgba(80,62,51,0.6)]',
                iconColor: 'text-[#CCAC4E]'
            }
        },
        {
            id: 'esmeralda',
            name: 'Esmeralda Plus',
            subtitle: 'Inteligencia de Datos PRO',
            image: '/esmeralda.png',
            price: 'Desde $99.997',
            features: [
                'Analítica PRO de Datos + POT.',
                'Valor Estratificado (E1-3: $99k | E4-6: $149k).',
                'Mapa de Calor y Riesgos.',
                '💸 Gana hasta $12.499 por Referido.',
                '💎 Socio Estratega: Activa Ingresos Pasivos.'
            ],
            style: {
                cardBg: 'bg-[#0DBB83]/10 backdrop-blur-2xl',
                borderColor: 'border-[#0DBB83]/40',
                shadow: 'hover:shadow-[0_0_30px_rgba(13,187,131,0.2)]',
                textColor: 'text-[#0DBB83]',
                priceColor: 'text-white',
                buttonBg: 'bg-[#0DBB83] hover:bg-[#0aa674]',
                buttonText: 'text-white',
                buttonGlow: 'hover:shadow-[0_0_30px_rgba(13,187,131,0.5)]',
                buttonTextShadow: 'drop-shadow-[0_2px_2px_rgba(2,44,34,0.6)]',
                iconColor: 'text-[#0DBB83]'
            }
        }
    ];

    // Filter Logic
    const plansToShow = filter.includes('all')
        ? allPlans
        : allPlans.filter(p => filter.includes(p.id));

    if (plansToShow.length === 0) return null;

    return (
        <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch justify-center p-4 perspective-1000 mt-8">
            {plansToShow.map((plan) => (
                <div
                    key={plan.id}
                    className={`relative w-full max-w-[320px] group transition-all duration-500 hover:-translate-y-2 ${plan.isPopular ? 'md:scale-110 z-10' : 'md:scale-100'}`}
                >
                    {/* Badge */}
                    {plan.isPopular && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#CCAC4E] to-[#EAC968] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(204,172,78,0.4)] z-50 flex items-center gap-1.5 whitespace-nowrap">
                            <span className="drop-shadow-md">RECOMENDADO</span>
                        </div>
                    )}

                    {/* Main Card */}
                    <div className={`relative p-5 rounded-[2rem] border ${plan.style.cardBg} ${plan.style.borderColor} ${plan.style.shadow} flex flex-col overflow-hidden h-full transform transition-transform duration-300`}>

                        {/* STRATUM SELECTOR OVERLAY */}
                        {selectionStep === plan.id ? (
                            <div className="absolute inset-0 z-50 bg-[#0a0a0a]/95 md:bg-black/90 md:backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
                                <h4 className="text-white font-bold text-lg mb-4 text-center">¿Qué Estrato es?</h4>
                                <p className="text-xs text-stone-400 mb-6 text-center">Selecciona para calcular el precio exacto.</p>

                                <button
                                    onClick={() => handleStratumSelect(plan, 'low')}
                                    className={`w-full py-3 mb-3 rounded-xl border ${plan.style.borderColor} ${plan.style.buttonBg} text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform`}
                                >
                                    Estrato 1, 2 o 3
                                    <span className="block text-[10px] opacity-80 font-normal">
                                        ${plan.id === 'cafe' ? '29.997' : plan.id === 'esmeralda' ? '99.997' : '250.000'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleStratumSelect(plan, 'high')}
                                    className={`w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-stone-200 font-bold text-sm shadow-lg hover:scale-105 transition-transform`}
                                >
                                    Estrato 4, 5 o 6
                                    <span className="block text-[10px] opacity-60 font-normal">
                                        ${plan.id === 'cafe' ? '49.997' : plan.id === 'esmeralda' ? '149.997' : '350.000'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setSelectionStep(null)}
                                    className="mt-6 text-[10px] text-stone-500 hover:text-white underline cursor-pointer"
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : null}

                        <div className="relative z-10 mb-3 text-center">
                            <h3 className={`text-xl font-bold font-inter mb-2 ${plan.style.textColor} tracking-tight drop-shadow-sm`}>
                                {plan.name}
                            </h3>

                            <div className="flex justify-center mb-2">
                                <img
                                    src={plan.image}
                                    alt={plan.name}
                                    className="w-12 h-12 object-contain drop-shadow-xl"
                                    onClick={() => handleBuy(plan)} // Clicking image also triggers buy
                                />
                            </div>

                            <p className="text-[10px] md:text-xs font-medium text-stone-300 mb-2 opacity-90 tracking-wide leading-tight px-2">
                                {plan.subtitle}
                            </p>

                            <div className={`flex items-baseline justify-center gap-1 ${genericMode ? 'animate-pulse' : ''}`}>
                                <span className={`text-2xl md:text-3xl font-bold font-inter ${plan.style.priceColor}`}>
                                    {genericMode ? '' : '$'}{plan.price}
                                </span>
                                {!genericMode && <span className="text-white/40 text-[8px] font-bold uppercase tracking-wider">COP</span>}
                            </div>
                            {genericMode && plan.id !== 'cafe' && (
                                <p className="text-[9px] text-stone-400 mt-1 italic">* Depende del Estrato</p>
                            )}
                        </div>

                        <ul className="space-y-1.5 mb-4 flex-grow relative z-10 w-full px-1">
                            {plan.features.map((f, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-xs text-stone-200/90 font-light text-left">
                                    <svg className={`w-3 h-3 flex-shrink-0 mt-0.5 ${plan.style.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <span className="leading-tight">{f}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleBuy(plan)}
                            className={`relative w-full py-2.5 rounded-xl text-[10px] font-bold transition-all duration-300 uppercase tracking-widest transform active:scale-95 ${plan.style.buttonBg} ${plan.style.buttonText} ${plan.style.buttonGlow} border border-white/10 z-10 shadow-lg mt-auto`}
                        >
                            <span className={`relative z-10 ${plan.style.buttonTextShadow}`}>
                                SELECCIONAR ESTRATO
                            </span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PricingCards;
