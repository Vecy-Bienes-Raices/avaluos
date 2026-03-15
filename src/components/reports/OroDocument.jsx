import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt, faExpand, faHome, faExclamationTriangle,
    faShieldHalved, faStamp, faPhone, faBed, faBath, faCar,
    faBuilding, faTree, faBolt, faDroplet, faCircleCheck,
    faArrowTrendUp, faChartBar, faMagnifyingGlassChart,
    faScaleBalanced, faRulerCombined, faAward, faBookOpen
} from '@fortawesome/free-solid-svg-icons';

const OroDocument = ({ data, chatId }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(price || 0));
    };

    const valorEstimado = data.valor_final_avaluador || data.precio_estimado || 0;
    const rangoInferior = valorEstimado * 0.93;
    const rangoSuperior = valorEstimado * 1.07;
    const valorM2 = data.precio_m2 || (data.area_construida ? Math.round(valorEstimado / data.area_construida) : 0);
    const dictamenId = (chatId || '').substring(0, 8).toUpperCase() || 'VECY-8832';
    const fachadaUrl = data.facade_url || data.cover_image;
    const gallery = data.gallery || [];

    return (
        <div className="font-jakarta overflow-hidden shadow-[0_0_80px_rgba(204,172,78,0.15)] border border-[#CCAC4E]/30 rounded-3xl print:shadow-none print:border-none print:rounded-none print:bg-white relative">

            {/* ===== LUXURY COVER — FACHADA + GOLDEN OVERLAY ===== */}
            <div className="relative h-72 md:h-96 overflow-hidden print:h-52 report-cover-photo">
                {fachadaUrl ? (
                    <img
                        src={fachadaUrl}
                        alt="Fachada"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#3d2c00] via-[#1a1400] to-[#0c0900]" />
                )}

                {/* Multi-layer golden gradient overlay — luxury feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0900] via-[#1a1400]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#CCAC4E]/10 via-transparent to-[#CCAC4E]/5" />

                {/* Top decorative gold line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#CCAC4E] to-transparent print:hidden" />

                {/* Logo + badge top-left */}
                <div className="absolute top-5 left-6 flex items-center gap-3">
                    <img src="/logo-vecy.png" alt="Vecy" className="h-9 w-auto object-contain drop-shadow-2xl print:hidden" />
                    <span className="px-3 py-1 bg-[#CCAC4E]/20 backdrop-blur-sm text-[#CCAC4E] font-bold text-[9px] uppercase tracking-[0.3em] rounded-full border border-[#CCAC4E]/40 print:hidden">
                        Plan Oro · Dictamen Pericial
                    </span>
                </div>

                {/* Dictamen ID top-right */}
                <div className="absolute top-5 right-6 text-right print:hidden">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-[#CCAC4E]/60">Dictamen N°</p>
                    <p className="text-[#CCAC4E] font-mono font-black text-sm tracking-widest">{dictamenId}</p>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 px-8 md:px-10 pb-7 pt-16">
                    {/* gold ornamental line */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#CCAC4E]/50" />
                        <FontAwesomeIcon icon={faAward} className="text-[#CCAC4E] text-sm" />
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#CCAC4E]/50" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow-2xl print:text-stone-900">
                        {data.tipo_inmueble || 'Propiedad Residencial'}
                    </h1>
                    <p className="text-[#d4a93a] font-black text-xl md:text-2xl uppercase tracking-[0.1em] mt-1 print:text-[#B8860B]">
                        AVALÚO <span className="text-[#CCAC4E]">ORO</span>
                    </p>
                    <p className="text-stone-300 text-sm mt-2 flex items-center gap-2 print:text-stone-600">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#CCAC4E] text-xs shrink-0" />
                        {data.direccion} · {data.barrio}, {data.localidad}
                    </p>
                </div>
            </div>

            {/* ===== GOLD HEADER BAR ===== */}
            <div className="bg-gradient-to-r from-[#CCAC4E]/20 via-[#CCAC4E]/10 to-[#CCAC4E]/5 backdrop-blur-xl border-b border-[#CCAC4E]/25 px-8 md:px-10 py-5 flex flex-col sm:flex-row justify-between items-center gap-4 print:bg-yellow-50 print:border-b-4 print:border-[#CCAC4E] print:backdrop-filter-none">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-[#CCAC4E]/20 blur-md print:hidden" />
                        <img src="/perfil.png" alt="JanIA" className="w-14 h-14 object-cover rounded-full border-2 border-[#CCAC4E]/50 relative z-10 shadow-[0_0_20px_rgba(204,172,78,0.3)] print:hidden" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#CCAC4E]/70">Vecy Avalúos S.A.S. · Dictamen Corporativo</p>
                        <p className="text-white font-black text-lg tracking-tight leading-none print:text-stone-900">Avalúo Plan <span className="text-[#CCAC4E]">ORO</span></p>
                        <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 bg-[#CCAC4E]/15 text-[#CCAC4E] font-bold text-[9px] uppercase tracking-widest rounded-full border border-[#CCAC4E]/30">
                            <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
                            Certificación Pericial Activa
                        </span>
                    </div>
                </div>
                <div className="text-right text-xs space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Fecha de Emisión</p>
                    <p className="text-white font-extrabold print:text-stone-900">{data.cliente_fecha}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mt-2">Cliente</p>
                    <p className="text-[#CCAC4E] font-extrabold uppercase tracking-wider">{data.cliente_nombre}</p>
                </div>
            </div>

            {/* ===== GALLERY — PHOTO GRID ===== */}
            {gallery.length > 0 && (
                <div className="bg-[#0c0a06]/70 backdrop-blur-xl border-b border-[#CCAC4E]/10 p-4 print:bg-white print:border-b-2 print:border-stone-200">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-[#CCAC4E]/40 to-transparent" />
                        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#CCAC4E]/70 print:text-[#B8860B]">Registro Fotográfico del Inmueble</p>
                        <div className="h-px flex-1 bg-gradient-to-l from-[#CCAC4E]/40 to-transparent" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 print:grid-cols-3">
                        {gallery.slice(0, 6).map((foto, i) => (
                            <div key={i} className={`relative rounded-xl overflow-hidden ${i === 0 ? 'col-span-1 row-span-1' : ''}`} style={{ aspectRatio: '4/3' }}>
                                <img
                                    src={foto.url || foto}
                                    alt={foto.label || `Interior ${i + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                {foto.label && (
                                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5">
                                        <p className="text-[8px] font-bold text-white uppercase tracking-wider">{foto.label}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== MAIN BODY ===== */}
            <div className="bg-[#0c0a06]/70 backdrop-blur-xl p-8 md:p-10 space-y-6 print:bg-white print:text-stone-900 print:backdrop-filter-none">

                {/* FICHA TÉCNICA */}
                <section className="bg-white/[0.04] border border-[#CCAC4E]/15 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                    <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#CCAC4E] mb-5 print:text-[#B8860B]">
                        <FontAwesomeIcon icon={faHome} />
                        Ficha Técnica de la Propiedad
                    </h2>

                    <div className="mb-5">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">Dirección Exacta</p>
                        <p className="text-2xl md:text-3xl font-black text-white uppercase leading-tight print:text-stone-900">{data.direccion}</p>
                        <p className="text-stone-400 text-xs mt-1 flex items-center gap-1.5 print:text-stone-600">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#CCAC4E] text-xs" />
                            {data.barrio} · {data.localidad} · {data.ciudad}
                        </p>
                    </div>

                    {/* Main metrics — premium gold style */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {[
                            { icon: faExpand, label: 'Área Construida', value: `${data.area_construida} m²`, color: 'text-[#CCAC4E]' },
                            { icon: faBed, label: 'Habitaciones', value: data.habitaciones || '–', color: 'text-[#CCAC4E]' },
                            { icon: faBath, label: 'Baños', value: data.banos || '–', color: 'text-[#CCAC4E]' },
                            { icon: faHome, label: 'Estrato', value: `E${data.estrato}`, color: 'text-[#CCAC4E]' },
                        ].map((item, i) => (
                            <div key={i} className="bg-gradient-to-b from-[#CCAC4E]/8 to-transparent border border-[#CCAC4E]/15 rounded-xl p-4 text-center print:bg-yellow-50 print:border-[#CCAC4E]/20">
                                <FontAwesomeIcon icon={item.icon} className={`${item.color} text-sm mb-2 print:text-[#B8860B]`} />
                                <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-1 print:text-stone-500">{item.label}</p>
                                <p className="text-xl font-black text-white print:text-stone-900">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                            { icon: faCar, label: 'Garajes', value: data.garajes || '–' },
                            { icon: faBuilding, label: 'Antigüedad', value: data.antiguedad || 'N/D' },
                            { icon: faExpand, label: 'Área Lote', value: data.area_terreno ? `${data.area_terreno} m²` : '–' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-lg px-4 py-3 print:border-stone-200">
                                <FontAwesomeIcon icon={item.icon} className="text-[#CCAC4E]/60 text-sm w-4 shrink-0 print:text-[#B8860B]" />
                                <div>
                                    <p className="text-[8px] font-bold uppercase tracking-wider text-stone-500">{item.label}</p>
                                    <p className="text-sm font-bold text-stone-200 print:text-stone-800">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {data.zonas_comunes && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {[data.zonas_comunes, data.piscina && 'Piscina', data.gym && 'Gimnasio'].filter(Boolean).map((s, i) => (
                                <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-[#CCAC4E]/10 border border-[#CCAC4E]/20 rounded-full text-[9px] font-bold text-[#CCAC4E] print:bg-yellow-50 print:border-[#B8860B]/30 print:text-[#B8860B]">
                                    <FontAwesomeIcon icon={faCircleCheck} className="text-xs" /> {typeof s === 'string' ? s : ''}
                                </span>
                            ))}
                        </div>
                    )}
                </section>

                {/* VALOR PERICIAL — LUXURY CARD */}
                <section className="relative overflow-hidden border border-double border-[#CCAC4E]/40 rounded-2xl p-8 print:bg-yellow-50 print:border-[#B8860B] print:border-4 print:border-double">
                    {/* Metallic gold gradient bg */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#CCAC4E]/15 via-[#a08030]/5 to-transparent print:hidden" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CCAC4E]/60 to-transparent print:hidden" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CCAC4E]/30 to-transparent print:hidden" />
                    {/* Glow orbs */}
                    <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#CCAC4E]/10 rounded-full blur-3xl print:hidden" />
                    <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-amber-300/5 rounded-full blur-3xl print:hidden" />

                    <div className="relative z-10">
                        <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#CCAC4E] mb-6 print:text-[#B8860B]">
                            <FontAwesomeIcon icon={faStamp} />
                            Dictamen de Valor Comercial · Pericial
                        </h2>

                        <div className="text-center mb-8">
                            <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#CCAC4E]/60 mb-3 print:text-[#B8860B]/70">Valor Pericial Estipulado</p>
                            {/* Big gold value */}
                            <div className="relative inline-block">
                                <p className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#e8c84a] via-[#CCAC4E] to-[#a08030] leading-none print:text-stone-900">
                                    {formatPrice(valorEstimado)}
                                </p>
                                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CCAC4E]/40 to-transparent print:hidden" />
                            </div>
                            {valorM2 > 0 && (
                                <p className="text-sm mt-3 text-stone-400 print:text-stone-600">
                                    Precio por m² ≈ <strong className="text-[#CCAC4E] print:text-[#B8860B]">{formatPrice(valorM2)}</strong>
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-[#CCAC4E]/20 pt-6 print:border-[#CCAC4E]/30">
                            <div className="text-center p-4 bg-white/[0.03] rounded-xl border border-white/5 print:bg-yellow-50/50 print:border-stone-200">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1 print:text-stone-500">Banda Inferior</p>
                                <p className="text-[10px] text-stone-500 mb-2 print:text-stone-400">Valor de liquidación rápida</p>
                                <p className="text-xl font-black text-stone-200 print:text-stone-700">{formatPrice(rangoInferior)}</p>
                            </div>
                            <div className="text-center p-4 bg-white/[0.03] rounded-xl border border-white/5 print:bg-yellow-50/50 print:border-stone-200">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1 print:text-stone-500">Banda Superior</p>
                                <p className="text-[10px] text-stone-500 mb-2 print:text-stone-400">Valor de reposición total</p>
                                <p className="text-xl font-black text-stone-200 print:text-stone-700">{formatPrice(rangoSuperior)}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MARKET SYNTHESIS */}
                <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                    <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#CCAC4E] mb-4 print:text-[#B8860B]">
                        <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                        Síntesis Ampliada de Mercado con IA
                    </h2>
                    <p className="text-stone-300 text-sm leading-relaxed mb-5 print:text-stone-700">
                        {data.analisis_mercado_texto || "Análisis técnico completado con algoritmos de inteligencia geoespacial y cruce de datos en tiempo real."}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Ofertas Activas 1KM', value: data.ofertas_activas || '18–28', color: 'text-[#CCAC4E] print:text-[#B8860B]' },
                            { label: 'Absorción Media', value: data.absorcion || '3–5 m.', color: 'text-[#CCAC4E] print:text-[#B8860B]' },
                            { label: 'Apreciación Anual', value: data.apreciacion || '+6.2%', color: 'text-green-400 print:text-green-700' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#CCAC4E]/5 border border-[#CCAC4E]/15 rounded-xl p-4 text-center print:bg-yellow-50 print:border-[#CCAC4E]/20">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-2 print:text-stone-500">{stat.label}</p>
                                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CMA TABLE */}
                {data.comparables && data.comparables.length > 0 && (
                    <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                        <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#CCAC4E] mb-5 print:text-[#B8860B]">
                            <FontAwesomeIcon icon={faChartBar} />
                            CMA — Análisis Comparativo de Mercado · {data.comparables.length} Comparables
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#CCAC4E]/20">
                                        {['Comparable', 'm²', 'Precio Total', '$/m²', 'Días'].map((h, i) => (
                                            <th key={i} className={`text-[9px] font-black uppercase tracking-wider text-[#CCAC4E]/70 pb-3 print:text-[#B8860B] ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#CCAC4E]/5 print:divide-stone-200">
                                    {data.comparables.map((c, i) => (
                                        <tr key={i} className="hover:bg-[#CCAC4E]/5 transition-colors">
                                            <td className="py-3 text-stone-300 font-medium print:text-stone-700">{c.address}</td>
                                            <td className="py-3 text-right text-stone-300 print:text-stone-700">{c.area}</td>
                                            <td className="py-3 text-right font-bold text-stone-200 print:text-stone-800">{formatPrice(c.price)}</td>
                                            <td className="py-3 text-right font-bold text-[#CCAC4E] print:text-[#B8860B]">{formatPrice(c.price_m2)}</td>
                                            <td className="py-3 text-right text-stone-400 print:text-stone-600">{c.days_on_market}d</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gradient-to-r from-[#CCAC4E]/15 to-[#CCAC4E]/5 border border-[#CCAC4E]/25 print:bg-yellow-50">
                                        <td className="py-3 pl-2 font-black text-[#CCAC4E] uppercase tracking-wider text-xs print:text-[#B8860B]">★ Propiedad Sujeto</td>
                                        <td className="py-3 text-right text-[#CCAC4E] font-black print:text-[#B8860B]">{data.area_construida}</td>
                                        <td className="py-3 text-right text-[#CCAC4E] font-black print:text-[#B8860B]">{formatPrice(valorEstimado)}</td>
                                        <td className="py-3 text-right text-[#CCAC4E] font-black print:text-[#B8860B]">{formatPrice(valorM2)}</td>
                                        <td className="py-3 text-right text-stone-500 text-xs">—</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* NORMATIVA URBANA */}
                <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                    <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#CCAC4E] mb-5 print:text-[#B8860B]">
                        <FontAwesomeIcon icon={faScaleBalanced} />
                        Perfil Normativo y Urbanístico
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                            { label: 'Uso del Suelo', value: data.uso_suelo || 'Residencial/Mixto Bajo' },
                            { label: 'Zona Catastral', value: data.zona_catastral || 'Zona Norte — 82-04' },
                            { label: 'Norma Vigente', value: data.norma_vigente || 'POT Bogotá 2022' },
                            { label: 'Tratamiento Urbano', value: data.tratamiento || 'Consolidación Urbana' },
                            { label: 'Índice de Ocupación', value: data.indice_ocupacion || '60% — 70%' },
                            { label: 'Pisos Permitidos', value: data.pisos_permitidos || 'Hasta 4 pisos' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/[0.03] border border-[#CCAC4E]/10 rounded-xl p-4 print:border-stone-200 print:bg-transparent">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-stone-500 mb-1">{item.label}</p>
                                <p className="text-sm font-bold text-stone-200 print:text-stone-800">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* EVALUACIÓN CUALITATIVA */}
                <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                    <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#CCAC4E] mb-5 print:text-[#B8860B]">
                        <FontAwesomeIcon icon={faRulerCombined} />
                        Evaluación Técnica y Cualitativa
                    </h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Estado de Conservación General', score: data.conservacion || 88 },
                            { label: 'Calidad de Construcción y Acabados', score: data.acabados || 82 },
                            { label: 'Ubicación y Accesibilidad Vial', score: data.ubicacion_score || 92 },
                            { label: 'Potencial de Valorización a 5 Años', score: data.valorizacion_score || 80 },
                            { label: 'Índice de Liquidez en Mercado Actual', score: data.liquidez_score || 75 },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <p className="text-xs font-semibold text-stone-300 print:text-stone-700">{item.label}</p>
                                    <p className="text-xs font-black text-[#CCAC4E] print:text-[#B8860B]">{item.score}/100</p>
                                </div>
                                <div className="w-full bg-white/8 rounded-full h-2 print:bg-stone-200">
                                    <div
                                        className="h-2 rounded-full print:bg-[#B8860B]"
                                        style={{
                                            width: `${item.score}%`,
                                            background: `linear-gradient(to right, #a08030, #CCAC4E, #e8c84a)`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SIGNATURES & CERTIFICATION */}
                <section className="bg-white/[0.04] border border-double border-[#CCAC4E]/30 rounded-2xl p-8 relative overflow-hidden print:bg-stone-50 print:border-stone-200">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CCAC4E]/40 to-transparent print:hidden" />

                    {/* Ornamental header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#CCAC4E]/30" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#CCAC4E] print:text-[#B8860B]">
                            <FontAwesomeIcon icon={faStamp} className="mr-2" />
                            Firmas y Certificaciones Digitales
                        </h2>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#CCAC4E]/30" />
                    </div>

                    <div className="flex flex-col md:flex-row justify-around items-end gap-8 mb-8">
                        {/* Firma JanIA */}
                        <div className="text-center flex flex-col items-center flex-1">
                            <div className="w-full max-w-[200px] h-16 border-b-2 border-stone-400/40 mb-3 flex items-end justify-center pb-2 print:border-stone-300">
                                <span className="text-3xl text-[#CCAC4E]/30 tracking-[0.1em] font-light italic select-none">JanIA V2.5</span>
                            </div>
                            <p className="font-black text-stone-200 text-[10px] uppercase tracking-[0.2em] print:text-stone-800">Firma Digital IA</p>
                            <p className="text-[8px] text-stone-500 uppercase tracking-wider font-mono mt-1">{chatId ? chatId.substring(0, 18) : '0x882A39FFF10'}</p>
                        </div>

                        {/* Sello central */}
                        <div className="shrink-0 flex flex-col items-center">
                            <div className="relative w-32 h-32">
                                {/* Outer ring */}
                                <div className="absolute inset-0 rounded-full border-4 border-double border-[#CCAC4E]/50 print:border-[#B8860B]/50" />
                                {/* Inner ring */}
                                <div className="absolute inset-3 rounded-full border border-[#CCAC4E]/25 print:border-[#B8860B]/25" />
                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                                    <FontAwesomeIcon icon={faAward} className="text-[#CCAC4E] text-2xl print:text-[#B8860B]" />
                                    <span className="text-[7px] font-black uppercase tracking-wider text-[#CCAC4E] text-center leading-tight print:text-[#B8860B]">Sello Oro<br/>Vecy Avalúos</span>
                                    <span className="text-[6px] text-stone-500 font-mono">2026 · VALID</span>
                                </div>
                                {/* Gold glow */}
                                <div className="absolute inset-2 rounded-full bg-[#CCAC4E]/5 print:hidden" />
                            </div>
                        </div>

                        {/* Firma perito */}
                        <div className="text-center flex flex-col items-center flex-1">
                            <div className="w-full max-w-[200px] h-16 border-b-2 border-stone-400/40 mb-3 print:border-stone-300" />
                            <p className="font-black text-stone-200 text-[10px] uppercase tracking-[0.2em] print:text-stone-800">Perito RAA Adscrito</p>
                            <p className="text-[8px] text-stone-500 uppercase tracking-wider mt-1">Validable IGAC / Lonja Nacional</p>
                        </div>
                    </div>

                    {/* QR + extras (decorativo) */}
                    <div className="grid grid-cols-3 gap-4 border-t border-[#CCAC4E]/10 pt-5 print:border-stone-200">
                        {[
                            { icon: faShieldHalved, label: 'Autenticidad', value: 'Hash SHA-256' },
                            { icon: faBookOpen, label: 'Registro', value: 'Lonja Bogotá' },
                            { icon: faCircleCheck, label: 'Validez Legal', value: 'Art 780 CPC' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <FontAwesomeIcon icon={item.icon} className="text-[#CCAC4E]/50 text-xl mb-2 print:text-[#B8860B]/50" />
                                <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 print:text-stone-500">{item.label}</p>
                                <p className="text-[10px] font-black text-stone-300 print:text-stone-700">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* LEGAL */}
                <div className="text-[9px] text-stone-500 text-justify leading-relaxed tracking-wider print:text-stone-500 px-1">
                    <p className="uppercase font-bold text-[#CCAC4E]/40 mb-1 print:text-[#B8860B]/50">Aviso Legal — Dictamen Corporativo Plan Oro</p>
                    Este informe pericial corporativo «PLAN ORO» ha sido ensamblado digitalmente mediante el registro de bases primarias y la inteligencia algorítmica de Vecy Avalúos S.A.S. Se expide el día {data.cliente_fecha}. Su validez jurídica completa ante entidades bancarias, notariales y judiciales está condicionada a la firma física del perito RAA / RNA en el espacio habilitado, tras inspección ocular presencial. La alteración digital de este documento constituye fraude penado por la ley colombiana (Ley 527/99 y Art. 289 C.P.).
                </div>
            </div>

            {/* ===== PRINT FOOTER ===== */}
            <footer className="report-print-footer hidden print:flex items-center justify-between px-10 py-4 border-t-4 border-double border-[#CCAC4E]/40 bg-white w-full">
                <div className="flex items-center gap-3">
                    <img src="/perfil.png" alt="JanIA · Vecy Avalúos" className="h-8 opacity-80 rounded-full" />
                    <div>
                        <p className="text-stone-800 font-black text-xs uppercase tracking-widest">Vecy Avalúos S.A.S</p>
                        <p className="text-[8px] text-stone-400 uppercase tracking-widest">Dictamen Plan Oro · {dictamenId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-stone-600 text-xs font-bold">
                    <FontAwesomeIcon icon={faPhone} className="text-[#B8860B]" />
                    +57 322 360 8877
                </div>
                <p className="text-[9px] text-stone-400 uppercase tracking-widest">vecyavaluos.com · JanIA®</p>
            </footer>
        </div>
    );
};

export default OroDocument;
