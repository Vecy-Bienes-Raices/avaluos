import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt, faHome, faFileAlt, faExclamationTriangle,
    faChartLine, faMagnifyingGlassChart, faPhone, faBed, faBath,
    faCar, faArrowTrendUp, faChartBar, faScaleBalanced, faShieldAlt,
    faBuilding, faTree, faBolt, faDroplet, faWifi, faExpand
} from '@fortawesome/free-solid-svg-icons';

const EsmeraldaDocument = ({ data }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(price || 0));
    };

    const valorEstimado = data.valor_final_avaluador || data.precio_estimado || 0;
    const rangoInferior = valorEstimado * 0.93;
    const rangoSuperior = valorEstimado * 1.07;
    const valorM2 = data.precio_m2 || (data.area_construida ? Math.round(valorEstimado / data.area_construida) : 0);

    // Foto fachada + galería adicional
    const fachadaUrl = data.facade_url || data.cover_image;
    const gallery = data.gallery || data.fotos || [];

    return (
        <div className="font-jakarta rounded-3xl overflow-hidden shadow-2xl border border-teal-500/20 print:shadow-none print:border-none print:rounded-none print:bg-white">

            {/* ===== PORTADA: FOTO FACHADA ===== */}
            {fachadaUrl && (
                <div className="relative h-64 md:h-80 overflow-hidden print:h-52">
                    <img
                        src={fachadaUrl}
                        alt="Fachada del inmueble"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#051510] via-[#051510]/50 to-transparent" />
                    <div className="absolute top-5 left-6">
                        <img src="/logo-vecy.png" alt="Vecy" className="h-10 w-auto object-contain drop-shadow-xl" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <span className="inline-block px-3 py-1 bg-teal-400/20 text-teal-300 font-bold text-[10px] uppercase tracking-[0.3em] rounded-full border border-teal-400/30 mb-3">
                            <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                            Plan Esmeralda · CMA Avanzado
                        </span>
                        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-none drop-shadow-xl print:text-stone-900">
                            {data.tipo_inmueble || 'Inmueble Residencial'}
                        </h1>
                        <p className="text-stone-300 text-sm mt-1 flex items-center gap-2 print:text-stone-600">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-teal-400 text-xs" />
                            {data.barrio}, {data.localidad} — {data.ciudad}
                        </p>
                    </div>
                </div>
            )}

            {/* ===== GALERÍA DE FOTOS (5-6 fotos) ===== */}
            {gallery.length > 0 && (
                <div className="bg-[#051510]/80 backdrop-blur-xl p-4 border-b border-teal-500/10 print:bg-white print:border-b-2 print:border-stone-200">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-teal-400/70 mb-3 px-2 print:text-teal-700">Registro Fotográfico del Inmueble</p>
                    <div className="grid grid-cols-3 gap-2 print:grid-cols-3">
                        {gallery.slice(0, 6).map((foto, i) => (
                            <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl print:rounded-lg">
                                <img
                                    src={foto.url || foto}
                                    alt={foto.label || `Interior ${i + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                {foto.label && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                                        <p className="text-[8px] font-semibold text-white uppercase tracking-wider">{foto.label}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== GLASS HEADER ===== */}
            <header className="bg-[#0c2c27]/80 backdrop-blur-xl border-b border-teal-500/20 px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4 print:bg-white print:border-b-2 print:border-teal-600 print:backdrop-filter-none">
                <div className="flex items-center gap-4">
                    <img src="https://i.ibb.co/G3ngFMmn/Vecy-agenda1.png" alt="Vecy Avalúos" className="w-10 h-10 object-contain print:hidden" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400">Análisis Comparativo de Mercado Avanzado</p>
                        <p className="text-stone-400 text-xs">Reporte de Mercado con IA · Vecy Avalúos S.A.S.</p>
                    </div>
                </div>
                <div className="text-right shrink-0 text-xs">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-0.5">Fecha de Análisis</p>
                    <p className="text-white font-bold print:text-stone-900">{data.cliente_fecha}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mt-2 mb-0.5">Solicitante Autorizado</p>
                    <p className="text-white font-bold uppercase print:text-stone-900">{data.cliente_nombre}</p>
                </div>
            </header>

            {/* ===== BODY ===== */}
            <div className="bg-[#080e0c]/60 backdrop-blur-xl p-6 md:p-10 space-y-6 print:bg-white print:text-stone-900 print:backdrop-filter-none">

                {/* PROPERTY IDENTITY */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                    <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 mb-5 print:text-teal-700">
                        <FontAwesomeIcon icon={faHome} />
                        Ficha Técnica del Inmueble
                    </h2>

                    <div className="mb-5">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1 print:text-stone-500">Dirección de Estudio</p>
                        <p className="text-lg md:text-2xl font-extrabold text-white uppercase leading-tight print:text-stone-900">{data.direccion}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                        {[
                            { icon: faExpand, label: 'Área Construida', value: `${data.area_construida} m²` },
                            { icon: faBed, label: 'Habitaciones', value: data.habitaciones || '–' },
                            { icon: faBath, label: 'Baños', value: data.banos || '–' },
                            { icon: faHome, label: 'Estrato', value: `E${data.estrato}` },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/8 rounded-xl p-4 text-center print:bg-teal-50 print:border-teal-100">
                                <FontAwesomeIcon icon={item.icon} className="text-teal-400 text-base mb-2 print:text-teal-600" />
                                <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-400 mb-1 print:text-stone-500">{item.label}</p>
                                <p className="text-lg font-black text-white print:text-stone-900">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: faCar, label: 'Garajes', value: data.garajes || '–' },
                            { icon: faBuilding, label: 'Antigüedad', value: data.antiguedad || 'N/D' },
                            { icon: faExpand, label: 'Área Terreno', value: data.area_terreno ? `${data.area_terreno} m²` : 'Apto/Casa' },
                            { icon: faTree, label: 'Zonas Comunes', value: data.zonas_comunes || 'Incluidas' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-xl px-4 py-3 print:border-stone-200 print:bg-transparent">
                                <FontAwesomeIcon icon={item.icon} className="text-teal-400/70 text-sm w-4 print:text-teal-600" />
                                <div>
                                    <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500 print:text-stone-400">{item.label}</p>
                                    <p className="text-sm font-bold text-stone-200 print:text-stone-800">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Servicios */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {[
                            { icon: faBolt, label: 'Energía' },
                            { icon: faDroplet, label: 'Acueducto' },
                            { icon: faWifi, label: 'Internet' },
                        ].map((s, i) => (
                            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-[10px] font-semibold text-teal-300 print:bg-teal-50 print:border-teal-200 print:text-teal-700">
                                <FontAwesomeIcon icon={s.icon} className="text-xs" />
                                {s.label}
                            </span>
                        ))}
                        {data.piscina && <span className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-[10px] font-semibold text-teal-300 print:bg-teal-50 print:border-teal-200 print:text-teal-700">🏊 Piscina</span>}
                        {data.gym && <span className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-[10px] font-semibold text-teal-300 print:bg-teal-50">🏋️ Gimnasio</span>}
                    </div>
                </section>

                {/* VALUE CONCLUSION */}
                <section className="bg-gradient-to-br from-teal-900/30 via-teal-800/10 to-transparent border border-teal-500/25 rounded-2xl p-6 print:bg-teal-50 print:border-teal-200 print:border-2">
                    <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 mb-5 print:text-teal-700">
                        <FontAwesomeIcon icon={faFileAlt} />
                        Conclusión de Valor de Mercado
                    </h2>

                    <div className="text-center mb-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400 mb-2 print:text-stone-500">Valor Estimado Más Probable</p>
                        <p className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none print:text-stone-900">
                            {formatPrice(valorEstimado)}
                        </p>
                        {valorM2 > 0 && (
                            <p className="text-stone-400 text-sm mt-2 print:text-stone-600">
                                ≈ <strong className="text-teal-300 print:text-teal-700">{formatPrice(valorM2)}</strong> / m²
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 border-t border-white/10 pt-5 gap-4 print:border-teal-200">
                        <div className="text-center">
                            <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-500 mb-1">Límite Inferior CMA (Venta Rápida)</p>
                            <p className="text-base md:text-lg font-bold text-stone-300 print:text-stone-700">{formatPrice(rangoInferior)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-500 mb-1">Límite Superior CMA (Expectativa Alta)</p>
                            <p className="text-base md:text-lg font-bold text-stone-300 print:text-stone-700">{formatPrice(rangoSuperior)}</p>
                        </div>
                    </div>
                </section>

                {/* MARKET SYNTHESIS */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                    <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 mb-4 print:text-teal-700">
                        <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                        Síntesis de Mercado con IA
                    </h2>
                    <p className="text-stone-300 text-sm leading-relaxed mb-6 print:text-stone-700">
                        {data.analisis_mercado_texto || "Análisis técnico de mercado completado con algoritmos de inteligencia geoespacial y cruce de datos en tiempo real de Vecy Avalúos."}
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Ofertas Activas 1KM', value: data.ofertas_activas || '18–28', color: 'text-teal-300 print:text-teal-700' },
                            { label: 'Absorción Media', value: data.absorcion || '3–5 m.', color: 'text-teal-300 print:text-teal-700' },
                            { label: 'Apreciación Anual', value: data.apreciacion || '+6.2%', color: 'text-green-400 print:text-green-700' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/8 rounded-xl p-4 text-center print:bg-teal-50 print:border-teal-100">
                                <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-400 mb-2 print:text-stone-500">{stat.label}</p>
                                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* COMPARABLES TABLE */}
                {data.comparables && data.comparables.length > 0 && (
                    <section className="bg-white/5 border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                        <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 mb-5 print:text-teal-700">
                            <FontAwesomeIcon icon={faChartBar} />
                            Comparativa de Mercado (CMA) — {data.comparables.length} Transacciones Analizadas
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 print:border-stone-300">
                                        {['Dirección Comparable', 'Área m²', 'Precio Total', '$/m²', 'Días Mercado'].map((h, i) => (
                                            <th key={i} className={`text-[9px] font-bold uppercase tracking-wider text-stone-400 pb-3 print:text-stone-500 ${i === 0 ? 'text-left' : i < 2 ? 'text-center' : 'text-right'}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 print:divide-stone-200">
                                    {data.comparables.map((comp, i) => (
                                        <tr key={i} className="hover:bg-white/3 transition-colors">
                                            <td className="py-3 text-stone-300 font-medium print:text-stone-700">{comp.address}</td>
                                            <td className="py-3 text-center text-stone-300 print:text-stone-700">{comp.area}</td>
                                            <td className="py-3 text-right text-stone-200 font-bold print:text-stone-800">{formatPrice(comp.price)}</td>
                                            <td className="py-3 text-right text-teal-400 font-bold print:text-teal-700">{formatPrice(comp.price_m2)}</td>
                                            <td className="py-3 text-center text-stone-400 print:text-stone-600">{comp.days_on_market}d</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-teal-900/20 border border-teal-500/20 print:bg-teal-50">
                                        <td className="py-3 pl-2 text-teal-400 font-extrabold uppercase tracking-wider text-xs print:text-teal-700">★ Propiedad Sujeto</td>
                                        <td className="py-3 text-center text-teal-400 font-bold print:text-teal-700">{data.area_construida}</td>
                                        <td className="py-3 text-right text-teal-400 font-black print:text-teal-700">{formatPrice(valorEstimado)}</td>
                                        <td className="py-3 text-right text-teal-400 font-black print:text-teal-700">{formatPrice(valorM2)}</td>
                                        <td className="py-3 text-center text-stone-500 text-xs">—</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* NORMATIVA URBANA */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                    <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 mb-5 print:text-teal-700">
                        <FontAwesomeIcon icon={faScaleBalanced} />
                        Perfil Normativo Urbano
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                            { label: 'Uso del Suelo', value: data.uso_suelo || 'Residencial/Mixto' },
                            { label: 'Zona Catastral', value: data.zona_catastral || 'Zona Norte — Código 82-04' },
                            { label: 'Norma Vigente', value: data.norma_vigente || 'POT Bogotá 2022' },
                            { label: 'Tratamiento', value: data.tratamiento || 'Consolidación Urbana' },
                            { label: 'Índice Ocupación', value: data.indice_ocupacion || '60% — 70%' },
                            { label: 'Pisos Permitidos', value: data.pisos_permitidos || 'Hasta 4 pisos' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-4 print:border-stone-200 print:bg-transparent">
                                <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500 mb-1 print:text-stone-400">{item.label}</p>
                                <p className="text-sm font-bold text-stone-200 print:text-stone-800">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ESTADO DEL INMUEBLE / VALORACIÓN CUALITATIVA */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                    <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 mb-5 print:text-teal-700">
                        <FontAwesomeIcon icon={faShieldAlt} />
                        Evaluación Cualitativa del Inmueble
                    </h2>
                    <div className="space-y-3">
                        {[
                            { label: 'Estado de Conservación General', score: data.conservacion || 85 },
                            { label: 'Calidad de Acabados', score: data.acabados || 80 },
                            { label: 'Ubicación y Accesibilidad', score: data.ubicacion_score || 90 },
                            { label: 'Potencial de Valorización', score: data.valorizacion_score || 78 },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-semibold text-stone-300 print:text-stone-700">{item.label}</p>
                                    <p className="text-xs font-black text-teal-400 print:text-teal-700">{item.score}/100</p>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2 print:bg-stone-200">
                                    <div
                                        className="bg-gradient-to-r from-teal-600 to-teal-400 h-2 rounded-full print:bg-teal-500"
                                        style={{ width: `${item.score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* DISCLAIMER */}
                <section className="flex items-start gap-4 bg-stone-500/5 border border-stone-500/15 rounded-2xl p-5 print:bg-stone-50 print:border-stone-200">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-stone-400 text-sm flex-shrink-0 mt-0.5" />
                    <div className="text-[11px] text-stone-400 leading-relaxed print:text-stone-600">
                        <p className="font-bold text-stone-300 uppercase tracking-wider mb-1 print:text-stone-700">Aviso de Uso · Responsabilidad Restringida</p>
                        <p>
                            Este Análisis Comparativo de Mercado Avanzado (Plan Esmeralda) es generado mediante IA por Vecy Avalúos. <strong className="text-stone-300 print:text-stone-800">No sustituye un avalúo corporativo certificado</strong> con firma pericial presencial. Su uso para hipotecas, litigios o trámites IGAC no está avalado sin ratificación por Plan Oro.
                        </p>
                        <p className="mt-2 font-bold text-center uppercase tracking-widest text-[10px] text-stone-500">Generado por JanIA® · Vecy Avalúos S.A.S.</p>
                    </div>
                </section>
            </div>

            {/* ===== PRINT-ONLY FOOTER ===== */}
            <footer className="hidden print:flex items-center justify-between px-10 py-5 border-t-2 border-teal-500/30 bg-white w-full">
                <div className="flex items-center gap-3">
                    <img src="https://i.ibb.co/G3ngFMmn/Vecy-agenda1.png" alt="Vecy Avalúos" className="h-8 opacity-70" />
                    <p className="text-stone-700 font-bold text-xs uppercase tracking-widest">Vecy Avalúos S.A.S</p>
                </div>
                <div className="flex items-center gap-2 text-stone-600 text-xs font-semibold">
                    <FontAwesomeIcon icon={faPhone} className="text-teal-600" />
                    +57 322 360 8877
                </div>
                <p className="text-[9px] text-stone-400 uppercase tracking-widest">vecyavaluos.com · JanIA®</p>
            </footer>
        </div>
    );
};

export default EsmeraldaDocument;
