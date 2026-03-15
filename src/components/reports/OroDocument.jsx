import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faExpand, faHome, faExclamationTriangle, faShieldHalved, faStamp, faPhone } from '@fortawesome/free-solid-svg-icons';

const OroDocument = ({ data, chatId }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(price || 0));
    };

    const valorEstimado = data.valor_final_avaluador || data.precio_estimado || 0;
    const rangoInferior = valorEstimado * 0.95;
    const rangoSuperior = valorEstimado * 1.05;

    return (
        <div className="font-jakarta rounded-3xl overflow-hidden shadow-2xl border border-[#CCAC4E]/20 print:shadow-none print:border-none print:rounded-none print:bg-white relative">

            {/* Subtle gold watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] z-0 print:opacity-[0.03]">
                <img src="/perfil.png" alt="" className="w-[480px] rounded-full opacity-50" />
            </div>

            <div className="relative z-10">
                {/* ===== PREMIUM GOLD HEADER ===== */}
                <header className="bg-[#1a1400]/80 backdrop-blur-xl border-b border-[#CCAC4E]/25 px-10 py-8 print:bg-white print:border-b-4 print:border-[#CCAC4E] print:backdrop-filter-none">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                        <div className="flex items-center gap-5">
                            <img src="/perfil.png" alt="JanIA · Vecy Avalúos" className="w-16 h-16 object-cover rounded-full border-2 border-[#CCAC4E]/30" />
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#CCAC4E]/70 mb-0.5">Vecy Avalúos · Dictamen Oficial</p>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none print:text-stone-900">
                                    Avalúo Corporativo
                                </h1>
                                <p className="text-3xl md:text-4xl font-black tracking-[-0.04em] text-[#CCAC4E] leading-tight">ORO</p>
                                <span className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-[#CCAC4E]/10 text-[#CCAC4E] font-semibold text-[10px] uppercase tracking-widest rounded-full border border-[#CCAC4E]/30">
                                    <FontAwesomeIcon icon={faShieldHalved} />
                                    Certificación Pericial Activa
                                </span>
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">Dictamen N°</p>
                            <p className="text-[#CCAC4E] font-bold font-mono text-sm">{chatId ? chatId.substring(0,8).toUpperCase() : 'VECY-8832'}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mt-3 mb-1">Fecha de Emisión</p>
                            <p className="text-white font-bold text-sm print:text-stone-900">{data.cliente_fecha}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mt-3 mb-1">Cliente</p>
                            <p className="text-white font-bold uppercase print:text-stone-900">{data.cliente_nombre}</p>
                        </div>
                    </div>
                </header>

                {/* ===== BODY ===== */}
                <div className="bg-[#100e08]/70 backdrop-blur-xl p-8 md:p-12 space-y-8 print:bg-white print:text-stone-900 print:backdrop-filter-none">

                    {/* PROPERTY IDENTITY */}
                    <section className="bg-white/5 border border-white/10 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200">
                        <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#CCAC4E] mb-5 print:text-[#B8860B]">
                            <FontAwesomeIcon icon={faHome} />
                            Identidad Registral de la Propiedad
                        </h2>

                        <div className="bg-white/3 border border-white/5 rounded-xl p-5 print:bg-transparent print:border-none">
                            <div className="flex flex-col md:flex-row justify-between gap-6 mb-6 pb-6 border-b border-white/10 print:border-stone-200">
                                <div className="flex-1">
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1 print:text-stone-500">Dirección Exacta</p>
                                    <p className="text-xl font-extrabold text-white uppercase leading-tight print:text-stone-900">{data.direccion}</p>
                                    <p className="text-stone-400 text-sm mt-1 flex items-center gap-2 print:text-stone-600">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#CCAC4E] text-xs shrink-0" />
                                        {data.barrio}, {data.localidad} — {data.ciudad}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1 print:text-stone-500">Tipología</p>
                                    <p className="text-lg font-bold text-white uppercase print:text-stone-900">{data.tipo_inmueble}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Área Privada', value: `${data.area_construida} m²` },
                                    { label: 'Estrato SocioE.', value: data.estrato },
                                    { label: 'Habitaciones', value: data.habitaciones },
                                    { label: 'Sanitarios', value: data.banos },
                                ].map((item, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1 print:text-stone-500">{item.label}</p>
                                        <p className="text-xl font-black text-white print:text-stone-900">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* VALUATION DICTAMEN */}
                    <section className="bg-gradient-to-br from-[#CCAC4E]/15 via-[#CCAC4E]/5 to-transparent border border-[#CCAC4E]/30 rounded-2xl p-6 relative overflow-hidden print:bg-yellow-50 print:border-[#CCAC4E]/50 print:border-4 print:border-double">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#CCAC4E]/10 rounded-full blur-2xl print:hidden"></div>
                        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl print:hidden"></div>

                        <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#CCAC4E] mb-6 relative z-10 print:text-[#B8860B]">
                            <FontAwesomeIcon icon={faStamp} />
                            Dictamen de Valor Comercial
                        </h2>

                        <div className="text-center mb-6 relative z-10">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#CCAC4E]/70 mb-3">Valor Pericial Estipulado</p>
                            <p className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none print:text-stone-900">
                                {formatPrice(valorEstimado)}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 border-t border-white/10 pt-5 gap-4 relative z-10 print:border-[#CCAC4E]/30">
                            <div className="text-center">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1">Banda Inferior (Liquidación)</p>
                                <p className="text-lg font-bold text-stone-300 print:text-stone-700">{formatPrice(rangoInferior)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1">Banda Superior (Reposición)</p>
                                <p className="text-lg font-bold text-stone-300 print:text-stone-700">{formatPrice(rangoSuperior)}</p>
                            </div>
                        </div>
                    </section>

                    {/* SIGNATURES */}
                    <section className="bg-white/5 border border-white/10 rounded-2xl p-8 print:bg-stone-50 print:border-stone-200">
                        <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-8">Firmas y Certificaciones Digitales</h2>

                        <div className="flex flex-col md:flex-row justify-around items-end gap-10">
                            <div className="text-center flex flex-col items-center">
                                <div className="w-48 h-14 border-b-2 border-stone-400 mb-3 flex items-end justify-center pb-2">
                                    <span className="text-3xl text-stone-500 opacity-60 tracking-[0.2em] font-light">JanIA V2.5</span>
                                </div>
                                <p className="font-extrabold text-stone-200 text-xs uppercase tracking-wider print:text-stone-800">Firma Digital IA</p>
                                <p className="text-[9px] text-stone-500 uppercase tracking-wider font-mono mt-1">{chatId ? chatId.substring(0, 18) : '0x882A39FFF10'}</p>
                            </div>

                            <div className="text-center w-28 h-28 rounded-full border-4 border-double border-[#CCAC4E]/60 flex items-center justify-center flex-col shrink-0">
                                <FontAwesomeIcon icon={faShieldHalved} className="text-[#CCAC4E] text-2xl mb-1" />
                                <span className="text-[8px] font-bold uppercase tracking-wider text-[#CCAC4E]/80 text-center leading-snug px-2">Sello Oro<br/>Vecy Avalúos</span>
                                <span className="text-[6px] text-stone-500 mt-1">2026 VALID</span>
                            </div>

                            <div className="text-center flex flex-col items-center">
                                <div className="w-48 h-14 border-b-2 border-stone-400 mb-3"></div>
                                <p className="font-extrabold text-stone-200 text-xs uppercase tracking-wider print:text-stone-800">Perito RAA Adscrito</p>
                                <p className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">Línea Validable IGAC</p>
                            </div>
                        </div>
                    </section>

                    {/* LEGAL */}
                    <div className="text-[9px] text-stone-500 text-justify px-2 uppercase leading-relaxed tracking-wider print:text-stone-500">
                        Este informe pericial corporativo «Plan Oro» ha sido ensamblado digitalmente usando el registro de bases primarias y la inteligencia algorítmica de Vecy Avalúos S.A.S. Se expide el día {data.cliente_fecha}. Su validez jurídica completa ante entidades bancarias, notariales y judiciales está condicionada a la firma del perito RAA / RNA en el recuadro adjunto tras inspección ocular. La alteración digital de este documento constituye fraude penado por la ley colombiana.
                    </div>
                </div>
            </div>

            {/* ===== PRINT-ONLY FOOTER ===== */}
            <footer className="report-print-footer hidden print:flex items-center justify-between px-10 py-5 border-t-2 border-[#CCAC4E]/40 bg-stone-50 w-full">
                <div className="flex items-center gap-3">
                    <img src="/perfil.png" alt="JanIA · Vecy Avalúos" className="h-8 opacity-80 rounded-full" />
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

export default OroDocument;
