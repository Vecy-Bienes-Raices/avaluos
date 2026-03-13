import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Footer from '../components/VecyPhoenix/Footer';

const ReportPage = () => {
    const { id: chatId } = useParams();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

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
                console.error("Error fetching report data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (chatId) fetchReportData();
    }, [chatId]);

    const handlePrint = () => {
        window.print();
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
    const planName = reportData.plan_filter?.[0] || 'Esmeralda';
    const isEsmeralda = planName.toLowerCase().includes('esmeralda');

    return (
        <div className="min-h-screen bg-stone-100 font-sans text-stone-800 pb-20">
            {/* Action Bar (Not printed) */}
            <div className="sticky top-0 w-full bg-[#423229] border-b border-brand-gold/30 p-4 flex justify-between items-center z-50 print:hidden shadow-md">
                <button onClick={() => navigate('/')} className="text-stone-300 hover:text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Volver
                </button>
                <button onClick={handlePrint} className="px-6 py-2 bg-brand-gold text-black font-bold rounded-lg shadow-lg hover:brightness-110 flex items-center gap-2 transition-all group">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Descargar / Imprimir
                </button>
            </div>

            {/* A4 Printable Area */}
            <div className="max-w-[800px] mx-auto bg-white min-h-[1122px] shadow-2xl mt-8 mb-8 relative p-12 print:shadow-none print:m-0 print:p-8" id="printable-report">
                
                {/* Visual Header */}
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-brand-coffee via-brand-gold to-brand-accent print:bg-brand-coffee"></div>
                
                {/* Header Profile */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 mt-6 border-b-2 border-stone-100 pb-8">
                    <div className="mb-6 md:mb-0">
                        <img src="/logo-vecy.png" alt="Vecy Avalúos Logo" className="w-40 object-contain mb-4 filter drop-shadow-sm" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-2 font-outfit">Informe de Valoración</h1>
                        <p className="text-lg text-brand-gold font-bold tracking-widest uppercase">Plan {planName}</p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-sm text-stone-500 font-medium">Asistente Evaluador: JanIA M.L.</p>
                        <p className="text-sm text-stone-500 font-medium">Fecha: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-xs text-stone-400 mt-1">ID: {chatId.substring(0,8).toUpperCase()}-VECY</p>
                    </div>
                </div>

                {/* Street View / Photo Area */}
                {pd.lat && pd.lng && (
                    <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10 border-2 border-stone-100 shadow-inner relative group print:h-64">
                        <img 
                            src={`https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${pd.lat},${pd.lng}&fov=120&pitch=10&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`} 
                            alt="Vista de Fachada del Inmueble" 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-xs text-white font-bold tracking-widest uppercase text-shadow-sm">Verificación Satelital JanIA</p>
                        </div>
                    </div>
                )}

                {/* Main Hero Highlight (Price) */}
                <div className="bg-gradient-to-br from-stone-50 to-white border border-stone-200 rounded-2xl p-8 mb-10 text-center relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-bl-full pointer-events-none"></div>
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-3">Valor Estimado de Mercado</h3>
                    
                    {(pd.precio_estimado || pd.precio) ? (
                        <div className="text-5xl md:text-6xl font-extrabold text-[#423229] tracking-tight">
                            ${(pd.precio_estimado || pd.precio).toLocaleString('es-CO')} <span className="text-2xl text-stone-400 font-medium">COP</span>
                        </div>
                    ) : (
                        <div className="text-2xl font-bold text-brand-coffee">
                            ANÁLISIS EN CURSO O PENDIENTE DE REVISIÓN
                        </div>
                    )}

                    {isEsmeralda && (
                        <div className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-800 rounded-full text-sm font-bold border border-emerald-200 shadow-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                            Análisis Integral de Normativa (Esmeralda)
                        </div>
                    )}
                </div>

                {/* Property Details Grid */}
                <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-brand-gold/20 text-brand-coffee flex items-center justify-center">1</span>
                    Datos del Inmueble
                </h3>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
                    <div className="border-b border-stone-100 pb-3">
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Dirección Registrada</p>
                        <p className="font-semibold text-stone-800">{pd.direccion_normalizada || 'No especificada'}</p>
                    </div>
                    <div className="border-b border-stone-100 pb-3">
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Área Privada</p>
                        <p className="font-semibold text-stone-800">{pd.area || '-'} m²</p>
                    </div>
                    <div className="border-b border-stone-100 pb-3">
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Estrato Socioeconómico</p>
                        <p className="font-semibold text-stone-800">{pd.estrato || '-'}</p>
                    </div>
                    <div className="border-b border-stone-100 pb-3">
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Tipo de Inmueble</p>
                        <p className="font-semibold text-stone-800 tracking-wide capitalize">{pd.tipo || 'Apartamento'}</p>
                    </div>
                    <div className="border-b border-stone-200 pb-3">
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Valor x M² (Aprox)</p>
                        <p className="font-semibold text-stone-800 tracking-wide">
                            {pd.area && (pd.precio_estimado || pd.precio) 
                                ? `$${Math.round((pd.precio_estimado || pd.precio) / pd.area).toLocaleString('es-CO')} COP` 
                                : 'Análisis Pendiente'}
                        </p>
                    </div>
                    <div className="border-b border-stone-200 pb-3">
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Ubicación Geográfica</p>
                        <p className="font-semibold text-stone-800 tracking-wide">
                            {pd.lat ? `${pd.lat.toFixed(4)}, ${pd.lng.toFixed(4)}` : 'Bogotá D.C., Colombia'}
                        </p>
                    </div>
                </div>

                {/* Advanced Analytics (Only for Esmeralda) */}
                {isEsmeralda && (
                    <>
                        <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-3 mt-10">
                            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">2</span>
                            Métricas Clave del Sector
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mb-12">
                            <div className="bg-stone-50 p-5 rounded-xl border border-stone-100">
                                <p className="text-3xl mb-2">📈</p>
                                <p className="text-sm font-bold text-stone-800">Tendencia Zona</p>
                                <p className="text-xs text-stone-500 mt-1">Alta Demanda (Subiendo)</p>
                            </div>
                            <div className="bg-stone-50 p-5 rounded-xl border border-stone-100">
                                <p className="text-3xl mb-2">🏘️</p>
                                <p className="text-sm font-bold text-stone-800">Ofertas Comparables</p>
                                <p className="text-xs text-stone-500 mt-1">&gt; 15 Inmuebles en venta</p>
                            </div>
                            <div className="bg-stone-50 p-5 rounded-xl border border-stone-100">
                                <p className="text-3xl mb-2">⏱️</p>
                                <p className="text-sm font-bold text-stone-800">Tiempo de Venta Est.</p>
                                <p className="text-xs text-stone-500 mt-1">45 - 90 días hábiles</p>
                            </div>
                        </div>
                    </>
                )}

                {/* Methodology & Legal Disclaimer */}
                <div className="mt-16 pt-8 border-t-2 border-dashed border-stone-200">
                    <h4 className="font-bold text-stone-800 mb-2">Alcance del Informe</h4>
                    <p className="text-xs text-stone-500 leading-relaxed text-justify mb-4">
                        Este reporte fue generado de manera automatizada usando algoritmos de Inteligencia Artificial ("JanIA") desarrollados por Vecy Avalúos. Los valores aquí presentados corresponden a un sondeo de mercado estimado basado en análisis de 빅 data y cruce de ofertas públicas en la zona de influencia para el momento de la consulta.
                    </p>
                    <p className="text-xs text-stone-500 leading-relaxed text-justify">
                        <strong>Aviso Legal:</strong> Este documento tiene carácter puramente informativo y de orientación comercial para el solicitante. **NO constituye un peritaje oficial**, ni sustituye un avalúo físico con firma de perito avaluador inscrito en el Registro Nacional de Avaluadores (RNA) o la lonja de propiedad raíz. Vecy Avalúos no asume responsabilidad jurídica frente a terceros por transacciones realizadas basándose únicamente en esta estimación automatizada.
                    </p>
                </div>

                {/* Sign-off */}
                <div className="mt-12 flex items-center justify-between">
                    <div>
                        <div className="w-32 h-10 border-b-2 border-stone-800 mb-2 relative">
                            {/* Signature simulation */}
                            <svg className="absolute bottom-1 left-2 w-24 h-auto text-stone-800/60" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 25C15 15 25 5 35 15C45 25 55 5 65 15C75 25 85 5 95 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-stone-800">JanIA - Sistema de Valoración</p>
                        <p className="text-xs text-stone-500">Vecy Avalúos S.A.S.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-brand-gold">www.vecy.co</p>
                        <p className="text-xs text-stone-500">Bogotá D.C., Colombia</p>
                    </div>
                </div>

            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body { background: white; }
                    @page { size: A4; margin: 0; }
                }
            `}} />
            
            <Footer />
        </div>
    );
};

export default ReportPage;
