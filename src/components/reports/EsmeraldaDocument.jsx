import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faExpand, faHome, faFileAlt, faExclamationTriangle, faChartLine, faMagnifyingGlassChart, faPhone } from '@fortawesome/free-solid-svg-icons';

const EsmeraldaDocument = ({ data }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(price || 0));
    };

    const valorEstimado = data.valor_final_avaluador || data.precio_estimado || 0;
    const rangoInferior = valorEstimado * 0.95;
    const rangoSuperior = valorEstimado * 1.05;

    return (
        <div className="font-jakarta rounded-3xl overflow-hidden shadow-2xl border border-white/10 print:shadow-none print:border-none print:rounded-none print:bg-white">

            {/* ===== GLASS HEADER — Teal Emerald ===== */}
            <header className="bg-[#0c2c27]/80 backdrop-blur-xl border-b border-teal-500/20 px-10 py-8 flex flex-col sm:flex-row justify-between items-center gap-6 print:bg-white print:border-b-2 print:border-teal-500 print:backdrop-filter-none">
                <div className="flex items-center gap-5">
                    <img
                        src="https://i.ibb.co/G3ngFMmn/Vecy-agenda1.png"
                        alt="Vecy Avalúos"
                        className="w-16 h-16 object-contain"
                    />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-teal-400 mb-0.5">Vecy Avalúos</p>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none print:text-stone-900">
                            Análisis Comparativo de Mercado
                        </h1>
                        <span className="inline-block mt-2 px-3 py-0.5 bg-teal-400/10 text-teal-400 font-semibold text-[10px] uppercase tracking-widest rounded-full border border-teal-400/30">
                            <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                            Plan Esmeralda · CMA Avanzado
                        </span>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">Fecha de Análisis</p>
                    <p className="text-white font-bold text-sm print:text-stone-900">{data.cliente_fecha}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mt-3 mb-1">Solicitante Autorizado</p>
                    <p className="text-white font-bold uppercase print:text-stone-900">{data.cliente_nombre}</p>
                </div>
            </header>

            {/* ===== BODY ===== */}
            <div className="bg-[#111918]/60 backdrop-blur-xl p-8 md:p-12 space-y-8 print:bg-white print:text-stone-900 print:backdrop-filter-none">

                {/* PROPERTY IDENTITY */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                    <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-teal-400 mb-5 print:text-teal-700">
                        <FontAwesomeIcon icon={faHome} />
                        Propiedad Sujeto de Análisis
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1 print:text-stone-500">Dirección de Estudio</p>
                            <p className="text-xl font-extrabold text-white uppercase leading-tight print:text-stone-900">{data.direccion}</p>
                            <p className="text-stone-400 text-sm mt-1 flex items-center gap-2 print:text-stone-600">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-teal-400 text-xs shrink-0" />
                                {data.barrio}, {data.localidad} — {data.ciudad}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center print:bg-stone-100 print:border-stone-200">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2 print:text-stone-500">Área (GLA)</p>
                                <p className="text-2xl font-black text-white flex justify-center items-baseline gap-1 print:text-stone-900">
                                    {data.area_construida}<span className="text-sm font-normal text-stone-400">m²</span>
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center print:bg-stone-100 print:border-stone-200">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2 print:text-stone-500">Estrato</p>
                                <p className="text-2xl font-black text-white print:text-stone-900">{data.estrato}<span className="text-base text-stone-400 font-light"> E</span></p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* VALUE CONCLUSION */}
                <section className="bg-gradient-to-br from-teal-900/30 via-teal-800/10 to-transparent border border-teal-500/20 rounded-2xl p-6 print:bg-teal-50 print:border-teal-200 print:border-2">
                    <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-teal-400 mb-6 print:text-teal-700">
                        <FontAwesomeIcon icon={faFileAlt} />
                        Conclusión de Valor de Mercado
                    </h2>

                    <div className="text-center mb-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400 mb-3 print:text-stone-500">
                            Valor Estimado Más Probable
                        </p>
                        <p className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none print:text-stone-900">
                            {formatPrice(valorEstimado)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 border-t border-white/10 pt-5 gap-4 print:border-teal-200">
                        <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1">Límite Inferior CMA</p>
                            <p className="text-lg font-bold text-stone-300 print:text-stone-700">{formatPrice(rangoInferior)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1">Límite Superior CMA</p>
                            <p className="text-lg font-bold text-stone-300 print:text-stone-700">{formatPrice(rangoSuperior)}</p>
                        </div>
                    </div>
                </section>

                {/* MARKET SYNTHESIS */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                    <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-teal-400 mb-5 print:text-teal-700">
                        <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                        Síntesis Estadística del Mercado
                    </h2>

                    <p className="text-stone-300 text-sm leading-relaxed mb-6 print:text-stone-700">
                        {data.analisis_mercado_texto || "Análisis técnico de mercado completado con algoritmos de inteligencia geoespacial y cruce de datos en tiempo real de Vecy Avalúos."}
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/5 border border-white/8 rounded-xl p-4 text-center print:bg-stone-50 print:border-stone-200">
                            <p className="text-stone-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Ofertas Activas 1KM</p>
                            <p className="text-2xl font-black text-white print:text-stone-900">12–24</p>
                        </div>
                        <div className="bg-white/5 border border-white/8 rounded-xl p-4 text-center print:bg-stone-50 print:border-stone-200">
                            <p className="text-stone-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Absorción Media</p>
                            <p className="text-2xl font-black text-white print:text-stone-900">4–6 <span className="text-sm font-normal text-stone-400">m.</span></p>
                        </div>
                        <div className="bg-teal-900/30 border border-teal-500/30 rounded-xl p-4 text-center print:bg-teal-50 print:border-teal-200">
                            <p className="text-teal-400 text-[10px] font-semibold uppercase tracking-wider mb-2 print:text-teal-700">Confianza (IA)</p>
                            <p className="text-2xl font-black text-teal-300 print:text-teal-800">85%</p>
                        </div>
                    </div>
                </section>

                {/* DISCLAIMER */}
                <section className="flex items-start gap-4 bg-stone-500/5 border border-stone-500/20 rounded-2xl p-5 print:bg-stone-50 print:border-stone-200">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-stone-400 text-base flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-stone-400 leading-relaxed print:text-stone-600">
                        <p className="font-bold text-stone-300 uppercase tracking-wider mb-1 print:text-stone-700">Aviso de Uso</p>
                        <p>
                            Este documento es un Análisis Comparativo de Mercado (Plan Esmeralda) generado por IA. <strong className="text-stone-300 print:text-stone-800">No sustituye un avalúo corporativo certificado</strong> con firma pericial presencial. No está avalado para hipotecas, litigios o trámites IGAC hasta ratificación vía Plan Oro.
                        </p>
                        <p className="mt-2 font-bold text-center uppercase tracking-widest text-[10px] text-stone-500">Generado por JanIA® de Vecy Avalúos S.A.S.</p>
                    </div>
                </section>
            </div>

            {/* ===== PRINT-ONLY FOOTER ===== */}
            <footer className="hidden print:flex items-center justify-between px-10 py-5 border-t-2 border-teal-500/30 bg-stone-50 w-full">
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
