import React, { useState, Suspense, lazy } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined, faBed, faBath, faCar, faCheck, faScaleBalanced, faShieldAlt, faFileInvoiceDollar, faFireBurner, faShower } from '@fortawesome/free-solid-svg-icons';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Lazy Load Gallery
const ImageGallery = lazy(() => import('./ImageGallery'));

const PropertyDetails = () => {
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
                            { icon: faRulerCombined, val: '72 m²', label: 'Construido' },
                            { icon: faBed, val: '4', label: 'Habitaciones' },
                            { icon: faBath, val: '2', label: 'Baños' },
                            { icon: faCar, val: '1', label: 'Parqueadero' }
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
                            {[
                                { bold: 'Lote:', text: '36.97 m² (huella primer piso). Propiedad Horizontal.' },
                                { bold: 'Niveles:', text: 'Tres niveles distribuidos funcionalmente + Altillo/Zarzo adaptado.' },
                                { bold: 'Zona Social:', text: 'Sala y comedor independientes, permitiendo mejor organización del mobiliario.' },
                                { bold: 'Servicios:', text: 'Patio cubierto (zona de ropas) con ventilación e iluminación natural.' }
                            ].map((item, i) => (
                                <li key={i} className="flex items-start bg-white/40 p-3 rounded-xl border border-white/60 shadow-sm">
                                    <div className="bg-green-100/80 p-1.5 rounded-full mr-3 text-green-600 shadow-sm mt-0.5">
                                        <FontAwesomeIcon icon={faCheck} className="text-xs drop-shadow-sm" />
                                    </div>
                                    <span className="text-sm md:text-base text-stone-700"><strong>{item.bold}</strong> {item.text}</span>
                                </li>
                            ))}
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
                                { label: 'Propietario', val: 'Teresa del Carmen Rodríguez Muñoz' },
                                { label: 'Matrícula', val: '050N-01075857' },
                                { label: 'CHIP', val: 'AAA0128NTPA' }
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0">
                                    <span className="text-sm font-medium text-slate-400 uppercase tracking-wider text-shadow-black">{row.label}</span>
                                    <span className="font-bold text-slate-300 text-right text-shadow-black">{row.val}</span>
                                </div>
                            ))}
                            <div className="bg-emerald-50/50 p-4 rounded-xl mt-4 border border-emerald-100">
                                <span className="text-emerald-700 font-bold text-sm block mb-1"><FontAwesomeIcon icon={faShieldAlt} className="mr-1" /> SANEADO</span>
                                <span className="text-emerald-600/80 text-xs font-medium"> Libre de hipotecas, embargos y limitaciones. Apto para venta inmediata.</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel bg-white/10 p-5 md:p-8 border-l-[6px] border-l-blue-500">
                        <h3 className="font-bold text-xl mb-6 text-sky-400 flex items-center text-shadow-black">
                            <span className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600"><FontAwesomeIcon icon={faFileInvoiceDollar} /></span>
                            Información Fiscal (2025)
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider text-shadow-black">Avalúo Catastral</span>
                                <span className="text-3xl font-extrabold text-sky-400 text-shadow-black"><span className="text-sky-400">$</span>193.726.000</span>
                            </div>
                            <div>
                                <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                                    <div className="bg-blue-500 h-3 rounded-full relative" style={{ width: '45%' }}>
                                        <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/30 animate-pulse"></div>
                                    </div>
                                </div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-shadow-black">Catastral vs Comercial (45%)</p>
                            </div>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                                <span className="text-sm text-slate-200 text-shadow-black">Impuesto Predial</span>
                                <span className="font-bold text-slate-200 text-shadow-black"><span className="text-slate-200">$</span>1.015.000 (Aprox)</span>
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
                            <span className="bg-brand-primary text-white text-[0.6rem] md:text-xs font-bold px-2 py-1 rounded-full shadow-lg shadow-brand-primary/20 whitespace-nowrap">8 / 10 Puntos</span>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Cocina (Remodelada)', status: 'Excelente', color: 'bg-brand-accent', width: '95%', textClass: 'text-brand-accent text-shadow-black' },
                                { label: 'Baño Principal (Remodelado)', status: 'Excelente', color: 'bg-brand-accent', width: '90%', textClass: 'text-brand-accent text-shadow-black' },
                                { label: 'Pisos & Pintura', status: 'Bueno', color: 'bg-emerald-500', width: '80%', textClass: 'text-slate-600 text-shadow-black' },
                                { label: 'Baño Auxiliar', status: 'Estándar', color: 'bg-yellow-400', width: '60%', textClass: 'text-slate-400 text-shadow-black' }
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                        <span className="text-slate-500 text-shadow-black">{item.label}</span>
                                        <span className={item.textClass}>{item.status}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner">
                                        <div className={twMerge("h-2.5 rounded-full shadow-sm", item.color)} style={{ width: item.width }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="glass-panel bg-white/10 p-5 md:p-8 relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/40 rounded-full blur-3xl"></div>
                        <h3 className="font-bold text-xl mb-6 text-brand-accent relative z-10 text-shadow-black">Aspectos Destacados</h3>
                        <ul className="space-y-4 relative z-10">
                            <li className="flex gap-4 items-start">
                                <span className="bg-white p-3 rounded-2xl shadow-sm text-brand-accent h-12 w-12 flex items-center justify-center text-xl"><FontAwesomeIcon icon={faFireBurner} /></span>
                                <div>
                                    <span className="font-bold block text-slate-500 text-lg mb-1 text-shadow-black">Cocina Integral Moderna</span>
                                    <span className="text-sm text-stone-200 leading-snug block text-shadow-black">Mobiliario madera laminada gris, mesón granito jaspeado, horno empotrado.</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="bg-white p-3 rounded-2xl shadow-sm text-brand-accent h-12 w-12 flex items-center justify-center text-xl"><FontAwesomeIcon icon={faShower} /></span>
                                <div>
                                    <span className="font-bold block text-slate-500 text-lg mb-1 text-shadow-black">Baño Principal</span>
                                    <span className="text-sm text-stone-200 leading-snug block text-shadow-black">División vidrio templado, enchape tipo metro B&N, grifería moderna.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* IMAGE GALLERY INTEGRATION (Lazy Loaded) */}
            <div className="mt-16 animate-fade-in text-center relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-brand-accent mb-8 text-shadow-volcanic tracking-tight">Galería Fotográfica</h3>
                <Suspense fallback={<div className="w-full h-[400px] bg-white/5 rounded-3xl animate-pulse flex flex-col items-center justify-center text-stone-400 font-medium border border-white/10"><div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4"></div>Cargando Experiencia Visual...</div>}>
                    <ImageGallery />
                </Suspense>
            </div>
        </section>
    );
};

export default PropertyDetails;
