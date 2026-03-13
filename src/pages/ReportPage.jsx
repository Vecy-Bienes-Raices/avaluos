import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/VecyPhoenix/Footer';
import Hero from '../components/VecyPhoenix/Hero';
import PropertyDetails from '../components/VecyPhoenix/PropertyDetails';
import MarketAnalysis from '../components/VecyPhoenix/MarketAnalysis';
import NegotiationSimulator from '../components/VecyPhoenix/NegotiationSimulator';
import SWOT from '../components/VecyPhoenix/SWOT';
import AppraiserCertification from '../components/VecyPhoenix/AppraiserCertification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faShareNodes, faArrowLeft, faPrint, faEnvelope, faXmark, faLink, faBriefcase, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebook, faXTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

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
                // Fetch the chat memory from history to reconstruct the report
                const { data, error } = await supabase
                    .from('chat_history')
                    .select('memory')
                    .eq('id', chatId)
                    .single();

                if (error) throw error;
                if (data && data.memory) {
                    setReportData(data.memory);
                } else {
                    // Fallback to local storage if not found in DB (e.g. guest or recent)
                    const localMem = localStorage.getItem('janIA_temp_memory');
                    if (localMem) {
                        setReportData(JSON.parse(localMem));
                    }
                }
            } catch (err) {
                console.warn("DB Report fetch failed, trying LocalStorage fallback:", err);
                const localMem = localStorage.getItem('janIA_temp_memory');
                if (localMem) {
                    try {
                        const parsed = JSON.parse(localMem);
                        // Ensure we get the memory part if it's there, or the whole object
                        setReportData(parsed.memory || parsed);
                    } catch(parseErr) {
                        console.error("Local storage corruption:", parseErr);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        if (chatId) fetchReportData();
    }, [chatId]);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        setIsShareModalOpen(true);
    };

    const handleSocialShare = (platform) => {
        const url = window.location.href;
        const text = "Mira mi avalúo profesional generado por JanIA de Vecy 🏠✨";
        let shareUrl = "";

        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'x':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                setShareToast(true);
                setTimeout(() => setShareToast(false), 3000);
                setIsShareModalOpen(false);
                return;
        }

        if (shareUrl) window.open(shareUrl, '_blank');
        setIsShareModalOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#423229] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!reportData || !reportData.property_data) {
        return (
            <div className="min-h-screen bg-[#423229] flex flex-col items-center justify-center text-white p-6">
                <h2 className="text-2xl font-bold mb-4">Reporte No Encontrado</h2>
                <p className="text-stone-300 mb-8">No pudimos encontrar los datos de tu avalúo. Por favor, vuelve al chat con JanIA.</p>
                <button onClick={() => navigate('/')} className="px-6 py-3 bg-brand-gold text-black font-bold rounded-xl">Volver al Chat</button>
            </div>
        );
    }

    const { property_data: pd } = reportData;
    const planName = (reportData.planType || reportData.plan_filter?.[0] || 'Esmeralda').toUpperCase();
    
    // Mapping Layer: Transform JanIA data to VecyPhoenix format
    const enrichedData = {
        ...pd,
        cliente_nombre: 'Propietario Vecy',
        cliente_fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
        tipo_inmueble: pd.tipo || 'Apartamento',
        ciudad: 'Bogotá D.C.', // Default fallback
        direccion_inmueble: pd.direccion_normalizada || 'Ubicación bajo análisis',
        valor_final_avaluador: pd.precio_estimado || pd.precio || 0,
        area_construida: pd.area || 0,
        area_privada: pd.area || 0,
        habitaciones: pd.habitaciones || 3,
        banos: pd.banos || 2,
        parqueadero: pd.parqueadero || 1,
        distribucion_espacial: [
            { label: 'Zona Social', text: 'Sala comedor amplios con iluminación natural.' },
            { label: 'Cocina', text: 'Tipo integral de concepto abierto.' },
            { label: 'Habitaciones', text: 'Espacios cómodos con ventilación natural.' }
        ],
        estado_juridico: {
            propietario: 'Verificado',
            matricula: '50C-XXXXXX',
            chip: 'AAAXXXX',
            saneado: true
        },
        analisis_mercado_texto: "El sector presenta una valorización positiva del 4.2% anual. Tu inmueble se encuentra en el rango óptimo de comercialización.",
        acabados_estructura: [
            { label: 'Pisos', status: 'Excelente', detalle: 'Madera laminada de alta resistencia.' },
            { label: 'Muros', status: 'Bueno', detalle: 'Pintura y estuco en excelente estado.' }
        ],
        amenidades_conjunto: ['Ascensor inteligente', 'Seguridad 24/7', 'Zonas Verdes'],
        galeria_imagenes: [
            `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${pd.lat},${pd.lng}&fov=120&pitch=10&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
            '/jania.png'
        ]
    };

    const isOro = planName.includes('ORO');
    const isEsmeralda = planName.includes('ESMERALDA');
    const isCafe = planName.includes('CAFÉ') || planName.includes('CAFE');
    return (
        <div className={`min-h-screen font-sans antialiased transition-colors duration-500 ${isOro ? (theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-[#423229]') : 'bg-stone-50'}`}>
            
            {/* Action Bar (Global) */}
            <div className="sticky top-0 w-full bg-[#1e1a17]/95 backdrop-blur-md border-b border-brand-gold/20 p-4 flex justify-between items-center z-50 print:hidden shadow-xl">
                <button 
                    onClick={() => navigate('/')} 
                    className="text-stone-300 hover:text-brand-accent flex items-center gap-2 transition-colors font-bold text-sm"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    VOLVER A JANIA
                </button>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleShare} 
                        className="p-2.5 bg-white/5 hover:bg-white/10 text-brand-gold rounded-full transition-all border border-white/10 group"
                        title="Compartir Avalúo"
                    >
                        <FontAwesomeIcon icon={faShareNodes} className="group-hover:rotate-12 transition-transform" />
                    </button>
                    
                    <button 
                        onClick={handlePrint} 
                        className="px-6 py-2.5 bg-brand-gold text-black font-bold rounded-full shadow-lg shadow-yellow-900/20 hover:brightness-110 flex items-center gap-2 transition-all transform active:scale-95 text-xs uppercase tracking-widest"
                    >
                        <FontAwesomeIcon icon={faPrint} />
                        Descargar Reporte
                    </button>
                </div>
            </div>

            {/* Share Modal */}
            {isShareModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in print:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsShareModalOpen(false)}></div>
                    <div className="relative bg-[#f5f5f5] w-full max-w-sm rounded-[32px] p-8 shadow-2xl transform animate-scale-in">
                        <button 
                            onClick={() => setIsShareModalOpen(false)}
                            className="absolute top-6 right-6 text-stone-600 hover:text-black transition-colors"
                        >
                            <FontAwesomeIcon icon={faXmark} className="text-xl" />
                        </button>

                        <h3 className="text-center text-[#4a4a4a] font-black text-xl mb-8 font-outfit">Compartir Propiedad</h3>

                        <div className="space-y-4">
                            {/* WhatsApp */}
                            <button 
                                onClick={() => handleSocialShare('whatsapp')}
                                className="w-full bg-[#e8fdf5] hover:bg-[#d1f7e9] py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] group shadow-sm border border-[#00e676]/10"
                            >
                                <span className="bg-[#00e676] p-1.5 rounded-full text-white flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                    <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
                                </span>
                                <span className="text-[#2e7d32] font-black tracking-tight text-lg">WhatsApp</span>
                            </button>

                            {/* Facebook */}
                            <button 
                                onClick={() => handleSocialShare('facebook')}
                                className="w-full bg-[#e8f4fd] hover:bg-[#d1e9f7] py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] group shadow-sm border border-[#1877f2]/10"
                            >
                                <span className="bg-[#1877f2] p-1.5 rounded-full text-white flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                    <FontAwesomeIcon icon={faFacebook} className="text-lg" />
                                </span>
                                <span className="text-[#1565c0] font-black tracking-tight text-lg">Facebook</span>
                            </button>

                            {/* X (Twitter) */}
                            <button 
                                onClick={() => handleSocialShare('x')}
                                className="w-full bg-[#f2f2f2] hover:bg-[#e6e6e6] py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] group shadow-sm border border-black/5"
                            >
                                <span className="bg-black p-1.5 rounded-full text-white flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                    <FontAwesomeIcon icon={faXTwitter} className="text-lg" />
                                </span>
                                <span className="text-black font-black tracking-tight text-lg">X (Twitter)</span>
                            </button>

                            {/* LinkedIn */}
                            <button 
                                onClick={() => handleSocialShare('linkedin')}
                                className="w-full bg-[#eef7fd] hover:bg-[#d1e9f7] py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] group shadow-sm border border-[#0a66c2]/10"
                            >
                                <span className="bg-[#0a66c2] p-1.5 rounded-full text-white flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                    <FontAwesomeIcon icon={faLinkedin} className="text-lg" />
                                </span>
                                <span className="text-[#0a66c2] font-black tracking-tight text-lg">LinkedIn</span>
                            </button>

                            {/* Copiar Enlace */}
                            <button 
                                onClick={() => handleSocialShare('copy')}
                                className="w-full bg-[#fff9eb] hover:bg-[#fff4d1] py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] group shadow-sm border-2 border-dashed border-[#d4a017]/40 mt-4"
                            >
                                <FontAwesomeIcon icon={faClipboard} className="text-[#d4a017] text-xl transform group-hover:rotate-12 transition-transform" />
                                <span className="text-[#8d6e1c] font-black tracking-tight text-lg">Copiar Enlace</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Toast */}
            {shareToast && (
                <div className="fixed top-20 right-4 z-[300] bg-brand-accent text-black px-6 py-3 rounded-2xl font-black shadow-2xl animate-bounce-subtle border border-black/10 text-sm">
                    ¡Copiado al portapapeles! 🚀
                </div>
            )}

            {/* --- RENDER LOGIC BY TIER --- */}
            
            {isOro ? (
                /* 🏆 ORO TIER: Interactive Premium (VecyPhoenix Style) */
                <main className="animate-fade-in-up">
                    <Hero data={enrichedData} />
                    <div className="max-w-6xl mx-auto px-4 pb-20">
                        <PropertyDetails data={enrichedData} />
                        <MarketAnalysis data={enrichedData} />
                        <NegotiationSimulator data={enrichedData} />
                        <SWOT data={enrichedData} />
                        <AppraiserCertification />
                    </div>
                    <div className="pb-20 flex justify-center">
                         <div className="text-center">
                            <img src="/logo-vecy.png" className="w-24 grayscale opacity-30 mx-auto mb-2" alt="Vecy" />
                            <p className="text-[10px] text-stone-500 uppercase tracking-widest">Avalúo Premium • Protocolo Vecy Oro</p>
                         </div>
                    </div>
                </main>
            ) : (
                /* 📄 A4 FORMAT: Esmeralda & Café (Printable Focus) */
                <div className="max-w-[850px] mx-auto bg-white min-h-[1122px] shadow-2xl mt-8 mb-12 relative p-12 print:shadow-none print:m-0 print:p-8" id="printable-report">
                    
                    {/* Visual Tab */}
                    <div className={`absolute top-0 left-0 w-full h-3 ${isEsmeralda ? 'bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600' : 'bg-[#8D6E63]'} print:bg-stone-500`}></div>
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10 mt-6 border-b border-stone-100 pb-8">
                        <div>
                            <img src="/logo-vecy.png" alt="Vecy" className="w-32 mb-4 drop-shadow-sm" />
                            <h1 className="text-4xl font-black text-stone-900 tracking-tighter mb-1 uppercase">Avalúo {planName}</h1>
                            <p className="text-stone-400 text-xs tracking-[0.3em] font-bold uppercase">Concepto Técnico de Valoración</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-1">Solicitado por</p>
                            <p className="font-outfit text-xl font-black text-[#423229]">PROPIETARIO VECY</p>
                            <p className="text-[10px] text-stone-400 font-medium">Emitido: {enrichedData.cliente_fecha}</p>
                        </div>
                    </div>

                    {/* Main Highlight (Price) */}
                    <div className={`rounded-3xl p-10 mb-10 text-center border ring-1 ${isEsmeralda ? 'bg-emerald-50/30 border-emerald-100 ring-emerald-50' : 'bg-stone-50 border-stone-100 ring-stone-50/50'}`}>
                        <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.25em] mb-4">Valor Sugerido de Mercado</h3>
                        <div className="text-5xl md:text-6xl font-black text-[#1e1a17] tracking-tighter">
                            ${(enrichedData.valor_final_avaluador).toLocaleString('es-CO')} <span className="text-xl text-stone-400 font-normal">COP</span>
                        </div>
                        {isEsmeralda && (
                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-700 rounded-full text-[10px] font-black border border-emerald-200 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Análisis con Normativa Incluida
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-12">
                        {[
                            { label: 'Dirección', val: enrichedData.direccion_inmueble },
                            { label: 'Área', val: `${enrichedData.area_construida} m²` },
                            { label: 'Habitaciones', val: enrichedData.habitaciones },
                            { label: 'Baños', val: enrichedData.banos },
                            { label: 'Estrato', val: enrichedData.estrato || '4' },
                            { label: 'Tipo', val: enrichedData.tipo_inmueble }
                        ].map((item, i) => (
                            <div key={i} className="border-b border-stone-100 pb-4">
                                <p className="text-[9px] text-stone-400 font-black uppercase tracking-widest mb-1">{item.label}</p>
                                <p className="font-bold text-stone-800 tracking-tight">{item.val}</p>
                            </div>
                        ))}
                    </div>

                    {/* Visual Evidence (Only Esmeralda) */}
                    {isEsmeralda && enrichedData.lat && (
                         <div className="w-full h-56 rounded-3xl overflow-hidden mb-12 border border-stone-100 grayscale-[30%]">
                            <img 
                                src={`https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${pd.lat},${pd.lng}&fov=110&pitch=5&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`} 
                                alt="Fachada" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Legal Footer */}
                    <div className="mt-auto pt-10 border-t border-stone-100">
                        <div className="grid grid-cols-2 gap-8 items-end">
                            <div>
                                <img src="/logo-vecy.png" className="w-20 grayscale opacity-20 mb-4" alt="Vecy" />
                                <p className="text-[9px] text-stone-400 text-justify leading-relaxed">
                                    Este documento es una pre-evaluación técnica automatizada generada por JanIA. No posee valor como peritaje oficial ante entidades bancarias o notariales. Vecy Avalúos S.A.S no se responsabiliza por errores en la información autodeclarada por el usuario.
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">Avalúo Validado por JanIA</p>
                                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">WWW.VECY.CO</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    .action-bar { display: none !important; }
                    body { background: white !important; }
                    #printable-report { 
                        margin: 0 !important; 
                        box-shadow: none !important; 
                        width: 100% !important; 
                        max-width: none !important;
                    }
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
            `}} />
            
            <Footer />
        </div>
    );
};

export default ReportPage;
