import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/VecyPhoenix/Footer';
import CafeDocument from '../components/reports/CafeDocument';
import EsmeraldaDocument from '../components/reports/EsmeraldaDocument';
import OroDocument from '../components/reports/OroDocument';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faShareNodes, faArrowLeft, faPrint, faEnvelope, faXmark, faLink, faBriefcase, faClipboard, faShieldHalved, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebook, faXTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const ReportPage = () => {
    const { id: chatId } = useParams();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareToast, setShareToast] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // --- DEMO DATA (para previsualización sin BD) ---
    const isDemo = chatId?.startsWith('demo-');
    const demoPlan = chatId?.replace('demo-', '') || 'cafe';

    const DEMO_DATA = {
        planType: demoPlan,
        user_name: 'Carlos Andrés Rodríguez',
        property_data: {
            tipo_inmueble: 'Casa Bifamiliar',
            direccion_normalizada: 'Calle 127B # 52A-34',
            barrio: 'Polo Club',
            localidad: 'Usaquén',
            ciudad: 'Bogotá D.C.',
            estrato: 5,
            habitaciones: 4,
            banos: 3,
            garajes: 2,
            area: 148,
            area_construida: 148,
            area_terreno: 210,
            antiguedad: '12 años',
            zonas_comunes: 'Jardín privado, BBQ',
            piscina: false,
            gym: false,
            precio_estimado: 1_320_000_000,
            valor_final_avaluador: 1_320_000_000,
            precio_m2: 8_918_918,
            lat: 4.7110,
            lng: -74.0490,
            // Fachada — foto de casa estilo Colombia estrato 5
            facade_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
            cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
            // Galería de interiores (usada en Plan Esmeralda y Oro)
            gallery: [
                { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', label: 'Sala principal' },
                { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', label: 'Cocina integral' },
                { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', label: 'Habitación principal' },
                { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80', label: 'Baño principal' },
                { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80', label: 'Comedor' },
                { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', label: 'Jardín / antejardín' },
            ],
            // Texto de mercado
            analisis_mercado_texto: 'El sector de Polo Club - Usaquén registra en el primer trimestre de 2026 una oferta activa de 18 a 28 inmuebles en radio de 1 km. El precio promedio por m² en casas bifamiliares de estratos 4-5 oscila entre $7.800.000 y $9.500.000 COP, con absorción media de 3 a 5 meses. El mercado evidencia una apreciación anual del 6.2%, impulsada por la proximidad a corredores viales de alta demanda y escasez de oferta nueva. JanIA procesó 47 transacciones comparables en los últimos 6 meses para determinar este valor de mercado.',
            ofertas_activas: '18–28',
            absorcion: '3–5 m.',
            apreciacion: '+6.2%',
            // Normativa urbana
            uso_suelo: 'Residencial / Mixto Bajo',
            zona_catastral: 'Zona Norte — Código 82-04',
            norma_vigente: 'POT Bogotá 2022 Dec. 555',
            tratamiento: 'Consolidación Urbana',
            indice_ocupacion: '60% — 70%',
            pisos_permitidos: 'Hasta 4 pisos',
            // Evaluación cualitativa
            conservacion: 88,
            acabados: 82,
            ubicacion_score: 92,
            valorizacion_score: 80,
            // Comparables extendidos
            comparables: [
                { address: 'Cra 52 # 127-15', area: 135, price: 1_180_000_000, price_m2: 8_741_000, days_on_market: 62 },
                { address: 'Cll 126 # 51B-28', area: 162, price: 1_490_000_000, price_m2: 9_197_000, days_on_market: 47 },
                { address: 'Cra 53A # 128-42', area: 144, price: 1_290_000_000, price_m2: 8_958_000, days_on_market: 91 },
                { address: 'Cll 128 # 54-12', area: 155, price: 1_375_000_000, price_m2: 8_871_000, days_on_market: 38 },
                { address: 'Cra 55 # 126A-08', area: 139, price: 1_220_000_000, price_m2: 8_777_000, days_on_market: 75 },
            ]
        }
    };

    useEffect(() => {
        const fetchReportData = async () => {
            // ✅ MODO DEMO: Si el ID empieza con "demo-", cargamos datos de muestra
            if (chatId?.startsWith('demo-')) {
                setReportData(DEMO_DATA);
                setLoading(false);
                return;
            }

            try {
                // Prioridad 1: Fetch from Supabase (Chats)
                const { data, error } = await supabase
                    .from('chats')
                    .select('metadata')
                    .eq('id', chatId)
                    .single();

                if (data && data.metadata) {
                    setReportData(data.metadata);
                } else {
                    // Prioridad 2: Local Storage fallback
                    const localMem = localStorage.getItem('janIA_temp_memory');
                    if (localMem) {
                        const parsed = JSON.parse(localMem);
                        setReportData(parsed.memory || parsed);
                    }
                }
            } catch (err) {
                console.warn("DB fetch failed, fallback to LocalStorage:", err);
                const localMem = localStorage.getItem('janIA_temp_memory');
                if (localMem) {
                    try {
                        const parsed = JSON.parse(localMem);
                        setReportData(parsed.memory || parsed);
                    } catch(e) {}
                }
            } finally {
                setLoading(false);
            }
        };

        if (chatId) fetchReportData();
    }, [chatId]);

    const handlePrint = () => { window.print(); };

    const handleShare = () => { setIsShareModalOpen(true); };

    const handleSocialShare = (platform) => {
        const url = window.location.href;
        const text = "Mira mi avalúo profesional generado por JanIA de Vecy 🏠✨";
        let shareUrl = "";
        switch (platform) {
            case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`; break;
            case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
            case 'x': shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`; break;
            case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
            case 'copy':
                navigator.clipboard.writeText(url);
                setShareToast(true);
                setTimeout(() => setShareToast(false), 3000);
                setIsShareModalOpen(false);
                return;
        }
        if (shareUrl) window.open(shareUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mb-6 mx-auto shadow-[0_0_30px_rgba(204,172,78,0.3)]"></div>
                    <p className="text-brand-gold font-black uppercase tracking-[0.4em] animate-pulse text-xs">JanIA está analizando...</p>
                </div>
            </div>
        );
    }

    if (!reportData || !reportData.property_data || Object.keys(reportData.property_data).length === 0 || (reportData.property_data.area === undefined && reportData.property_data.area_construida === undefined)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
                <div className="w-24 h-24 bg-red-900/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500 text-3xl" />
                </div>
                <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Reporte Incompleto</h2>
                <p className="text-stone-300 mb-8 max-w-md text-center leading-relaxed">No hemos detectado datos técnicos suficientes o el avalúo quedó inconcluso. Por favor, asegúrate de haber completado la sesión con JanIA.</p>
                <button onClick={() => navigate('/jania')} className="px-10 py-4 bg-brand-gold text-black font-black rounded-full uppercase tracking-widest shadow-xl hover:brightness-110 transition-all">Regresar a JanIA</button>
            </div>
        );
    }

    const { property_data: pd } = reportData;
    const planName = (reportData.planType || reportData.plan_filter?.[0] || 'Esmeralda').toUpperCase().replace('É', 'E');
    
    // THE "SUPERAVALUADORA" MAPPING
    const enrichedData = {
        ...pd,
        cliente_nombre: reportData.user_name || 'Propietario Vecy',
        cliente_fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
        tipo_inmueble: pd.tipo_inmueble || pd.tipo || 'Inmueble Residencial',
        direccion: pd.direccion_normalizada || 'Ubicación bajo análisis técnico',
        valor_final_avaluador: pd.valor_final_avaluador || pd.precio_estimado || 0,
        area_construida: pd.area || 0,
        estrato: pd.estrato || 3,
        habitaciones: pd.habitaciones || 3,
        banos: pd.banos || 2,
        barrio: pd.barrio || 'Zona Seleccionada',
        localidad: pd.localidad || 'Bogotá D.C.',
        facade_url: pd.facade_url || `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${pd.lat},${pd.lng}&fov=100&pitch=10&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
        analisis_mercado_texto: pd.analisis_mercado_texto || "Análisis técnico de mercado completado con algoritmos de inteligencia geoespacial y cruce de datos en tiempo real de Vecy Avalúos."
    };

    return (
        <div className="min-h-screen font-sans antialiased text-stone-200 selection:bg-brand-accent/30 selection:text-brand-accent print:bg-white print:text-black">
            
            {/* Background Ambience Corporal Vecy */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-30 print:hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]"></div>
            </div>

            {/* Premium Action Bar (Floating) */}
            <nav className="report-action-bar relative z-[120] w-full max-w-5xl mx-auto px-4 md:px-6 pt-8 pb-10 flex items-center justify-between print:hidden">
                <button 
                    onClick={() => navigate('/jania')}
                    className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-bold backdrop-blur-md group shadow-lg text-white"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden md:inline">Volver al Centro de Mando</span>
                    <span className="inline md:hidden">Volver</span>
                </button>
                
                <div className="flex items-center gap-3 md:gap-4">
                    <button 
                        onClick={handleShare} 
                        className="w-12 h-12 bg-white/5 hover:bg-white/10 text-brand-gold rounded-full transition-all border border-white/10 flex items-center justify-center shadow-lg group backdrop-blur-md"
                    >
                        <FontAwesomeIcon icon={faShareNodes} className="group-hover:rotate-12 transition-transform" />
                    </button>
                    
                    <button 
                        onClick={handlePrint} 
                        className="h-12 px-6 md:px-8 bg-brand-gold text-stone-900 font-extrabold rounded-full shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-95 flex items-center gap-3 transition-all text-xs uppercase tracking-widest"
                    >
                        <FontAwesomeIcon icon={faPrint} className="text-lg" />
                        <span className="hidden sm:inline">DESCARGAR PDF</span>
                        <span className="inline sm:hidden">PDF</span>
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-24 print:p-0 print:m-0 print:max-w-full print:w-full">
                {/* DOCUMENTO IMPRIMIBLE (CAFÉ, ESMERALDA U ORO) */}
                <div className="mx-auto w-full max-w-4xl drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] print:drop-shadow-none transition-all duration-500">
                    {planName === 'CAFE' && <CafeDocument data={enrichedData} />}
                    {planName === 'ESMERALDA' && <EsmeraldaDocument data={enrichedData} />}
                    {planName === 'ORO' && <OroDocument data={enrichedData} />}
                    {/* Fallback si el plan no mapea exacto */}
                    {['CAFE', 'ESMERALDA', 'ORO'].indexOf(planName) === -1 && <EsmeraldaDocument data={enrichedData} />}
                </div>
            </main>

            {/* Same Share Modal with Dark Design */}
            {isShareModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in print:hidden">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsShareModalOpen(false)}></div>
                    <div className="relative bg-[#0d0d0d] w-full max-w-[400px] rounded-[64px] p-12 shadow-[0_50px_150px_rgba(0,0,0,1)] border border-white/10 animate-scale-in">
                        <button onClick={() => setIsShareModalOpen(false)} className="absolute top-10 right-10 text-stone-600 hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
                        </button>

                        <div className="text-center mb-12">
                            <div className="w-20 h-20 bg-brand-gold/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 border border-brand-gold/30 shadow-inner">
                                <FontAwesomeIcon icon={faShareNodes} className="text-brand-gold text-3xl" />
                            </div>
                            <h3 className="text-white font-black text-3xl uppercase tracking-tighter leading-none mb-2">Difundir Informe</h3>
                            <span className="text-stone-500 font-black text-[10px] uppercase tracking-[0.4em]">Ecosistema Vecy</span>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: 'whatsapp', label: 'WhatsApp', icon: faWhatsapp, color: 'text-[#25D366]', bg: 'bg-[#25D366]/10', border: 'border-[#25D366]/20' },
                                { id: 'facebook', label: 'Facebook', icon: faFacebook, color: 'text-[#1877f2]', bg: 'bg-[#1877f2]/10', border: 'border-[#1877f2]/20' },
                                { id: 'x', label: 'X (Twitter)', icon: faXTwitter, color: 'text-white', bg: 'bg-white/5', border: 'border-white/10' },
                                { id: 'linkedin', label: 'LinkedIn', icon: faLinkedin, color: 'text-[#0a66c2]', bg: 'bg-[#0a66c2]/10', border: 'border-[#0a66c2]/20' }
                            ].map((p, i) => (
                                <button key={i} onClick={() => handleSocialShare(p.id)} className={`w-full ${p.bg} hover:brightness-125 py-5 px-8 rounded-[28px] flex items-center justify-between transition-all border ${p.border} ${p.color}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                            <FontAwesomeIcon icon={p.icon} className="text-xl" />
                                        </div>
                                        <span className="font-bold text-lg">{p.label}</span>
                                    </div>
                                    <FontAwesomeIcon icon={faShareNodes} className="opacity-50 text-sm" />
                                </button>
                            ))}

                            <button onClick={() => handleSocialShare('copy')} className="w-full bg-brand-gold/10 hover:bg-brand-gold/20 py-6 px-8 rounded-[32px] flex items-center justify-center gap-4 transition-all border-2 border-dashed border-brand-gold/50 mt-10 group">
                                <FontAwesomeIcon icon={faLink} className="text-brand-gold group-hover:rotate-45 transition-transform text-xl" />
                                <span className="text-brand-gold font-black text-xl uppercase tracking-[0.2em]">Copia Segura</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {shareToast && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] bg-brand-gold text-black px-12 py-5 rounded-full font-black shadow-[0_0_80px_rgba(204,172,78,0.4)] animate-bounce-subtle text-[10px] uppercase tracking-[0.3em] border border-black/10">
                    Enlace de Informe Digital Copiado 🛡️
                </div>
            )}

            <div className="print:hidden">
                <Footer />
            </div>
        </div>
    );
};

export default ReportPage;
