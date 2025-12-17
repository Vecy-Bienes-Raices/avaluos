import React, { useState, Suspense, lazy } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined, faBed, faBath, faCar, faCheck, faScaleBalanced, faShieldAlt, faFileInvoiceDollar, faFireBurner, faShower } from '@fortawesome/free-solid-svg-icons';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Lazy Load Gallery
const ImageGallery = lazy(() => import('./ImageGallery'));

const PropertyDetails = ({ data }) => {
    const [activeTab, setActiveTab] = useState('physical');

    const TabButton = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={twMerge(
                "py-2.5 px-6 rounded-full transition-all text-sm uppercase tracking-widest font-medium border",
                activeTab === id
                    ? "bg-brand-primary text-white border-brand-primary shadow-lg scale-105"
                    : "bg-white/50 text-stone-700 border-transparent hover:bg-white hover:text-brand-primary hover:shadow-md"
            )}
        >
            {label}
        </button>
    );

    return (
        <section id="property" className="py-12">
            <div className="mb-10 text-center">
                <h2 className="text-2xl md:text-4xl font-extrabold text-brand-accent mb-4 tracking-tight text-shadow-volcanic">Detalle del Inmueble</h2>
                <p className="text-stone-300 text-shadow-black mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                    Análisis exhaustivo de las condiciones físicas, arquitectónicas y el estado jurídico del bien.
                </p>
                <div className="flex flex-wrap justify-center bg-slate-200/50 p-2 rounded-2xl md:rounded-full backdrop-blur-md gap-2 md:gap-3 shadow-inner border border-white/20">
                    <TabButton id="physical" label="Físico" />
                    <TabButton id="legal" label="Jurídico" />
                    <TabButton id="finishes" label="Acabados" />
                </div>
            </div>

            {/* TAB: Physical */}
            {activeTab === 'physical' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                    {/* Key Stats */}
                    <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6 mb-2">
                        {[
                            { icon: faRulerCombined, val: `${data.area_construida || data.area_privada} m²`, label: 'Construido' },
                            { icon: faBed, val: data.habitaciones, label: 'Habitaciones' },
                            { icon: faBath, val: data.banos, label: 'Baños' },
                            { icon: faCar, val: data.parqueadero, label: 'Parqueadero' }
                        ].map((stat, i) => (
                            <div key={i} className="glass-panel bg-white/10 p-3 md:p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-accent text-shadow-volcanic shadow-inner">
                                    <FontAwesomeIcon icon={stat.icon} className="text-xl" />
                                </div>
                                <div className="text-3xl font-bold text-brand-accent text-shadow-black mb-1">{stat.val}</div>
                                <div className="text-[0.65rem] font-bold text-stone-400 text-shadow-black uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                    {/* Description */}
                    <div className="col-span-1 md:col-span-3 glass-panel bg-white/10 p-5 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <h3 className="font-bold text-2xl mb-6 block text-brand-accent text-shadow-volcanic">Distribución Espacial</h3>
                        <ul className="space-y-4 text-slate-600">
                            {(data.distribucion_espacial || []).map((item, i) => (
                                <li key={i} className="flex items-start bg-white/40 p-3 rounded-xl border border-white/60 shadow-sm">
                                    <div className="bg-green-100/80 p-1.5 rounded-full mr-3 text-green-600 shadow-sm mt-0.5">
                                        <FontAwesomeIcon icon={faCheck} className="text-xs drop-shadow-sm" />
                                    </div>
                                    <span className="text-sm md:text-base text-stone-700"><strong>{item.label}:</strong> {item.text}</span>
                                </li>
                            ))}
                            {(!data.distribucion_espacial || data.distribucion_espacial.length === 0) && (
                                <p className="text-stone-500 italic">Información detallada de distribución pendiente.</p>
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {/* TAB: Legal */}
            {activeTab === 'legal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    <div className="glass-panel bg-white/10 p-5 md:p-8 border-l-[6px] border-l-emerald-500">
                        <h3 className="font-bold text-xl mb-6 text-emerald-400 flex items-center text-shadow-black">
                            <span className="bg-emerald-100 p-2 rounded-lg mr-3 text-emerald-600"><FontAwesomeIcon icon={faScaleBalanced} /></span>
                            Estado Jurídico
                        </h3>
                        <div className="space-y-5">
                            {[
                                { label: 'Propietario', val: data.estado_juridico?.propietario || 'No registrado' },
                                { label: 'Matrícula', val: data.estado_juridico?.matricula || '---' },
                                { label: 'CHIP', val: data.estado_juridico?.chip || '---' }
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0">
                                    <span className="text-sm font-medium text-slate-400 uppercase tracking-wider text-shadow-black">{row.label}</span>
                                    <span className="font-bold text-slate-300 text-right text-shadow-black">{row.val}</span>
                                </div>
                            ))}
                            <div className="bg-emerald-50/50 p-4 rounded-xl mt-4 border border-emerald-100">
                                <span className="text-emerald-700 font-bold text-sm block mb-1"><FontAwesomeIcon icon={faShieldAlt} className="mr-1" /> {data.estado_juridico?.saneado ? 'SANEADO' : 'OBSERVACIÓN'}</span>
                                <span className="text-emerald-600/80 text-xs font-medium"> {data.estado_juridico?.saneado ? 'Libre de hipotecas y limitaciones. Apto venta.' : 'Requiere revisión jurídica adicional.'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel bg-white/10 p-5 md:p-8 border-l-[6px] border-l-blue-500">
                        <h3 className="font-bold text-xl mb-6 text-sky-400 flex items-center text-shadow-black">
                            <span className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600"><FontAwesomeIcon icon={faFileInvoiceDollar} /></span>
                            Información Fiscal ({new Date().getFullYear()})
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider text-shadow-black">Avalúo Catastral</span>
                                <span className="text-3xl font-extrabold text-sky-400 text-shadow-black"><span className="text-sky-400">$</span>{new Intl.NumberFormat('es-CO').format(data.valor_avaluo_catastral || 0)}</span>
                            </div>
                            <div>
                                <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                                    <div className="bg-blue-500 h-3 rounded-full relative" style={{ width: '45%' }}>
                                        <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/30 animate-pulse"></div>
                                    </div>
                                </div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-shadow-black">Catastral vs Comercial (Est. 40-50%)</p>
                            </div>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                                <span className="text-sm text-slate-200 text-shadow-black">Impuesto Predial (Aprox)</span>
                                <span className="font-bold text-slate-200 text-shadow-black"><span className="text-slate-200">$</span>{new Intl.NumberFormat('es-CO').format((data.valor_avaluo_catastral || 0) * 0.006)} (Aprox)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: Finishes */}
            {activeTab === 'finishes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    <div className="glass-panel bg-white/10 p-5 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-stone-200 text-shadow-black">Estado de Conservación</h3>
                            <span className="bg-brand-primary text-white text-[0.6rem] md:text-xs font-bold px-2 py-1 rounded-full shadow-lg shadow-brand-primary/20 whitespace-nowrap">{(data.acabados_estructura || []).length > 0 ? 'Analizado' : 'Pendiente'}</span>
                        </div>
                        <div className="space-y-6">
                            {(data.acabados_estructura || []).map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                        <span className="text-slate-500 text-shadow-black">{item.label}</span>
                                        <span className={`text-shadow-black ${item.status === 'Excelente' ? 'text-brand-accent' : item.status === 'Bueno' ? 'text-emerald-500' : 'text-slate-400'}`}>{item.status}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner">
                                        <div className={`h-2.5 rounded-full shadow-sm ${item.status === 'Excelente' ? 'bg-brand-accent' : item.status === 'Bueno' ? 'bg-emerald-500' : 'bg-yellow-400'}`} style={{ width: item.status === 'Excelente' ? '95%' : item.status === 'Bueno' ? '80%' : '60%' }}></div>
                                    </div>
                                    {item.detalle && <p className="text-[10px] text-stone-400 mt-1">{item.detalle}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="glass-panel bg-white/10 p-5 md:p-8 relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/40 rounded-full blur-3xl"></div>
                        <h3 className="font-bold text-xl mb-6 text-brand-accent relative z-10 text-shadow-black">Aspectos Destacados</h3>
                        <ul className="space-y-4 relative z-10">
                            {/* Mocking Highlights or using a new field 'amenidades_conjunto' if fitting */}
                            {(data.amenidades_conjunto || []).map((amenity, i) => (
                                <li key={i} className="flex gap-4 items-start">
                                    <span className="bg-white p-3 rounded-2xl shadow-sm text-brand-accent h-10 w-10 flex items-center justify-center text-lg"><FontAwesomeIcon icon={faCheck} /></span>
                                    <div>
                                        <span className="font-bold block text-slate-500 text-lg mb-1 text-shadow-black">{amenity}</span>
                                    </div>
                                </li>
                            ))}
                            {(!data.amenidades_conjunto || data.amenidades_conjunto.length === 0) && (
                                <p className="text-stone-400">Sin amenidades destacadas registradas.</p>
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {/* IMAGE GALLERY INTEGRATION (Lazy Loaded) */}
            <div className="mt-16 animate-fade-in text-center relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-brand-accent mb-8 text-shadow-volcanic tracking-tight">Galería Fotográfica</h3>
                <Suspense fallback={<div className="w-full h-[400px] bg-white/5 rounded-3xl animate-pulse flex flex-col items-center justify-center text-stone-400 font-medium border border-white/10"><div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4"></div>Cargando Experiencia Visual...</div>}>
                    <ImageGallery images={data.galeria_imagenes} />
                </Suspense>
            </div>
        </section>
    );
};

export default PropertyDetails;
