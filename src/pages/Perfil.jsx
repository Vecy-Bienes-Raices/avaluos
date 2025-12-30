import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useModal } from '../context/ModalContext';
import { supabase } from '../lib/supabaseClient';
import { GlassAvatar } from '../components/GlassAvatar';

const Perfil = () => {
    const { theme } = useTheme();
    const { showModal } = useModal();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const [activeTab, setActiveTab] = useState('appraisals');
    const [appraisals, setAppraisals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const fetchUserAndData = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setFullName(user.user_metadata?.full_name || '');

                const { data: apps } = await supabase
                    .from('appraisals')
                    .select('*')
                    .eq('client_id', user.id)
                    .order('created_at', { ascending: false });

                if (apps) setAppraisals(apps);
            } else {
                navigate('/');
            }
            setLoading(false);
        };
        fetchUserAndData();
    }, [navigate]);

    // Derived Payments
    const payments = appraisals.filter(app => app.status !== 'pending' && app.plan_type !== 'cafe').map(app => ({
        id: `PAY-${app.id.slice(0, 8)}`,
        date: app.created_at,
        concept: `Plan ${app.plan_type.charAt(0).toUpperCase() + app.plan_type.slice(1)}`,
        amount: app.plan_type === 'esmeralda' ? 150000 : app.plan_type === 'oro' ? 300000 : 0,
        status: 'Aprobado'
    }));

    // Save Profile Name
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        });
        if (error) {
            showModal({ title: 'Error', message: error.message, type: 'error' });
        } else {
            showModal({ title: '¡Éxito!', message: 'Tu nombre ha sido actualizado correctamente.', type: 'success' });
        }
    };

    // Handle Avatar Upload
    const handleAvatarUpload = async (e) => {
        try {
            setLoading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update Profile
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) throw updateError;

            // Refresh User
            const { data: { user: updatedUser } } = await supabase.auth.getUser();
            setUser(updatedUser);
            showModal({ title: 'Foto Nueva', message: 'Tu perfil luce increíble con esa nueva foto.', type: 'success' });

        } catch (error) {
            showModal({ title: 'Error de Carga', message: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // 💎 Handle Smart PDF Generation
    const handleDownloadPDF = async (appraisalId) => {
        try {
            // Toast de "Generando..."
            const btn = document.getElementById(`btn-${appraisalId}`);
            if (btn) btn.innerText = "Generando...";

            // Use Environment Variable for Backend URL
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_URL}/generate-pdf/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appraisal_id: appraisalId })
            });

            if (!res.ok) throw new Error('Error generando informe');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Informe_Inteligente_Vecy_${appraisalId.slice(0, 6)}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            if (btn) btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" class="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                Descargar PDF
            `;

            showModal({ title: 'Descarga Lista', message: 'Tu informe inteligente ha sido generado y descargado.', type: 'success' });

        } catch (err) {
            showModal({ title: 'Error', message: err.message, type: 'error' });
            const btn = document.getElementById(`btn-${appraisalId}`);
            if (btn) btn.innerText = "Reintentar";
        }
    };

    const bgClass = theme === 'coffee' ? 'bg-[#423229]' : 'bg-[#0f0f0f]';
    const bgStyle = theme === 'coffee'
        ? { backgroundImage: 'radial-gradient(circle at center, #7D6B65 0%, #4E3D32 40%, #423229 100%)', backgroundAttachment: 'fixed' }
        : { background: '#0f0f0f' };

    return (
        <div className={`min-h-screen w-full flex flex-col items-center p-6 text-stone-200 transition-colors duration-500 ${bgClass}`} style={bgStyle}>

            {/* Header / Back */}
            <div className="w-full max-w-5xl flex items-center justify-between mb-8 mt-4 animate-fade-in">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-all border border-white/5 text-sm mb-6 w-fit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    Volver con JanIA
                </button>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Centro de Mando</span>
                </div>
            </div>

            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* 1. PROFILE CARD (Left) */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl h-fit animate-in slide-in-from-left-4 duration-700">
                    <div className="flex flex-col items-center mb-6">
                        <label className="w-24 h-24 rounded-full border-4 border-brand-accent/20 mb-4 overflow-hidden shadow-2xl relative group cursor-pointer transition-transform active:scale-95">
                            <GlassAvatar
                                src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
                                name={user?.user_metadata?.full_name || user?.email || 'Tú'}
                                size="xl"
                                className="w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <span className="text-[10px] uppercase font-bold text-brand-gold animate-pulse tracking-wide">Editar Foto</span>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={loading} />
                        </label>
                        <p className="text-xs text-stone-400 font-medium truncate w-full text-center">{user?.email}</p>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest pl-1">Nombre</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-accent/50 transition-colors"
                            />
                        </div>
                        <button type="submit" className="w-full py-3 bg-brand-gold text-black font-bold rounded-xl transition-all text-xs uppercase tracking-wider hover:bg-brand-gold-light hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] duration-300">
                            Actualizar Datos
                        </button>
                    </form>
                </div>

                {/* 2. MAIN CONTENT (Right - Tabs) */}
                <div className="md:col-span-2 space-y-6 animate-in slide-in-from-bottom-4 duration-700 delay-100">

                    {/* Tabs */}
                    <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit backdrop-blur-md border border-white/5">
                        <button
                            onClick={() => setActiveTab('appraisals')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'appraisals' ? 'bg-brand-accent text-black shadow-lg' : 'text-stone-400 hover:text-white'}`}
                        >
                            Mis Avalúos
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'payments' ? 'bg-brand-accent text-black shadow-lg' : 'text-stone-400 hover:text-white'}`}
                        >
                            Historial de Pagos
                        </button>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[400px] backdrop-blur-xl relative overflow-hidden">

                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                                <div className="w-8 h-8 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {activeTab === 'appraisals' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-accent"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                                    Inmuebles Evaluados
                                </h3>

                                {appraisals.length === 0 ? (
                                    <div className="text-center py-12 text-stone-500">
                                        <p>Aún no has solicitado ningún avalúo.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-[10px] uppercase text-stone-500 border-b border-white/10">
                                                    <th className="pb-3 pl-2">Fecha</th>
                                                    <th className="pb-3">Dirección</th>
                                                    <th className="pb-3 text-center">Plan</th>
                                                    <th className="pb-3 text-center">Estado</th>
                                                    <th className="pb-3 text-right pr-2">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {appraisals.map((item) => (
                                                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                                        <td className="py-4 pl-2 text-stone-400 text-xs">{new Date(item.created_at).toLocaleDateString()}</td>
                                                        <td className="py-4 font-medium text-white max-w-[150px] truncate" title={item.property_data?.details?.address}>
                                                            {item.property_data?.details?.address || 'Sin dirección'}
                                                        </td>
                                                        <td className="py-4 text-center">
                                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.plan_type === 'oro' ? 'bg-amber-400 text-black' :
                                                                item.plan_type === 'esmeralda' ? 'bg-emerald-500 text-black' :
                                                                    'bg-stone-600 text-white'
                                                                }`}>
                                                                {item.plan_type}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-center">
                                                            <span className={`flex items-center justify-center gap-1.5 text-xs ${item.status === 'completed' ? 'text-emerald-400' :
                                                                item.status === 'waiting_ally' ? 'text-amber-400' :
                                                                    'text-stone-400'
                                                                }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'completed' ? 'bg-emerald-400 shadow-[0_0_5px_#34d399]' :
                                                                    item.status === 'waiting_ally' ? 'bg-amber-400 animate-pulse' :
                                                                        'bg-stone-500'
                                                                    }`}></span>
                                                                {item.status === 'completed' ? 'Listo' : 'En Proceso'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-right pr-2">
                                                            {item.status === 'completed' ? (
                                                                <button
                                                                    id={`btn-${item.id}`}
                                                                    onClick={() => handleDownloadPDF(item.id)}
                                                                    className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-brand-gold/20"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                                                                    Descargar PDF
                                                                </button>
                                                            ) : (
                                                                <span className="text-[10px] text-stone-600 italic">Esperando...</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'payments' && (
                            <div className="space-y-4 animate-in fade-in">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Transacciones (E-PAYCO)
                                </h3>

                                {payments.length === 0 ? (
                                    <div className="text-center py-12 text-stone-500">
                                        <p>No hay registro de pagos procesados.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-[10px] uppercase text-stone-500 border-b border-white/10">
                                                    <th className="pb-3 pl-2">Ref.</th>
                                                    <th className="pb-3 text-center">Fecha</th>
                                                    <th className="pb-3">Concepto</th>
                                                    <th className="pb-3 text-right">Valor</th>
                                                    <th className="pb-3 text-center pr-2">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {payments.map((pay) => (
                                                    <tr key={pay.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                        <td className="py-4 pl-2 text-stone-500 font-mono text-xs">{pay.id}</td>
                                                        <td className="py-4 text-center text-stone-400 text-xs">{new Date(pay.date).toLocaleDateString()}</td>
                                                        <td className="py-4 font-bold text-white">{pay.concept}</td>
                                                        <td className="py-4 text-right font-mono text-emerald-400">
                                                            ${pay.amount.toLocaleString()} COP
                                                        </td>
                                                        <td className="py-4 text-center pr-2">
                                                            <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                                                                {pay.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    <p className="text-center text-[10px] text-stone-600 mt-4">
                        * Los reportes del Plan Esmeralda y Oro son revisados manualmente por peritos certificados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
