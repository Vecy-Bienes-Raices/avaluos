import React from 'react';

const PricingCards = ({ onSelect }) => {
    const plans = [
        {
            id: 'free',
            name: 'Plan Café',
            subtitle: 'Sondeo Digital Inmediato',
            image: '/cafe.png',
            price: '0',
            features: [
                'Acceso Gratuito 24/7.',
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
            id: 'certified',
            name: 'Plan Oro',
            subtitle: 'Avalúo Certificado RAA',
            image: '/oro.png',
            price: '380.000',
            features: [
                'Todo lo del Plan Esmeralda +',
                'Firma de Perito Oficial.',
                'Visita técnica en sitio.',
                'Plena validez legal.',
                'Asesoría Normativa NIIF.',
                'Recomendaciones de Valor.'
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
            id: 'platinum',
            name: 'Plan Esmeralda',
            subtitle: 'Informe Inteligente Pro',
            image: '/esmeralda.png',
            price: '49.900',
            features: [
                'Todo lo del Plan Café +',
                'Análisis de oferta real.',
                'Muestra de comparables.',
                'Descarga PDF + Link URL.'
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
        <div className="w-full flex flex-col md:flex-row gap-10 md:gap-12 items-center md:items-stretch justify-center p-4 perspective-1000 mt-16">
            {plans.map((plan) => (
                <div
                    key={plan.id}
                    className={`relative w-[92%] max-w-[400px] md:max-w-[380px] group transition-all duration-500 hover:-translate-y-2 ${plan.isPopular ? 'md:scale-110 z-10' : 'md:scale-100'}`}
                    onClick={() => onSelect(plan.id)}
                >
                    {/* Badge */}
                    {plan.isPopular && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#CCAC4E] to-[#EAC968] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(204,172,78,0.4)] z-50 flex items-center gap-1.5 whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 drop-shadow-sm text-white">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                            <span className="drop-shadow-md">Recomendado</span>
                        </div>
                    )}

                    {/* Main Card */}
                    <div className={`relative p-5 rounded-[2rem] border ${plan.style.cardBg} ${plan.style.borderColor} ${plan.style.shadow} flex flex-col overflow-hidden h-full transform transition-transform duration-300`}>
                        {/* Glass Highlight */}
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                        <div className="relative z-10 mb-3 text-center">
                            <h3 className={`text-2xl font-bold font-outfit mb-2 ${plan.style.textColor} tracking-tight drop-shadow-sm`}>
                                {plan.name}
                            </h3>

                            <div className="flex justify-center mb-2">
                                <img
                                    src={plan.image}
                                    alt={`${plan.name} distintivo`}
                                    className="w-14 h-14 object-contain drop-shadow-xl transition-transform duration-500 hover:scale-110"
                                />
                            </div>

                            <p className="text-sm font-medium text-stone-300 mb-2 opacity-90 tracking-wide leading-tight px-2">
                                {plan.subtitle}
                            </p>

                            <div className="flex items-baseline justify-center gap-1">
                                <span className={`text-3xl md:text-4xl font-bold font-outfit ${plan.style.priceColor} drop-shadow-md`}>${plan.price}</span>
                                <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-wider ml-1">COP</span>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3" />

                        <ul className="space-y-2 mb-4 flex-grow relative z-10 w-full px-1">
                            {plan.features.map((f, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-stone-200/90 font-light text-left">
                                    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.id === 'certified' ? 'text-[#CCAC4E] drop-shadow-[0_0_5px_rgba(204,172,78,0.4)]' : plan.style.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <span className="leading-tight text-xs md:text-sm">{f}</span>
                                </li>
                            ))}
                        </ul>

                        <button className={`relative w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 uppercase tracking-widest transform active:scale-95 ${plan.style.buttonBg} ${plan.style.buttonText} ${plan.style.buttonGlow} border border-white/10 z-10 overflow-hidden shadow-lg mt-auto`}>
                            <span className={`relative z-10 ${plan.style.buttonTextShadow}`}>Tomar Plan</span>
                        </button>

                        <div className={`absolute -inset-1 ${plan.id === 'certified' ? 'bg-[#CCAC4E]/10' : (plan.id === 'platinum' ? 'bg-[#0DBB83]/10' : 'bg-[#5D493A]/10')} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-0`} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PricingCards;
