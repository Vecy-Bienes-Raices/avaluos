import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/VecyPhoenix/Footer';
import PropertyDetails from '../components/VecyPhoenix/PropertyDetails';
const MarketAnalysis = lazy(() => import('../components/VecyPhoenix/MarketAnalysis'));
const NegotiationSimulator = lazy(() => import('../components/VecyPhoenix/NegotiationSimulator'));
const SWOT = lazy(() => import('../components/VecyPhoenix/SWOT'));
const PathologyDetective = lazy(() => import('../components/VecyPhoenix/PathologyDetective'));
const ROIAnalysis = lazy(() => import('../components/VecyPhoenix/ROIAnalysis'));
import AppraiserCertification from '../components/VecyPhoenix/AppraiserCertification';
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

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                // Prioridad 1: Fetch from Supabase (History)
                const { data, error } = await supabase
                    .from('chat_history')
                    .select('memory')
                    .eq('id', chatId)
                    .single();

                if (data && data.memory) {
                    setReportData(data.memory);
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

    if (!reportData || !reportData.property_data) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-6">
                <div className="w-24 h-24 bg-red-900/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
                    <FontAwesomeIcon icon={faXmark} className="text-red-500 text-3xl" />
                </div>
                <h2 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">Acceso Denegado</h2>
                <p className="text-stone-400 mb-8 max-w-md text-center">No hemos detectado un avalúo procesado para esta sesión. Por favor, asegúrate de haber completado el análisis con JanIA.</p>
                <button onClick={() => navigate('/jania')} className="px-10 py-4 bg-brand-gold text-black font-black rounded-full uppercase tracking-widest shadow-xl hover:brightness-110 transition-all">Volver al Centro de Mando</button>
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
        <div className="min-h-screen font-sans antialiased text-stone-300 bg-[#080808] selection:bg-brand-gold/30">
            
            {/* Action Bar (Premium Floating) */}
            <nav className="fixed top-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-b border-white/5 z-[120] px-6 flex items-center justify-between print:hidden shadow-2xl">
                <button 
                    onClick={() => navigate('/jania')}
                    className="flex items-center gap-3 text-stone-500 hover:text-white transition-all group"
                >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-brand-gold/50 transition-colors">
                        <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">Cerrar Informe</span>
                </button>
                
                <div className="flex items-center gap-8">
                    <div className="hidden lg:flex items-center gap-3 border-r border-white/10 pr-8">
                        <div className="w-10 h-10 bg-brand-gold/10 rounded-full flex items-center justify-center border border-brand-gold/30">
                            <span className="text-brand-gold text-[10px] font-black">VJ</span>
                        </div>
                        <div>
                            <span className="text-[9px] text-stone-500 font-black uppercase tracking-widest block leading-none mb-1">Algoritmo</span>
                            <span className="text-white font-black text-xs uppercase tracking-tighter block leading-none">JanIA v2.0</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleShare} 
                            className="w-12 h-12 bg-white/5 hover:bg-white/10 text-brand-gold rounded-full transition-all border border-white/10 flex items-center justify-center shadow-lg group"
                        >
                            <FontAwesomeIcon icon={faShareNodes} className="group-hover:rotate-12 transition-transform" />
                        </button>
                        
                        <button 
                            onClick={handlePrint} 
                            className="h-12 px-8 bg-brand-gold text-black font-black rounded-full shadow-lg shadow-yellow-500/20 hover:scale-[1.03] active:scale-95 flex items-center gap-3 transition-all text-[10px] uppercase tracking-[0.2em]"
                        >
                            <FontAwesomeIcon icon={faPrint} />
                            EXPORTAR PDF
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 pt-32 pb-32">
                {/* Header Section - PREMIUM DARK CARD */}
                <header className="relative mb-20 overflow-hidden rounded-[48px] border border-white/10 bg-gradient-to-br from-stone-900 to-black p-8 md:p-20 shadow-[0_0_100px_rgba(0,0,0,1)]">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[180px] -mr-80 -mt-80 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-16">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-10">
                                <span className="px-5 py-2 bg-brand-gold text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-yellow-500/10">AVALÚO {planName}</span>
                                <div className="h-px w-16 bg-white/10"></div>
                                <span className="text-stone-500 text-[10px] font-black uppercase tracking-[0.2em] italic">VECY INTELLIGENCE SYSTEMS</span>
                            </div>
                            
                            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-6 uppercase italic leading-[0.85] text-shadow-volcanic">CONCEPTO<br/>TÉCNICO</h1>
                            <p className="text-2xl md:text-4xl text-brand-gold font-black tracking-tight mb-16 max-w-3xl leading-tight uppercase italic">{enrichedData.direccion}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                {[
                                    { label: 'Territorio', val: enrichedData.barrio },
                                    { label: 'Localidad', val: enrichedData.localidad },
                                    { label: 'Categoría', val: enrichedData.estrato },
                                    { label: 'Superficie', val: `${enrichedData.area_construida}m²` }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/5 p-8 rounded-[32px] border border-white/5 backdrop-blur-3xl hover:border-brand-gold/20 transition-colors group">
                                        <span className="text-[10px] text-stone-500 uppercase font-black tracking-[0.2em] mb-3 block group-hover:text-brand-gold transition-colors">{stat.label}</span>
                                        <span className="text-white font-black text-2xl uppercase tracking-tighter">{stat.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PRICE BADGE */}
                        <div className="lg:w-[420px] w-full bg-black/60 backdrop-blur-3xl p-12 rounded-[60px] border border-brand-gold/40 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative group overflow-hidden">
                             <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-80">
                                <span className="text-[9px] text-brand-gold font-black uppercase tracking-[0.6em] animate-pulse">ANALIZANDO MERCADO</span>
                            </div>
                            
                            <div className="mt-12 text-center">
                                <span className="text-[12px] text-stone-400 uppercase font-black tracking-[0.4em] mb-6 block">VALORACIÓN ESTIMADA</span>
                                <div className="text-6xl md:text-[84px] font-black text-white tracking-tighter mb-4 leading-none group-hover:scale-110 transition-transform duration-700">
                                    <span className="text-brand-gold text-3xl md:text-4xl mr-1 italic ">$</span>
                                    {Math.round(enrichedData.valor_final_avaluador).toLocaleString('es-CO')}
                                </div>
                                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent my-10"></div>
                                <div className="flex flex-col items-center gap-3">
                                    <span className="text-brand-gold font-black text-2xl uppercase italic tracking-tighter">${enrichedData.area_construida > 0 ? Math.round(enrichedData.valor_final_avaluador / enrichedData.area_construida).toLocaleString('es-CO') : '---'} <span className="text-[10px] ml-1">x m2</span></span>
                                    <span className="text-[10px] text-stone-500 font-black uppercase tracking-[0.3em] block italic">Cálculo de densidad económica</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SUPERAVALUADORA VISION (STREET VIEW INTEGRATION) */}
                <section className="mb-24">
                    <div className="flex items-center gap-8 mb-16 px-4">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group relative">
                             <FontAwesomeIcon icon={faShieldHalved} className="text-brand-gold text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">Visión Satelital 2026</h2>
                            <span className="text-stone-500 font-black text-[10px] uppercase tracking-[0.4em]">Arquitectura de datos geoespaciales</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 h-[550px] relative rounded-[56px] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] group">
                            <img 
                                src={enrichedData.facade_url} 
                                alt="Fachada capturada por JanIA" 
                                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1574359411659-15573a27f812?q=80&w=1200"; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
                            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-brand-gold text-black rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                                        <FontAwesomeIcon icon={faMicrochip} className="text-3xl animate-spin-slow" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black text-3xl uppercase tracking-tighter leading-none mb-1">Registro Exterior</h3>
                                        <span className="text-[10px] text-brand-gold font-black uppercase tracking-[0.4em]">Análisis Óptico AI</span>
                                    </div>
                                </div>
                                <div className="hidden md:block text-right">
                                    <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em] block mb-2">SCAN_STATUS</span>
                                    <span className="px-4 py-1.5 bg-green-500/10 text-green-500 border border-green-500/30 rounded-full font-black text-[10px] tracking-widest uppercase">Validación OK</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 bg-gradient-to-br from-stone-900 via-[#0a0a0a] to-black rounded-[56px] p-12 border border-white/5 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-gold/10 transition-all"></div>
                            
                            <div>
                                <div className="w-14 h-14 bg-white/5 rounded-[20px] flex items-center justify-center mb-10 border border-white/10 italic text-brand-gold font-black text-2xl shadow-inner">J</div>
                                <h4 className="text-white font-black text-2xl uppercase tracking-tighter mb-6 italic leading-none">Veredicto JanIA</h4>
                                <div className="h-1 w-12 bg-brand-gold mb-8 rounded-full"></div>
                                <p className="text-stone-400 text-lg leading-relaxed italic mb-10">
                                    "{enrichedData.analisis_mercado_texto}"
                                </p>
                            </div>

                            <div className="p-8 bg-black/40 rounded-[40px] border border-white/5 text-center backdrop-blur-3xl hover:border-brand-gold/30 transition-all cursor-default">
                                <img src="/jania.png" className="w-20 h-20 mx-auto mb-6 opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" alt="JanIA Sign" />
                                <span className="text-[11px] text-brand-gold font-black uppercase tracking-[0.4em] mb-1 block italic">Sello de Calidad</span>
                                <span className="block text-white font-black text-sm uppercase tracking-tighter italic">AGENTE AUTÓNOMO VECY</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DATA GRIDS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
                    <div className="bg-[#111] backdrop-blur-3xl rounded-[56px] border border-white/5 overflow-hidden shadow-2xl">
                        <PropertyDetails data={enrichedData} />
                    </div>
                    <div className="bg-[#111] backdrop-blur-3xl rounded-[56px] border border-white/5 overflow-hidden shadow-2xl">
                        <MarketAnalysis data={enrichedData} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
                     <div className="bg-[#111] backdrop-blur-3xl rounded-[56px] border border-white/5 overflow-hidden shadow-2xl">
                        <NegotiationSimulator data={enrichedData} />
                    </div>
                    <div className="bg-[#111] backdrop-blur-3xl rounded-[56px] border border-white/5 overflow-hidden shadow-2xl">
                        <SWOT data={enrichedData} />
                    </div>
                </div>

                {/* CONSTITUTIONAL MANDATES: PATHOLOGY & ROI */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
                     <div className="bg-[#111] backdrop-blur-3xl rounded-[56px] border border-white/5 overflow-hidden shadow-2xl">
                        <PathologyDetective data={enrichedData} />
                    </div>
                    <div className="bg-[#111] backdrop-blur-3xl rounded-[56px] border border-white/5 overflow-hidden shadow-2xl">
                        <ROIAnalysis data={enrichedData} />
                    </div>
                </div>

                <div className="bg-[#111]/40 backdrop-blur-3xl rounded-[56px] border border-brand-gold/20 overflow-hidden shadow-2xl transition-all hover:border-brand-gold/40">
                    <AppraiserCertification />
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
                            <h3 className="text-white font-black text-3xl uppercase tracking-tighter italic leading-none mb-2">Difundir Informe</h3>
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
                                    <span className="font-black text-xs uppercase tracking-[0.2em]">{p.label}</span>
                                    <FontAwesomeIcon icon={p.icon} className="text-2xl" />
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

            <Footer />
        </div>
    );
};

export default ReportPage;
