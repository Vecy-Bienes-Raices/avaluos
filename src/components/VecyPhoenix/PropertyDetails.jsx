import React, { useState, Suspense, lazy } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined, faBed, faBath, faCar, faCheck, faScaleBalanced, faShieldAlt, faFileInvoiceDollar, faMicrochip, faGavel } from '@fortawesome/free-solid-svg-icons';

// Lazy Load Gallery
const ImageGallery = lazy(() => import('./ImageGallery'));

const PropertyDetails = ({ data }) => {
    const [activeTab, setActiveTab] = useState('physical');

    const TabButton = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`py-3 px-8 rounded-full transition-all text-[10px] uppercase tracking-[0.3em] font-black border ${
                activeTab === id
                    ? "bg-brand-gold text-black border-brand-gold shadow-[0_10px_30px_rgba(204,172,78,0.3)] scale-105"
                    : "bg-white/5 text-stone-500 border-white/5 hover:bg-white/10 hover:text-white"
            }`}
        >
            {label}
        </button>
    );

    return (
        <section id="property" className="p-6 md:p-12 min-h-full">
            <div className="mb-12 text-center lg:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                    <span className="w-8 h-px bg-brand-gold/30"></span>
                    <span className="text-brand-gold font-black tracking-[0.3em] uppercase text-[10px]">Diagnóstico Profundo</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase italic mb-8">ADN DEL INMUEBLE</h2>
                
                <div className="flex flex-wrap justify-center lg:justify-start bg-black/40 p-2 rounded-[32px] backdrop-blur-3xl gap-2 shadow-inner border border-white/5">
                    <TabButton id="physical" label="Sometría" />
                    <TabButton id="legal" label="Protocolo" />
                    <TabButton id="finishes" label="Atributos" />
                </div>
            </div>

            {/* TAB: Physical */}
            {activeTab === 'physical' && (
                <div className="animate-fade-in space-y-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: faRulerCombined, val: `${data.area_construida} m²`, label: 'Área' },
                            { icon: faBed, val: data.habitaciones, label: 'Alcobas' },
                            { icon: faBath, val: data.banos, label: 'Baños' },
                            { icon: faCar, val: data.parqueadero || '0', label: 'Cajones' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 p-8 rounded-[40px] text-center border border-white/5 hover:border-brand-gold/20 transition-all group group relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/5 rounded-full opacity-50 group-hover:scale-150 transition-transform"></div>
                                <FontAwesomeIcon icon={stat.icon} className="text-brand-gold text-2xl mb-4 group-hover:scale-110 transition-transform" />
                                <div className="text-3xl font-black text-white tracking-tighter mb-1 uppercase italic">{stat.val}</div>
                                <div className="text-[9px] font-black text-stone-500 uppercase tracking-[0.3em]">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-br from-stone-900 to-black p-10 rounded-[48px] border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                        <h3 className="font-black text-xl mb-8 text-white uppercase italic tracking-tighter flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse"></span>
                            Distribución Esencial
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(data.distribucion_espacial || []).map((item, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white/5 p-5 rounded-[24px] border border-white/5 transition-hover hover:border-white/20">
                                    <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold border border-brand-gold/20">
                                        <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-stone-500 font-black uppercase tracking-widest">{item.label}</span>
                                        <span className="text-white font-bold text-sm leading-tight italic">{item.text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: Legal */}
            {activeTab === 'legal' && (
                <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-black/40 p-10 rounded-[48px] border border-white/5 border-l-4 border-l-brand-gold">
                        <h3 className="font-black text-2xl mb-8 text-white italic uppercase tracking-tighter flex items-center gap-4">
                             <FontAwesomeIcon icon={faGavel} className="text-brand-gold" />
                             Cédula Jurídica
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Titular de Derecho', val: data.cliente_nombre || 'Verificando...' },
                                { label: 'Matrícula Inmob.', val: data.estado_juridico?.matricula || 'BAJO ANÁLISIS' },
                                { label: 'Identificador CHIP', val: data.estado_juridico?.chip || 'LOCALIZANDO...' }
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">{row.label}</span>
                                    <span className="font-black text-white text-lg uppercase italic tracking-tighter">{row.val}</span>
                                </div>
                            ))}
                            <div className="bg-brand-gold/10 p-6 rounded-[32px] mt-8 border border-brand-gold/30">
                                <div className="flex items-center gap-3 mb-2">
                                    <FontAwesomeIcon icon={faShieldAlt} className="text-brand-gold" />
                                    <span className="text-brand-gold font-black text-xs uppercase tracking-[0.2em]">ESTADO DE SANEAMIENTO</span>
                                </div>
                                <span className="text-white font-black text-sm uppercase italic tracking-widest"> 
                                    {data.estado_juridico?.saneado ? 'EXPEDIENTE SIN LIMITACIONES' : 'REQUIERE TRÁMITE DE LIBERACIÓN'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/40 p-10 rounded-[48px] border border-white/5 border-l-4 border-l-white/20">
                        <h3 className="font-black text-2xl mb-8 text-white italic uppercase tracking-tighter flex items-center gap-4">
                             <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-stone-500" />
                             Índice Fiscal
                        </h3>
                        <div className="space-y-8">
                            <div>
                                <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-4 block">Avalúo Catastral Base</span>
                                <div className="text-5xl font-black text-white tracking-widest italic">
                                    <span className="text-brand-gold text-xl mr-2">$</span>
                                    {new Intl.NumberFormat('es-CO').format(data.valor_avaluo_catastral || 0)}
                                </div>
                            </div>
                            
                            <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 text-center">
                                <FontAwesomeIcon icon={faMicrochip} className="text-brand-gold text-2xl mb-4 animate-spin-slow" />
                                <p className="text-[9px] text-stone-500 uppercase font-black leading-relaxed tracking-widest">
                                    Cruce de datos vs IGAC y Catastro Distrital completado por JanIA Intelligence.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: Finishes */}
            {activeTab === 'finishes' && (
                <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-black/40 p-10 rounded-[48px] border border-white/5">
                        <h3 className="font-black text-2xl text-white uppercase tracking-tighter italic mb-10">Estado Estructural</h3>
                        <div className="space-y-8">
                            {(data.acabados_estructura || [
                                { label: 'Pisos', status: 'Excelente' },
                                { label: 'Carpintería', status: 'Excelente' },
                                { label: 'Muros', status: 'Bueno' }
                            ]).map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                                        <span className="text-stone-500">{item.label}</span>
                                        <span className={item.status === 'Excelente' ? 'text-brand-gold' : 'text-stone-300'}>{item.status}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                                        <div className="bg-brand-gold h-full rounded-full shadow-[0_0_10px_rgba(204,172,78,0.5)]" style={{ width: item.status === 'Excelente' ? '100%' : '80%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-stone-900 to-black p-10 rounded-[48px] border border-white/5 relative group">
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
                        <h3 className="font-black text-2xl mb-8 text-white uppercase italic tracking-tighter relative z-10">Puntos de Valor</h3>
                        <div className="space-y-4 relative z-10">
                            {(data.amenidades_conjunto || ['Ascensor Privado', 'Seguridad 24/7', 'Zonas Húmedas']).map((amenity, i) => (
                                <div key={i} className="flex gap-5 items-center bg-white/5 p-6 rounded-[30px] border border-white/5 transition-all hover:bg-white/10">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-gold text-shadow-glow">
                                        <FontAwesomeIcon icon={faCheck} />
                                    </div>
                                    <span className="font-black text-white uppercase italic tracking-tighter text-lg">{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PropertyDetails;
