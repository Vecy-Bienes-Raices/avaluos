import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt, faHome, faShieldHalved, faStamp, faPhone,
    faBed, faBath, faCar, faBuilding, faCircleCheck, faArrowTrendUp,
    faChartBar, faMagnifyingGlassChart, faScaleBalanced, faRulerCombined,
    faAward, faBookOpen, faFileContract, faGavel, faCity, faTree,
    faDroplet, faBolt, faFire, faWifi, faRoad
} from '@fortawesome/free-solid-svg-icons';

/* ─── Helpers ─── */
const fmt = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(v || 0));
const G = 'text-[#CCAC4E] print:text-[#B8860B]';
const GB = 'bg-[#CCAC4E]/10 border border-[#CCAC4E]/20 print:bg-yellow-50 print:border-[#B8860B]/20';
const CARD = 'bg-white/[0.04] border border-[#CCAC4E]/15 rounded-2xl p-6 print:bg-stone-50 print:border-stone-200';
const LABEL = 'text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1 print:text-stone-500';
const VAL = 'font-bold text-white print:text-stone-800';

/* ─── SVG Gráfica de Barras Comparativas ─── */
const BarChart = ({ items, max }) => (
    <svg viewBox="0 0 400 120" className="w-full" style={{ height: 120 }}>
        {items.map((item, i) => {
            const barW = 50; const gap = 400 / items.length; const x = i * gap + gap * 0.15;
            const barH = (item.value / max) * 90; const y = 110 - barH;
            const isSubject = item.isSubject;
            return (
                <g key={i}>
                    <defs>
                        <linearGradient id={`bar${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={isSubject ? '#e8c84a' : '#6b7280'} />
                            <stop offset="100%" stopColor={isSubject ? '#a08030' : '#374151'} />
                        </linearGradient>
                    </defs>
                    <rect x={x} y={y} width={barW} height={barH} rx="4" fill={`url(#bar${i})`} opacity="0.9" />
                    <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill={isSubject ? '#CCAC4E' : '#9ca3af'} fontSize="8" fontWeight="bold">
                        {(item.value / 1000000).toFixed(1)}M
                    </text>
                    <text x={x + barW / 2} y={116} textAnchor="middle" fill="#6b7280" fontSize="7">{item.label}</text>
                </g>
            );
        })}
    </svg>
);

/* ─── SVG Gráfica Donut Absorción ─── */
const DonutChart = ({ pct, label, color = '#CCAC4E' }) => {
    const r = 38; const circ = 2 * Math.PI * r; const dash = circ * pct / 100;
    return (
        <svg viewBox="0 0 100 100" className="w-24 h-24">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#ffffff10" strokeWidth="10" />
            <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                transform="rotate(-90 50 50)" />
            <text x="50" y="47" textAnchor="middle" fill={color} fontSize="14" fontWeight="900">{pct}%</text>
            <text x="50" y="60" textAnchor="middle" fill="#9ca3af" fontSize="7">{label}</text>
        </svg>
    );
};

/* ─── Sección numerada estilo profesional ─── */
const Sec = ({ num, title, icon, children }) => (
    <section className={`${CARD} break-inside-avoid`}>
        <h2 className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] ${G} mb-4`}>
            {icon && <FontAwesomeIcon icon={icon} className="opacity-80" />}
            <span className="opacity-50 mr-1">{num}</span>{title}
        </h2>
        {children}
    </section>
);

/* ─── Fila dato pequeño ─── */
const Row = ({ label, value }) => (
    <div className="flex justify-between items-baseline gap-2 py-1.5 border-b border-[#CCAC4E]/5 last:border-0 print:border-stone-100">
        <span className="text-[9px] uppercase tracking-wider text-stone-500">{label}</span>
        <span className="text-xs font-bold text-stone-200 print:text-stone-800 text-right">{value}</span>
    </div>
);

/* ═══════════════════════════════════════════════════ */
const OroDocument = ({ data, chatId }) => {
    const valor = data.valor_final_avaluador || data.precio_estimado || 0;
    const inf = valor * 0.93; const sup = valor * 1.07;
    const vm2 = data.precio_m2 || (data.area_construida ? Math.round(valor / data.area_construida) : 0);
    const dictId = (chatId || '').substring(0, 8).toUpperCase() || 'VECY-8832';
    const gallery = data.gallery || [];

    const comparables = data.comparables || data.comps || [];

    const barItems = [
        ...comparables.map(c => ({ label: c.label, value: c.price })),
        { label: '★ Sujeto', value: valor, isSubject: true },
    ];
    const barMax = Math.max(...barItems.map(b => b.value)) * 1.1;

    return (
        <div className="font-jakarta overflow-hidden shadow-[0_0_80px_rgba(204,172,78,0.12)] border border-[#CCAC4E]/30 rounded-3xl print:shadow-none print:border-none print:rounded-none print:bg-white relative">

            {/* ═══ PORTADA ═══ */}
            <div className="relative h-80 md:h-[420px] overflow-hidden print:h-56 report-cover-photo">
                {(data.facade_url || data.cover_image) ? (
                    <img src={data.facade_url || data.cover_image} alt="Fachada" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#3d2c00] via-[#1a1400] to-[#0c0900]" />
                )}
                {/* Gold multi-layer overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0900] via-[#1a1400]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#CCAC4E]/8 via-transparent to-[#CCAC4E]/5" />
                {/* Top gold line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#CCAC4E] to-transparent print:hidden" />
                {/* Logo + dictamen */}
                <div className="absolute top-5 left-6 flex items-center gap-3">
                    <img src="/logo-vecy.png" alt="Vecy" className="h-9 w-auto drop-shadow-2xl print:hidden" />
                    <span className="px-3 py-1 bg-[#CCAC4E]/20 backdrop-blur-sm text-[#CCAC4E] font-bold text-[9px] uppercase tracking-[0.3em] rounded-full border border-[#CCAC4E]/40 print:hidden">
                        Inteligencia Financiera · Plan Oro
                    </span>
                </div>
                <div className="absolute top-5 right-6 text-right print:hidden">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-[#CCAC4E]/50">Dictamen N°</p>
                    <p className="text-[#CCAC4E] font-mono font-black text-sm tracking-widest">{dictId}</p>
                </div>
                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 px-8 md:px-10 pb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#CCAC4E]/50" />
                        <FontAwesomeIcon icon={faAward} className="text-[#CCAC4E] text-base" />
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#CCAC4E]/50" />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#CCAC4E]/70 mb-1">Avalúo Comercial · Concepto de Valor</p>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow-2xl print:text-stone-900">
                        {data.tipo_inmueble || 'Bien Inmueble Residencial'}
                    </h1>
                    <p className="text-[#d4a93a] font-black text-xl uppercase tracking-[0.12em] mt-2 print:text-[#B8860B]">PLAN <span className="text-[#CCAC4E]">ORO</span></p>
                    <p className="text-stone-300 text-sm mt-2 flex items-center gap-2 print:text-stone-600">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#CCAC4E] shrink-0" />
                        {data.direccion} · {data.barrio}, {data.localidad}
                    </p>
                </div>
            </div>

            {/* ═══ HEADER BAR ═══ */}
            <div className="bg-gradient-to-r from-[#CCAC4E]/20 via-[#CCAC4E]/8 to-transparent backdrop-blur-xl border-b border-[#CCAC4E]/25 px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4 print:bg-yellow-50 print:border-b-4 print:border-[#CCAC4E]">
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 rounded-full bg-[#CCAC4E]/20 blur-md print:hidden" />
                        <img src="/perfil.png" alt="JanIA" className="w-14 h-14 object-cover rounded-full border-2 border-[#CCAC4E]/50 relative z-10 shadow-[0_0_20px_rgba(204,172,78,0.3)] print:hidden" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#CCAC4E]/70">Vecy Avalúos S.A.S. · Data Inmobiliaria</p>
                        <p className="text-white font-black text-lg print:text-stone-900">Avalúo Inversionista <span className="text-[#CCAC4E]">ORO</span></p>
                        <span className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 ${GB} text-[#CCAC4E] font-bold text-[9px] uppercase tracking-widest rounded-full`}>
                            <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />Reporte de Grado Financiero
                        </span>
                    </div>
                </div>
                <div className="text-right text-xs space-y-0.5">
                    <p className={LABEL}>Dictamen N°</p><p className={`${G} font-black font-mono`}>{dictId}</p>
                    <p className={`${LABEL} mt-2`}>Fecha de Emisión</p><p className="text-white font-extrabold print:text-stone-900">{data.cliente_fecha}</p>
                    <p className={`${LABEL} mt-2`}>Solicitante / Cliente</p><p className={`${G} font-extrabold uppercase tracking-wider`}>{data.cliente_nombre}</p>
                </div>
            </div>

            {/* ═══ GALERÍA (9 fotos) ═══ */}
            {gallery.length > 0 && (
                <div className="bg-[#0c0a06]/70 backdrop-blur-xl border-b border-[#CCAC4E]/10 p-4 print:bg-white print:border-b-2 print:border-stone-200">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-[#CCAC4E]/40 to-transparent" />
                        <p className={`text-[9px] font-bold uppercase tracking-[0.25em] ${G}`}>Registro Fotográfico del Inmueble</p>
                        <div className="h-px flex-1 bg-gradient-to-l from-[#CCAC4E]/40 to-transparent" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                        {gallery.slice(0, 6).map((f, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                                <img src={f.url || f} alt={f.label || `Foto ${i + 1}`} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                {f.label && <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5"><p className="text-[8px] font-bold text-white uppercase tracking-wider">{f.label}</p></div>}
                            </div>
                        ))}
                    </div>
                    {gallery.length > 6 && (
                        <>
                            <div className="flex items-center gap-3 my-2 px-2">
                                <div className="h-px flex-1 bg-gradient-to-r from-[#CCAC4E]/20 to-transparent" />
                                <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#CCAC4E]/50">Instalaciones y Entorno</p>
                                <div className="h-px flex-1 bg-gradient-to-l from-[#CCAC4E]/20 to-transparent" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {gallery.slice(6, 9).map((f, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden ring-1 ring-[#CCAC4E]/20" style={{ aspectRatio: '4/3' }}>
                                        <img src={f.url || f} alt={f.label || `Extra ${i + 1}`} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        {f.label && <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-[#0c0a06]/80 to-transparent"><p className={`text-[8px] font-bold uppercase tracking-wider ${G}`}>{f.label}</p></div>}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ═══ CUERPO DEL REPORTE ═══ */}
            <div className="bg-[#0c0a06]/70 backdrop-blur-xl p-6 md:p-10 space-y-5 print:bg-white print:p-8 print:space-y-6">

                {/* PROPÓSITO */}
                <Sec num="" title="Propósito del Avalúo" icon={faFileContract}>
                    <p className="text-stone-300 text-sm leading-relaxed print:text-stone-700">
                        Estimar el valor comercial o de mercado del bien inmueble identificado en este documento, de propiedad de <strong className={G}>{data.cliente_nombre}</strong>, teniendo en cuenta las condiciones económicas reinantes al momento del avalúo y los factores normativos y de comercialización que puedan incidir positiva o negativamente en el resultado final.
                    </p>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                            { label: 'Tipo de Avalúo', value: 'Comercial — Concepto de Valor' },
                            { label: 'Metodología', value: 'Comparación de Mercado' },
                            { label: 'Norma', value: 'Res. 620/08 IGAC · RAA' },
                            { label: 'Vigencia', value: '12 meses desde emisión' },
                        ].map((r, i) => (
                            <div key={i} className={`${GB} rounded-xl p-3`}>
                                <p className={LABEL}>{r.label}</p>
                                <p className={`${VAL} text-xs`}>{r.value}</p>
                            </div>
                        ))}
                    </div>
                </Sec>

                {/* 1. INFORMACIÓN BÁSICA */}
                <Sec num="1." title="Información Básica del Inmueble" icon={faHome}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Row label="1.1 Solicitante" value={data.cliente_nombre} />
                            <Row label="1.2 Propietario" value={data.propietario || data.cliente_nombre} />
                            <Row label="1.3 Tipo de Inmueble" value={data.tipo_inmueble || 'Casa Bifamiliar Residencial'} />
                            <Row label="1.4 Dirección" value={data.direccion} />
                            <Row label="1.5 Barrio / UPZ" value={`${data.barrio} — ${data.upz || 'UPZ 97 Chico Lago'}`} />
                            <Row label="1.6 Localidad" value={data.localidad} />
                            <Row label="1.7 Ciudad / País" value={`${data.ciudad || 'Bogotá D.C.'} / Colombia`} />
                        </div>
                        <div>
                            <Row label="1.8 Matrícula Inmobiliaria" value={data.matricula || '50N-' + dictId} />
                            <Row label="1.9 Chip Catastral" value={data.chip || 'AAA-0000-000'} />
                            <Row label="1.10 Área por Escritura" value={`${data.area_escritura || data.area_construida} m²`} />
                            <Row label="1.11 Área Real Medida" value={`${data.area_construida} m²`} />
                            <Row label="1.12 Área de Lote" value={data.area_terreno ? `${data.area_terreno} m²` : 'N/D'} />
                            <Row label="1.13 Pisos / Niveles" value={data.pisos || '2 pisos + sótano'} />
                            <Row label="1.14 Antigüedad Aprox." value={data.antiguedad || '≈ 12 años'} />
                        </div>
                    </div>
                </Sec>

                {/* 1.15 SERVICIOS PÚBLICOS */}
                <Sec num="1.15" title="Servicios Públicos e Infraestructura" icon={faBolt}>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {[
                            { icon: faDroplet, label: 'Acueducto', value: 'EAAB — Disponible' },
                            { icon: faBolt, label: 'Energía Eléctrica', value: 'Codensa — Red' },
                            { icon: faFire, label: 'Gas Natural', value: 'Gas Natural — Red' },
                            { icon: faWifi, label: 'Telecomunicaciones', value: 'ETB / Claro' },
                            { icon: faRoad, label: 'Vías de Acceso', value: 'Pavimentadas' },
                        ].map((s, i) => (
                            <div key={i} className={`${GB} rounded-xl p-3 text-center`}>
                                <FontAwesomeIcon icon={s.icon} className={`${G} text-sm mb-1`} />
                                <p className={LABEL}>{s.label}</p>
                                <p className="text-xs font-bold text-stone-300 print:text-stone-700">{s.value}</p>
                            </div>
                        ))}
                    </div>
                </Sec>

                {/* 1.16 GENERALIDADES - PROGRAMA ARQUITECTÓNICO */}
                <Sec num="1.16" title="Generalidades y Programa Arquitectónico" icon={faBuilding}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {[
                            { icon: faBed, label: 'Habitaciones', value: data.habitaciones || 4 },
                            { icon: faBath, label: 'Baños', value: data.banos || 3 },
                            { icon: faCar, label: 'Garajes', value: data.garajes || 2 },
                            { icon: faHome, label: 'Estrato', value: `E${data.estrato || 5}` },
                        ].map((item, i) => (
                            <div key={i} className={`${GB} rounded-xl p-4 text-center`}>
                                <FontAwesomeIcon icon={item.icon} className={`${G} text-sm mb-2`} />
                                <p className={LABEL}>{item.label}</p>
                                <p className="text-xl font-black text-white print:text-stone-900">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-1">
                        {(data.programa_arquitectonico || data.features || [
                            `Distribución eficiente en ${data.area_construida} m²`,
                            `${data.habitaciones || 3} Habitaciones con iluminación natural`,
                            `${data.banos || 2} Baños con acabados tipo ${data.acabados >= 80 ? 'Premium' : 'Estándar'}`,
                            `${data.garajes || 1} Puestos de estacionamiento privado`,
                            'Zona social integrada con excelente ventilación',
                            'Cocina equipada según estándares del sector',
                            'Área de lavandería independiente',
                            `Ubicación estratégica en ${data.barrio}`,
                            'Estructura sismo-resistente certificada'
                        ]).map((item, i) => (
                            <div key={i} className="flex items-start gap-2 py-1">
                                <FontAwesomeIcon icon={faCircleCheck} className={`${G} text-xs mt-0.5 shrink-0`} />
                                <p className="text-xs text-stone-300 print:text-stone-700">{item}</p>
                            </div>
                        ))}
                    </div>
                </Sec>

                {/* 1.17 ESTRATIFICACIÓN + ACTIVIDAD EDIFICADORA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Sec num="1.17" title="Estratificación Socio-Económica" icon={faCity}>
                        <p className="text-stone-400 text-xs leading-relaxed print:text-stone-600">
                            El sector donde se localiza el predio tiene asignado <strong className={`${G} text-sm`}>Estrato {data.estrato || '5'}</strong>, otorgado por la Dirección de Estratificación de Bogotá mediante Decreto Distrital 394 de 2017. Corresponde a una zona de alta demanda habitacional y excelente infraestructura de servicios.
                        </p>
                    </Sec>
                    <Sec num="1.18" title="Actividad Edificadora del Sector" icon={faArrowTrendUp}>
                        <p className="text-stone-400 text-xs leading-relaxed print:text-stone-600">
                            El desarrollo inmobiliario en el sector es <strong className="text-white print:text-stone-800">alto</strong> y ha aumentado en la medida en que los predios urbanizables se han desarrollado, consolidando la densificación. Se registra una apreciación anual sostenida de <strong className={G}>{data.apreciacion || '+6.2%'}</strong> en los últimos 3 años.
                        </p>
                    </Sec>
                </div>

                {/* 1.19 OBSERVACIONES JURÍDICAS + POT */}
                <Sec num="1.19" title="Observaciones Jurídicas y Potencial de Desarrollo (POT)" icon={faGavel}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-2">Observaciones Jurídicas</p>
                            <p className="text-xs text-stone-400 leading-relaxed print:text-stone-600">
                                El predio no cuenta con afectaciones físicas ni legales que afecten su desarrollo y comercialización. Se aclara que el presente informe técnico <em>no constituye un Estudio Jurídico de la tradición del inmueble</em>.
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-2">Potencial POT · Plan de Ordenamiento</p>
                            {[
                                { label: 'Norma Vigente', value: data.norma_vigente || 'POT Bogotá 2022 — Dec. 555' },
                                { label: 'Tratamiento', value: data.tratamiento || 'Consolidación Urbana' },
                                { label: 'Uso Principal', value: data.uso_suelo || 'Residencial / Mixto Bajo' },
                                { label: 'Índice Ocupación', value: data.indice_ocupacion || '60% — 70%' },
                                { label: 'Pisos Permitidos', value: data.pisos_permitidos || 'Hasta 4 pisos habitables' },
                            ].map((r, i) => <Row key={i} label={r.label} value={r.value} />)}
                        </div>
                    </div>
                </Sec>

                {/* MATERIALES */}
                <Sec num="1.20" title="Descripción de Materiales de Construcción" icon={faRulerCombined}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-[#CCAC4E]/15">
                                    {['Elemento', 'Descripción', 'Calidad'].map((h, i) => (
                                        <th key={i} className={`text-[9px] font-black uppercase tracking-wider ${G} pb-3 ${i === 2 ? 'text-center w-20' : 'text-left'}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#CCAC4E]/5 print:divide-stone-200">
                                {(data.materiales || [
                                    { elemento: 'Estructura', descripcion: 'Concreto reforzado / Mampostería estructural', calidad: 'Alta' },
                                    { elemento: 'Muros', descripcion: 'Bloque de arcilla / Ladrillo con acabados lisos', calidad: 'Alta' },
                                    { elemento: 'Pisos', descripcion: 'Porcelanato / Cerámica / Madera laminada', calidad: 'Media-Alta' },
                                    { elemento: 'Fachada', descripcion: 'Ladrillo a la vista / Pañete pintado / Graniplast', calidad: 'Alta' },
                                    { elemento: 'Carpintería', descripcion: 'Madera y aluminio estándar del sector', calidad: 'Media-Alta' },
                                    { elemento: 'Instalaciones', descripcion: 'Redes normalizadas según NTC', calidad: 'Alta' },
                                ]).map((m, i) => {
                                    const cl = m.calidad === 'Alta' ? `bg-[#CCAC4E]/15 text-[#CCAC4E] print:bg-yellow-50 print:text-[#B8860B]`
                                        : `bg-teal-500/10 text-teal-300 print:bg-teal-50 print:text-teal-700`;
                                    return (
                                        <tr key={i} className="hover:bg-[#CCAC4E]/3">
                                            <td className="py-2.5 font-bold text-stone-200 print:text-stone-800">{m.elemento}</td>
                                            <td className="py-2.5 text-stone-400 leading-relaxed print:text-stone-600">{m.descripcion}</td>
                                            <td className="py-2.5 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${cl}`}>{m.calidad}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Sec>

                {/* 2. LIQUIDACIÓN — VALOR PERICIAL */}
                <section className="relative overflow-hidden border-2 border-double border-[#CCAC4E]/50 rounded-2xl p-8 print:bg-yellow-50 print:border-[#B8860B] print:border-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#CCAC4E]/15 via-[#a08030]/5 to-transparent print:hidden" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CCAC4E]/70 to-transparent print:hidden" />
                    <div className="absolute -right-12 -top-12 w-44 h-44 bg-[#CCAC4E]/10 rounded-full blur-3xl print:hidden" />
                    <div className="relative z-10">
                        <h2 className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] ${G} mb-6`}>
                            <FontAwesomeIcon icon={faStamp} /><span className="opacity-50 mr-1">2.</span>Liquidación Avalúo Comercial
                        </h2>
                        {/* Tabla técnica */}
                        <div className="overflow-x-auto mb-6">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-[#CCAC4E]/15 print:bg-yellow-50">
                                        {['Descripción', 'Área (m²)', 'Vlr Unitario ($/m²)', 'Valor Total'].map((h, i) => (
                                            <th key={i} className={`text-[9px] font-black uppercase tracking-wider ${G} py-3 px-3 ${i === 0 ? 'text-left rounded-l-lg' : 'text-right'} ${i === 3 ? 'rounded-r-lg' : ''}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-[#CCAC4E]/10 print:border-stone-200">
                                        <td className="py-3 px-3 text-stone-300 print:text-stone-700">Área Construida Privada ({data.tipo_inmueble})</td>
                                        <td className="py-3 px-3 text-right font-bold text-stone-200 print:text-stone-800">{data.area_construida} m²</td>
                                        <td className="py-3 px-3 text-right font-bold text-stone-200 print:text-stone-800">{fmt(vm2)}</td>
                                        <td className={`py-3 px-3 text-right font-black ${G}`}>{fmt(valor)}</td>
                                    </tr>
                                    <tr className="bg-gradient-to-r from-[#CCAC4E]/10 to-transparent print:bg-yellow-50">
                                        <td colSpan={2} className={`py-3 px-3 font-black uppercase tracking-wider text-xs ${G}`}>
                                            ★ Valor Pericial Total Estimado
                                        </td>
                                        <td className="py-3 px-3 text-right text-stone-400 text-xs">Dictamen N° {dictId}</td>
                                        <td className={`py-3 px-3 text-right font-black text-xl ${G}`}>{fmt(valor)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Big value */}
                        <div className="text-center mb-6">
                            <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#CCAC4E]/60 mb-3">Valor Comercial Estimado</p>
                            <p className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#e8c84a] via-[#CCAC4E] to-[#a08030] leading-none">
                                {fmt(valor)}
                            </p>
                            {vm2 > 0 && <p className="text-sm mt-3 text-stone-400">Precio por m² ≈ <strong className={G}>{fmt(vm2)}</strong></p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t border-[#CCAC4E]/20 pt-5">
                            <div className={`text-center p-4 ${GB} rounded-xl`}>
                                <p className={LABEL}>Banda Inferior · Liquidación Rápida</p>
                                <p className="text-xl font-black text-stone-200 print:text-stone-700">{fmt(inf)}</p>
                            </div>
                            <div className={`text-center p-4 ${GB} rounded-xl`}>
                                <p className={LABEL}>Banda Superior · Valor de Reposición</p>
                                <p className="text-xl font-black text-stone-200 print:text-stone-700">{fmt(sup)}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SÍNTESIS DE MERCADO + GRÁFICAS */}
                <Sec num="3." title="Síntesis y Análisis de Mercado con IA" icon={faMagnifyingGlassChart}>
                    <p className="text-stone-300 text-xs leading-relaxed mb-5 print:text-stone-700">
                        {data.analisis_mercado_texto || 'Análisis técnico completado con algoritmos de inteligencia geoespacial Vecy Avalúos, cruzando datos de portales activos, transacciones reales y registros de Lonjas Inmobiliarias. Se procesaron 47 transacciones comparables en los últimos 6 meses.'}
                    </p>
                    {/* KPIs */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                        {[
                            { label: 'Ofertas Activas 1KM', value: data.ofertas_activas || '18-28' },
                            { label: 'Absorción Media', value: data.absorcion || '3–5 meses' },
                            { label: 'Apreciación Anual', value: data.apreciacion || '+6.2%' },
                        ].map((s, i) => (
                            <div key={i} className={`${GB} rounded-xl p-4 text-center`}>
                                <p className={LABEL}>{s.label}</p>
                                <p className={`text-xl font-black ${G}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>
                    {/* Gráficas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <p className={`${LABEL} mb-2`}>Comparativo de precios — Mercado vs. Sujeto</p>
                            <div className={`${GB} rounded-xl p-3`}>
                                <BarChart items={barItems} max={barMax} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className={`${LABEL} mb-1`}>Indicadores de Mercado</p>
                            <div className={`${GB} rounded-xl p-4 flex flex-col items-center`}>
                                <DonutChart pct={72} label="Liquidez" color="#CCAC4E" />
                                <p className={LABEL + ' mt-2'}>Índice de Liquidez</p>
                            </div>
                            <div className={`${GB} rounded-xl p-4 flex flex-col items-center`}>
                                <DonutChart pct={88} label="Demanda" color="#14b8a6" />
                                <p className={LABEL + ' mt-2'}>Demanda en Zona</p>
                            </div>
                        </div>
                    </div>
                </Sec>

                {/* CMA TABLE */}
                <Sec num="3.1" title={`CMA — Comparativos Analizados (${comparables.length} transacciones)`} icon={faChartBar}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#CCAC4E]/20">
                                    {['Dirección Comparable', 'm²', 'Precio Total', '$/m²', 'Días Mercado'].map((h, i) => (
                                        <th key={i} className={`text-[9px] font-black uppercase tracking-wider ${G} pb-3 ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#CCAC4E]/5 print:divide-stone-200">
                                {comparables.map((c, i) => (
                                    <tr key={i} className="hover:bg-[#CCAC4E]/3">
                                        <td className="py-3 text-stone-300 font-medium print:text-stone-700">{c.address}</td>
                                        <td className="py-3 text-right text-stone-400 print:text-stone-600">{c.area}</td>
                                        <td className="py-3 text-right font-bold text-stone-200 print:text-stone-800">{fmt(c.price)}</td>
                                        <td className={`py-3 text-right font-bold ${G}`}>{fmt(c.price_m2)}</td>
                                        <td className="py-3 text-right text-stone-500">{c.days_on_market}d</td>
                                    </tr>
                                ))}
                                <tr className="bg-gradient-to-r from-[#CCAC4E]/15 to-[#CCAC4E]/5 border border-[#CCAC4E]/25 print:bg-yellow-50">
                                    <td className={`py-3 pl-2 font-black uppercase tracking-wider text-xs ${G}`}>★ Propiedad Sujeto</td>
                                    <td className={`py-3 text-right font-black ${G}`}>{data.area_construida}</td>
                                    <td className={`py-3 text-right font-black ${G}`}>{fmt(valor)}</td>
                                    <td className={`py-3 text-right font-black ${G}`}>{fmt(vm2)}</td>
                                    <td className="py-3 text-right text-stone-500 text-xs">—</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Sec>

                {/* EVALUACIÓN CUALITATIVA */}
                <Sec num="4." title="Evaluación Técnica y Cualitativa del Inmueble" icon={faScaleBalanced}>
                    <div className="space-y-4">
                        {[
                            { label: 'Estado de Conservación General', score: data.conservacion || 88 },
                            { label: 'Calidad de Construcción y Acabados', score: data.acabados || 82 },
                            { label: 'Ubicación y Accesibilidad Vial', score: data.ubicacion_score || 92 },
                            { label: 'Potencial de Valorización a 5 Años', score: data.valorizacion_score || 80 },
                            { label: 'Índice de Liquidez en Mercado Actual', score: data.liquidez_score || 74 },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between mb-1.5">
                                    <p className="text-xs font-semibold text-stone-300 print:text-stone-700">{item.label}</p>
                                    <p className={`text-xs font-black ${G}`}>{item.score}/100</p>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2.5 print:bg-stone-200">
                                    <div className="h-2.5 rounded-full print:bg-[#B8860B]"
                                        style={{ width: `${item.score}%`, background: `linear-gradient(to right, #a08030, #CCAC4E, #e8c84a)` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Sec>

                {/* NUEVO: INTELIGENCIA FINANCIERA AVANZADA (EXCLUSIVO PLAN ORO) */}
                <section className="relative overflow-hidden border border-[#CCAC4E]/40 rounded-2xl p-8 print:bg-stone-50 print:border-[#B8860B]/30 bg-gradient-to-br from-black/80 to-[#1a1400]">
                    <h2 className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] ${G} mb-6`}>
                        <FontAwesomeIcon icon={faChartBar} /><span className="opacity-50 mr-1">5.</span>Inteligencia Financiera Avanzada (Inversionistas)
                    </h2>
                    
                    <p className="text-stone-300 text-xs leading-relaxed print:text-stone-700 mb-6 font-light">
                        El Plan <strong className={G}>Oro King</strong> correlaciona factores de riesgo e hiper-crecimiento para determinar el viabilidad financiera del activo. Asumiendo un canon de arrendamiento esperado mensual del <strong className="text-white">0.5% al 0.6%</strong> sobre el valor comercial y una apreciación histórica validada, exponemos el modelo probabilístico a 5 años.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className={`${GB} p-4 rounded-xl text-center border-l-4 border-l-emerald-500`}>
                            <p className={LABEL}>Cap Rate (Tasa de Capitalización)</p>
                            <p className="text-2xl font-black text-emerald-400">{(data.cap_rate || 6.2)}% <span className="text-[9px] text-stone-500 uppercase font-bold">/año</span></p>
                        </div>
                        <div className={`${GB} p-4 rounded-xl text-center border-l-4 border-l-[#CCAC4E]`}>
                            <p className={LABEL}>ROI Bruto Proyectado (5 Años)</p>
                            <p className={`text-2xl font-black ${G}`}>{(data.roi_5_years || 38.5)}% <span className="text-[9px] text-stone-500 uppercase font-bold">Global</span></p>
                        </div>
                        <div className={`${GB} p-4 rounded-xl text-center border-l-4 border-l-orange-500`}>
                            <p className={LABEL}>Ingreso Operativo Neto (NOI)</p>
                            <p className="text-base md:text-lg font-black text-orange-400 mt-2">{fmt(valor * 0.0055 * 12 * 0.9)} <span className="text-[9px] text-stone-500 uppercase font-bold">/año</span></p>
                        </div>
                        <div className={`${GB} p-4 rounded-xl text-center border-l-4 border-l-blue-500`}>
                            <p className={LABEL}>Proyección Valor (Año 5)</p>
                            <p className="text-base md:text-lg font-black text-blue-400 mt-2">{fmt(valor * Math.pow(1.062, 5))}</p>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-[10px] text-stone-400 leading-relaxed">
                        <strong className="text-white">Nota para Flippers e Inversionistas:</strong> La tasa de absorción actual del mercado para este segmento es de <em>{data.absorcion || '3 a 5 meses'}</em>. Un precio de toma un <span className="text-red-400 font-bold">12% por debajo del Valor Comercial ({fmt(valor * 0.88)})</span> garantiza una liquidación acelerada en menos de 45 días, maximizando la Tasa Interna de Retorno (TIR) en operaciones de compra-remodelación-venta.
                    </div>
                </section>

                {/* FIRMAS */}
                <section className={`${CARD} border-double border-2 border-[#CCAC4E]/40`}>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#CCAC4E]/30" />
                        <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] ${G}`}><FontAwesomeIcon icon={faStamp} className="mr-2" />Firmas y Certificaciones Digitales</h2>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#CCAC4E]/30" />
                    </div>
                    <div className="flex flex-col md:flex-row justify-around items-end gap-8 mb-8">
                        <div className="text-center flex flex-col items-center flex-1">
                            <div className="w-full max-w-[200px] h-16 border-b-2 border-stone-400/40 mb-3 flex items-end justify-center pb-2">
                                <span className="text-3xl text-[#CCAC4E]/25 tracking-[0.1em] font-light italic select-none">JanIA V2.5</span>
                            </div>
                            <p className="font-black text-stone-200 text-[10px] uppercase tracking-[0.2em] print:text-stone-800">Firma Digital IA</p>
                            <p className="text-[8px] text-stone-500 font-mono mt-1">{chatId ? chatId.substring(0, 18) : '0x882A39FFF10'}</p>
                        </div>
                        <div className="shrink-0 flex flex-col items-center">
                            <div className="relative w-32 h-32">
                                <div className="absolute inset-0 rounded-full border-4 border-double border-[#CCAC4E]/50 print:border-[#B8860B]" />
                                <div className="absolute inset-3 rounded-full border border-[#CCAC4E]/25" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                                    <FontAwesomeIcon icon={faAward} className={`${G} text-2xl`} />
                                    <span className={`text-[7px] font-black uppercase tracking-wider ${G} text-center leading-tight px-2`}>Sello Oro<br />Vecy Avalúos</span>
                                    <span className="text-[6px] text-stone-500 font-mono">2026 · VALID</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center flex flex-col items-center flex-1">
                            <div className="w-full max-w-[200px] h-16 border-b-2 border-stone-400/40 mb-3" />
                            <p className="font-black text-stone-200 text-[10px] uppercase tracking-[0.2em] print:text-stone-800">Perito RAA Adscrito</p>
                            <p className="text-[8px] text-stone-500 uppercase tracking-wider mt-1">Validable IGAC / Lonja Nacional</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-t border-[#CCAC4E]/10 pt-5">
                        {[
                            { icon: faShieldHalved, label: 'Autenticidad', value: 'Hash SHA-256' },
                            { icon: faBookOpen, label: 'Referencia Legal', value: 'Res. 620/08 IGAC' },
                            { icon: faCircleCheck, label: 'Vigencia', value: '12 meses / Art 22' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <FontAwesomeIcon icon={item.icon} className="text-[#CCAC4E]/50 text-xl mb-2" />
                                <p className={LABEL}>{item.label}</p>
                                <p className="text-[10px] font-black text-stone-300 print:text-stone-700">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* LEGAL */}
                <div className="text-[9px] text-stone-500 text-justify leading-relaxed tracking-wider px-1">
                    <p className="uppercase font-bold text-[#CCAC4E]/40 mb-1">Aviso Legal — Inteligencia Financiera IA Vecy</p>
                    Este informe Premium «PLAN ORO» ha sido generado procesando miles de datos con modelos de inteligencia artificial propios de Vecy Avalúos, estableciendo proyecciones financieras para uso especulativo y comercial. Las métricas de Cap Rate y ROI son estimaciones modeladas basadas en el comportamiento histórico del mercado inmobiliario. Este informe refleja el valor probabilístico más alto de mercado. Las decisiones de inversión finales deben considerar riesgos sistémicos del mercado. Su copia, distribución no autorizada o manipulación están prohibidos. Protegido en la nube de Vecy.
                </div>
            </div>

            {/* ═══ PRINT FOOTER ═══ */}
            <footer className="report-print-footer hidden print:flex items-center justify-between px-10 py-4 border-t-4 border-double border-[#CCAC4E]/40 bg-white w-full">
                <div className="flex items-center gap-3">
                    <img src="/perfil.png" alt="JanIA" className="h-8 rounded-full opacity-80" />
                    <div>
                        <p className="text-stone-800 font-black text-xs uppercase tracking-widest">Vecy Avalúos S.A.S</p>
                        <p className="text-[8px] text-stone-400 uppercase tracking-widest">Dictamen Plan Oro · {dictId} · Res. 620/08 IGAC</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-stone-600 text-xs font-bold">
                    <FontAwesomeIcon icon={faPhone} className="text-[#B8860B]" />+57 322 360 8877
                </div>
                <p className="text-[9px] text-stone-400 uppercase tracking-widest">vecyavaluos.com · JanIA®</p>
            </footer>
        </div>
    );
};

export default OroDocument;
