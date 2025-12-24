import React from 'react';
import { calculatePlanPrice, getFormattedPrice } from '../services/pricingService';

const PricingCards = ({ onSelect, propertyData = {} }) => {
    const dynamicOroPrice = calculatePlanPrice(propertyData);

    const plans = [
        {
            id: 'cafe',
            name: 'Plan Café',
            subtitle: 'Sondeo Digital Inmediato',
            image: '/cafe.png',
            price: '49.000',
            amount: 49000,
            features: [
                'Acceso 24/7.',
                'Sondeo de mercado 2025.',
                'Rango de valor por IA.',
                'Entrega ágil vía chat.'
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
            name: 'Plan Oro',
            subtitle: 'Informe Inteligente PRO',
            image: '/oro.png',
            price: getFormattedPrice(dynamicOroPrice),
            amount: dynamicOroPrice,
            features: [
                'Todo lo del Plan Café +',
                'Analítica de Mercado (CMA).',
                'Análisis POT y Catastro.',
                'Descarga PDF Técnico.',
                'Sugerencia de Valor Real.'
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
            name: 'Plan Esmeralda',
            subtitle: 'Avalúo Certificado RAA',
            image: '/esmeralda.png',
            price: '299.000',
            amount: 299000,
            features: [
                'Todo lo del Plan Oro +',
                'Firma de Perito Oficial.',
                'Visita técnica en sitio.',
                'Análisis Jurídico Profundo.',
                'Proyección Plusvalía 5 años.'
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

    return (
        <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch justify-center p-4 perspective-1000 mt-8">
            {plans.map((plan) => (
                <div
                    key={plan.id}
                    className={`relative w-full max-w-[320px] group transition-all duration-500 hover:-translate-y-2 ${plan.isPopular ? 'md:scale-110 z-10' : 'md:scale-100'}`}
                    onClick={() => onSelect(plan)}
                >
                    {/* Badge */}
                    {plan.isPopular && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#CCAC4E] to-[#EAC968] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(204,172,78,0.4)] z-50 flex items-center gap-1.5 whitespace-nowrap">
                            <span className="drop-shadow-md">RECOMENDADO</span>
                        </div>
                    )}

                    {/* Main Card */}
                    <div className={`relative p-5 rounded-[2rem] border ${plan.style.cardBg} ${plan.style.borderColor} ${plan.style.shadow} flex flex-col overflow-hidden h-full transform transition-transform duration-300`}>
                        <div className="relative z-10 mb-3 text-center">
                            <h3 className={`text-xl font-bold font-outfit mb-2 ${plan.style.textColor} tracking-tight drop-shadow-sm`}>
                                {plan.name}
                            </h3>

                            <div className="flex justify-center mb-2">
                                <img
                                    src={plan.image}
                                    alt={plan.name}
                                    className="w-12 h-12 object-contain drop-shadow-xl"
                                />
                            </div>

                            <p className="text-[10px] md:text-xs font-medium text-stone-300 mb-2 opacity-90 tracking-wide leading-tight px-2">
                                {plan.subtitle}
                            </p>

                            <div className="flex items-baseline justify-center gap-1">
                                <span className={`text-2xl md:text-3xl font-bold font-outfit ${plan.style.priceColor}`}>${plan.price}</span>
                                <span className="text-white/40 text-[8px] font-bold uppercase tracking-wider">COP</span>
                            </div>
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

                        <button className={`relative w-full py-2.5 rounded-xl text-[10px] font-bold transition-all duration-300 uppercase tracking-widest transform active:scale-95 ${plan.style.buttonBg} ${plan.style.buttonText} ${plan.style.buttonGlow} border border-white/10 z-10 shadow-lg mt-auto`}>
                            <span className={`relative z-10 ${plan.style.buttonTextShadow}`}>ELEGIR PLAN</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PricingCards;
