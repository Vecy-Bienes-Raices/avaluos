import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faExpand, faHome, faFileAlt, faExclamationTriangle, faPhone, faBed, faBath, faCar, faSquare, faChartBar, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';

const CafeDocument = ({ data }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(price || 0));
    };

    const valorEstimado = data.valor_final_avaluador || data.precio_estimado || 0;
    const rangoInferior = valorEstimado * 0.95;
    const rangoSuperior = valorEstimado * 1.05;
    const valorM2 = data.precio_m2 || (data.area_construida ? Math.round(valorEstimado / data.area_construida) : 0);

    return (
        <div className="font-jakarta rounded-3xl overflow-hidden shadow-2xl border border-white/10 print:shadow-none print:border-none print:rounded-none print:bg-white">

            {/* ===== PORTADA CON FOTO ===== */}
            {(data.facade_url || data.cover_image) && (
                <div className="relative h-56 md:h-72 overflow-hidden print:h-48">
                    <img
                        src={data.facade_url || data.cover_image}
                        alt="Inmueble sujeto"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {/* gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1210] via-[#1a1210]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#CCAC4E]/80 mb-1">Vecy Avalúos · Plan Café</p>
                        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-none drop-shadow-xl print:text-stone-900">
                            {data.tipo_inmueble || 'Inmueble Residencial'}
                        </h1>
                        <p className="text-stone-300 text-sm mt-1 flex items-center gap-2 drop-shadow print:text-stone-600">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#CCAC4E]" />
                            {data.barrio}, {data.localidad} — {data.ciudad}
                        </p>
                    </div>
                </div>
            )}

            {/* ===== GLASS HEADER (sin portada, o complementario) ===== */}
            <header className="bg-[#2c2420]/80 backdrop-blur-xl border-b border-white/10 px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 print:bg-white print:border-b-2 print:border-[#CCAC4E] print:backdrop-filter-none">
                <div className="flex items-center gap-4">
                    <img src="https://i.ibb.co/G3ngFMmn/Vecy-agenda1.png" alt="Vecy Avalúos" className="w-12 h-12 object-contain" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CCAC4E]">Reporte Analítico</p>
                        <span className="inline-block px-3 py-0.5 bg-[#CCAC4E]/10 text-[#CCAC4E] font-semibold text-[10px] uppercase tracking-widest rounded-full border border-[#CCAC4E]/30">
                            Plan Café · Pre-Avalúo
                        </span>
                    </div>
                </div>

                <div className="text-right shrink-0 text-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-0.5">Emitido</p>
                    <p className="text-white font-bold print:text-stone-900">{data.cliente_fecha}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mt-2 mb-0.5">Solicitante</p>
                    <p className="text-white font-bold uppercase print:text-stone-900">{data.cliente_nombre}</p>
                </div>
            </header>

            {/* ===== BODY ===== */}
            <div className="bg-[#1e1c1a]/60 backdrop-blur-xl p-6 md:p-10 space-y-6 print:bg-white print:text-stone-900 print:backdrop-filter-none">

                {/* PROPERTY DETAILS GRID */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                    <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#CCAC4E] mb-5 print:text-[#B8860B]">
                        <FontAwesomeIcon icon={faHome} />
                        Identificación del Inmueble
                    </h2>

                    <div className="mb-5">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1 print:text-stone-500">Dirección Registrada</p>
                        <p className="text-lg md:text-xl font-extrabold text-white uppercase leading-tight print:text-stone-900">{data.direccion}</p>
                    </div>

                    {/* Metrics Icons Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { icon: faExpand, label: 'Área', value: `${data.area_construida} m²` },
                            { icon: faBed, label: 'Habitaciones', value: data.habitaciones || '–' },
                            { icon: faBath, label: 'Baños', value: data.banos || '–' },
                            { icon: faHome, label: 'Estrato', value: `E${data.estrato}` },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/8 rounded-xl p-4 text-center print:bg-stone-100 print:border-stone-200">
                                <FontAwesomeIcon icon={item.icon} className="text-[#CCAC4E] text-base mb-2" />
                                <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-400 mb-1">{item.label}</p>
                                <p className="text-lg font-black text-white print:text-stone-900">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    {data.antiguedad && (
                        <p className="text-xs text-stone-500 mt-4 print:text-stone-600">
                            <span className="font-semibold text-stone-400">Antigüedad:</span> {data.antiguedad}
                            {data.garajes ? <> &nbsp;·&nbsp; <span className="font-semibold text-stone-400">Garajes:</span> {data.garajes}</> : null}
                            {data.area_terreno ? <> &nbsp;·&nbsp; <span className="font-semibold text-stone-400">Lote:</span> {data.area_terreno} m²</> : null}
                        </p>
                    )}
                </section>

                {/* VALUE ESTIMATE */}
                <section className="bg-gradient-to-br from-[#CCAC4E]/15 via-[#CCAC4E]/5 to-transparent border border-[#CCAC4E]/25 rounded-2xl p-6 print:bg-yellow-50 print:border-[#CCAC4E]/40 print:border-2">
                    <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#CCAC4E] mb-5 print:text-[#B8860B]">
                        <FontAwesomeIcon icon={faFileAlt} />
                        Análisis de Valor Comercial
                    </h2>

                    <div className="text-center mb-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400 mb-2 print:text-stone-500">Valor Estimado Sugerido</p>
                        <p className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none print:text-stone-900">
                            {formatPrice(valorEstimado)}
                        </p>
                        {valorM2 > 0 && (
                            <p className="text-stone-400 text-sm mt-2 print:text-stone-600">
                                ≈ <strong className="text-stone-300 print:text-stone-700">{formatPrice(valorM2)}</strong> / m²
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 border-t border-white/10 pt-4 gap-4 print:border-[#CCAC4E]/20">
                        <div className="text-center">
                            <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-500 mb-1">Límite Inferior (Venta Rápida)</p>
                            <p className="text-base md:text-lg font-bold text-stone-300 print:text-stone-700">{formatPrice(rangoInferior)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-500 mb-1">Límite Superior (Alta Expectativa)</p>
                            <p className="text-base md:text-lg font-bold text-stone-300 print:text-stone-700">{formatPrice(rangoSuperior)}</p>
                        </div>
                    </div>
                </section>

                {/* MARKET ANALYSIS */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                    <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#CCAC4E] mb-4 print:text-[#B8860B]">
                        <FontAwesomeIcon icon={faArrowTrendUp} />
                        Síntesis de Mercado
                    </h2>
                    <p className="text-stone-300 text-sm leading-relaxed print:text-stone-700">
                        {data.analisis_mercado_texto || "Análisis técnico de mercado completado con algoritmos de inteligencia geoespacial y cruce de datos en tiempo real de Vecy Avalúos."}
                    </p>
                </section>

                {/* COMPARABLES TABLE */}
                {data.comparables && data.comparables.length > 0 && (
                    <section className="bg-white/5 border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                        <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#CCAC4E] mb-5 print:text-[#B8860B]">
                            <FontAwesomeIcon icon={faChartBar} />
                            Comparativa de Mercado (CMA)
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 print:border-stone-300">
                                        <th className="text-left text-[9px] font-bold uppercase tracking-wider text-stone-400 pb-3 print:text-stone-500">Dirección Comparable</th>
                                        <th className="text-center text-[9px] font-bold uppercase tracking-wider text-stone-400 pb-3 print:text-stone-500">Área m²</th>
                                        <th className="text-right text-[9px] font-bold uppercase tracking-wider text-stone-400 pb-3 print:text-stone-500">Precio Total</th>
                                        <th className="text-right text-[9px] font-bold uppercase tracking-wider text-stone-400 pb-3 print:text-stone-500">$/m²</th>
                                        <th className="text-center text-[9px] font-bold uppercase tracking-wider text-stone-400 pb-3 print:text-stone-500">Días mercado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 print:divide-stone-200">
                                    {data.comparables.map((comp, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="py-3 text-stone-300 font-medium print:text-stone-700">{comp.address}</td>
                                            <td className="py-3 text-center text-stone-300 print:text-stone-700">{comp.area}</td>
                                            <td className="py-3 text-right text-stone-200 font-bold print:text-stone-800">{formatPrice(comp.price)}</td>
                                            <td className="py-3 text-right text-[#CCAC4E] font-bold print:text-[#B8860B]">{formatPrice(comp.price_m2)}</td>
                                            <td className="py-3 text-center text-stone-400 print:text-stone-600">{comp.days_on_market}d</td>
                                        </tr>
                                    ))}
                                    {/* SUJETO RESALTADO */}
                                    <tr className="bg-[#CCAC4E]/10 border border-[#CCAC4E]/20 rounded-lg print:bg-yellow-50">
                                        <td className="py-3 pl-2 text-[#CCAC4E] font-extrabold uppercase tracking-wider text-xs print:text-[#B8860B]">
                                            ★ Propiedad Sujeto
                                        </td>
                                        <td className="py-3 text-center text-[#CCAC4E] font-bold print:text-[#B8860B]">{data.area_construida}</td>
                                        <td className="py-3 text-right text-[#CCAC4E] font-black print:text-[#B8860B]">{formatPrice(valorEstimado)}</td>
                                        <td className="py-3 text-right text-[#CCAC4E] font-black print:text-[#B8860B]">{formatPrice(valorM2)}</td>
                                        <td className="py-3 text-center text-stone-500 text-xs">—</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* LEGAL DISCLAIMER */}
                <section className="flex items-start gap-4 bg-amber-500/5 border border-amber-500/15 rounded-2xl p-5 print:bg-amber-50 print:border-amber-200">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-400 text-sm flex-shrink-0 mt-0.5" />
                    <div className="text-[11px] text-stone-400 leading-relaxed print:text-stone-600">
                        <p className="font-bold text-amber-300 uppercase tracking-wider mb-1 print:text-amber-700">Aviso Legal · Limitación de Responsabilidad</p>
                        <p>
                            Este reporte analítico preliminar (Plan Café) es generado automáticamente por JanIA de Vecy Avalúos y <strong className="text-stone-300 print:text-stone-800">no constituye un avalúo comercial certificado</strong>. Los valores son estimaciones estadísticas sin validez para trámites notariales, crediticios o litigiosos. Para un Dictamen Pericial con validez RAA/RNA actualice al <strong className="text-[#CCAC4E] print:text-[#B8860B]">Plan Oro</strong> en vecyavaluos.com.
                        </p>
                    </div>
                </section>
            </div>

            {/* ===== PRINT-ONLY FOOTER ===== */}
            <footer className="hidden print:flex items-center justify-between px-10 py-5 border-t-2 border-[#CCAC4E]/40 bg-white w-full">
                <div className="flex items-center gap-3">
                    <img src="https://i.ibb.co/G3ngFMmn/Vecy-agenda1.png" alt="Vecy Avalúos" className="h-8 opacity-70" />
                    <p className="text-stone-700 font-bold text-xs uppercase tracking-widest">Vecy Avalúos S.A.S</p>
                </div>
                <div className="flex items-center gap-2 text-stone-600 text-xs font-semibold">
                    <FontAwesomeIcon icon={faPhone} className="text-[#CCAC4E]" />
                    +57 322 360 8877
                </div>
                <p className="text-[9px] text-stone-400 uppercase tracking-widest">vecyavaluos.com · JanIA®</p>
            </footer>
        </div>
    );
};

export default CafeDocument;
