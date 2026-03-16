import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useModal } from '../context/ModalContext';
import { supabase } from '../lib/supabaseClient';
import { GlassAvatar } from '../components/GlassAvatar';
import ImageCropperModal from '../components/ImageCropperModal';
import { pdf } from '@react-pdf/renderer';
import CafeReport from '../components/reports/CafeReport';
import { sendAdminNotification, triggerEmailWorkflow } from '../services/notificationService';
import Footer from '../components/VecyPhoenix/Footer';

const Perfil = () => {
    const { theme } = useTheme();
    const { showModal } = useModal();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const [activeTab, setActiveTab] = useState('appraisals');
    const [appraisals, setAppraisals] = useState([]);

    const [referrals, setReferrals] = useState({ count: 0, rank: 'Pionero', balance: 0, nextGoal: 6, code: '' });
    const [loading, setLoading] = useState(true);

    // CROPPER STATE
    const [cropImageSrc, setCropImageSrc] = useState(null);

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

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('referral_code, wallet_balance')
                    .eq('id', user.id)
                    .single();

                let activeCode = profile?.referral_code;

                // 🔄 AUTO-GENERATE REFERRAL CODE IF MISSING
                if (!activeCode) {
                    const baseName = (user.user_metadata?.full_name || user.email?.split('@')[0] || 'VECY').replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
                    const newCode = `${baseName}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

                    // Save to DB
                    await supabase
                        .from('profiles')
                        .update({ referral_code: newCode })
                        .eq('id', user.id);

                    activeCode = newCode;
                }

                const { count: refCount } = await supabase
                    .from('referrals')
                    .select('*', { count: 'exact', head: true })
                    .eq('referrer_id', user.id);

                // Calculate Rank & Goals
                // Logic: 0-5 (Pionero), 6-20 (Socio Estratega), 20+ (Embajador Vecy)
                const currentCount = refCount || 0;
                let currentRank = 'Pionero';
                let nextGoal = 6;
                if (currentCount >= 6) { currentRank = 'Socio Estratega'; nextGoal = 20; }
                if (currentCount >= 20) { currentRank = 'Embajador Vecy'; nextGoal = 50; }

                setReferrals({
                    count: currentCount,
                    rank: currentRank,
                    balance: profile?.wallet_balance || 0,
                    nextGoal: nextGoal,
                    code: activeCode
                });
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

    // Handle Cashout
    const handleCashout = () => {
        showModal({ title: 'Solicitud Enviada', message: 'Tu petición de retiro está en proceso. Un asesor validará tus comisiones en menos de 24h.', type: 'success' });
    };

    // 1. Handle File Selection (Opens Cropper)
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setCropImageSrc(reader.result); // Open Modal
        });
        reader.readAsDataURL(file);

        // Reset input value to allow re-selecting same file if needed
        e.target.value = '';
    };

    // 2. Handle Upload (Called by Cropper)
    const handleUploadCroppedImage = async (blob) => {
        try {
            setLoading(true);
            setCropImageSrc(null); // Close Modal

            // Convert Blob to File
            const fileName = `${user.id}-${Math.random()}.jpg`;
            const filePath = `${fileName}`;
            const file = new File([blob], fileName, { type: 'image/jpeg' });

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
            showModal({ title: 'Foto Actualizada', message: 'Tu foto de perfil se ha ajustado perfectamente.', type: 'success' });

        } catch (error) {
            console.error(error);
            showModal({ title: 'Error', message: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // ... Inside Component ...  

    // 💎 Handle Smart PDF Generation (Client Side + Cloud Sync)
    const handleDownloadPDF = async (appraisalId, appraisalData) => {
        try {
            // Toast de "Generando..."
            const btn = document.getElementById(`btn-${appraisalId}`);
            if (btn) btn.innerText = "Procesando...";

            // 1. Generate PDF Blob Client-Side
            // Note: We access data from the passed object or state
            const blob = await pdf(
                <CafeReport
                    propertyAddress={appraisalData.property_data?.details?.address || appraisalData.address}
                    area={appraisalData.property_data?.details?.area}
                    estimatedValue={appraisalData.valuation_price || "Pendiente"}
                    userName={user.user_metadata?.full_name || "Usuario Vecy"}
                    planType={appraisalData.plan_type}
                    date={new Date().toLocaleDateString()}
                />
            ).toBlob();

            // 2. Upload to Supabase (To get a shareable Link for Email/WhatsApp)
            const fileName = `Reporte_${appraisalData.plan_type}_${appraisalId.slice(0, 6)}_${Date.now()}.pdf`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, blob);

            let publicLink = '';
            if (!uploadError) {
                const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
                publicLink = data.publicUrl;
            }

            // 3. Trigger Notifications (Vecy Agenda Logic)
            // A. WhatsApp Admin
            await sendAdminNotification('Descarga de Reporte', {
                user_name: user?.user_metadata?.full_name,
                user_email: user?.email,
                property_summary: appraisalData.property_data?.details?.address,
                plan: appraisalData.plan_type,
                pdf_link: publicLink || 'Adjunto en Email'
            });

            // B. Email Workflow (Make)
            await triggerEmailWorkflow({
                email: user?.email,
                name: user?.user_metadata?.full_name,
                link: publicLink,
                plan: appraisalData.plan_type
            });

            // 4. Download in Browser
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Vecy_Avaluo_${appraisalId.slice(0, 6)}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            if (btn) btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" class="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                Enviado
            `;

            showModal({ title: 'Documento Listo', message: 'El reporte se ha descargado y enviado a tu correo/WhatsApp.', type: 'success' });

        } catch (err) {
            console.error(err);
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
                        <label className="w-24 h-24 rounded-full mb-4 relative group cursor-pointer transition-transform active:scale-95 hover:shadow-[0_0_30px_rgba(204,172,78,0.3)] duration-300">
                            <GlassAvatar
                                src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
                                name={user?.user_metadata?.full_name || user?.email || 'Tú'}
                                size="xl"
                                className="!w-full !h-full !border-4 !border-brand-accent/30"
                            />
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm overflow-hidden border-4 border-transparent">
                                <span className="text-[10px] uppercase font-bold text-brand-gold animate-pulse tracking-wide">Editar Foto</span>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} disabled={loading} />
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
                        <button
                            onClick={() => setActiveTab('network')}
                            className={`px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${activeTab === 'network' ? 'bg-gradient-to-r from-brand-gold to-amber-500 text-black shadow-lg shadow-brand-gold/20' : 'text-stone-400 hover:text-white'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                            Vecy Network
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
                                                                    onClick={() => handleDownloadPDF(item.id, item)}
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

                        {activeTab === 'network' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                {/* Header Section */}
                                <div className="space-y-4">
                                    <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-br from-brand-gold/20 to-transparent p-6 rounded-2xl border border-brand-gold/30 relative overflow-hidden group">
                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-bold text-brand-gold mb-1 flex items-center gap-2">
                                                Rango: {referrals.rank}
                                            </h3>
                                            <p className="text-sm text-stone-300">Tu influencia está creciendo. ¡Sigue así!</p>
                                        </div>
                                        <div className="mt-4 md:mt-0 text-right relative z-10">
                                            <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Saldo Disponible</p>
                                            <p className="text-3xl font-mono text-emerald-400 font-bold">${referrals.balance.toLocaleString()}</p>
                                        </div>
                                        {/* Subtle background glow for Embajadores */}
                                        {referrals.rank === 'Embajador Vecy' && (
                                            <div className="absolute inset-0 bg-brand-gold/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 scale-150 animate-pulse"></div>
                                        )}
                                    </div>

                                    {/* RANK PROGRESS BAR */}
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-tighter">Meta: {referrals.rank === 'Embajador Vecy' ? 'Máximo Rango' : `Rango ${referrals.rank === 'Pionero' ? 'Socio Estratega' : 'Embajador Vecy'}`}</span>
                                            <span className="text-[10px] font-mono text-brand-gold">{referrals.count} / {referrals.nextGoal} Ventas</span>
                                        </div>
                                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="h-full bg-gradient-to-r from-brand-gold to-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(204,172,78,0.5)]"
                                                style={{ width: `${Math.min(100, (referrals.count / referrals.nextGoal) * 100)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-[9px] text-stone-500 mt-2 italic text-right">
                                            {referrals.rank === 'Embajador Vecy' ? '¡Eres un Embajador Global!' : `Faltan ${referrals.nextGoal - referrals.count} ventas para desbloquear ingresos pasivos.`}
                                        </p>
                                    </div>
                                </div>

                                {/* Earnings Section */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                            <p className="text-[10px] uppercase text-stone-500 font-bold mb-1">Referidos Totales</p>
                                            <p className="text-2xl font-bold text-white">{referrals.count}</p>
                                        </div>
                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                            <p className="text-[10px] uppercase text-stone-500 font-bold mb-1">Estatus</p>
                                            <p className={`text-sm font-bold uppercase ${referrals.balance > 0 ? 'text-emerald-400' : 'text-stone-400'}`}>
                                                {referrals.balance > 0 ? 'Activo' : 'Sin comisiones'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-emerald-400 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.829 1.508-2.316a7.5 7.5 0 1 0-7.516 0c.85.487 1.508 1.333 1.508 2.316V18" /></svg>
                                            <div className="space-y-3 w-full">
                                                <div>
                                                    <p className="text-sm font-bold text-emerald-400 mb-1">Modelo de Ganancias Ilimitadas</p>
                                                    <p className="text-xs text-stone-300 leading-relaxed">
                                                        Gana comisiones inteligentes por <b>cada amigo</b> que adquiera un plan.
                                                        El sistema detecta automáticamente el estrato para maximizar tu renta.
                                                    </p>
                                                </div>

                                                {/* Commission Breakdown */}
                                                <div className="bg-black/30 rounded-lg p-4 space-y-4 border border-white/5 font-mono text-xs">

                                                    {/* CAFÉ */}
                                                    <div>
                                                        <p className="flex items-center gap-1.5 font-bold text-brand-gold uppercase tracking-wider mb-2 border-b border-white/10 pb-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                                                            Plan Café Express
                                                        </p>
                                                        <div className="space-y-1.5 text-stone-300">
                                                            <div className="flex justify-between items-center">
                                                                <span>Estratos 1-3</span>
                                                                <span className="text-emerald-400 font-bold">+ $4.997 COP</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span>Estratos 4-6</span>
                                                                <span className="text-emerald-400 font-bold">+ $7.499 COP</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* ESMERALDA */}
                                                    <div>
                                                        <p className="flex items-center gap-1.5 font-bold text-emerald-500 uppercase tracking-wider mb-2 border-b border-white/10 pb-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                                                            Plan Esmeralda Plus
                                                        </p>
                                                        <div className="space-y-1.5 text-stone-300">
                                                            <div className="flex justify-between items-center">
                                                                <span>Estratos 1-3</span>
                                                                <span className="text-emerald-400 font-bold">+ $9.997 COP</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span>Estratos 4-6</span>
                                                                <span className="text-emerald-400 font-bold">+ $12.499 COP</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* ORO */}
                                                    <div>
                                                        <p className="flex items-center gap-1.5 font-bold text-amber-500 uppercase tracking-wider mb-2 border-b border-white/10 pb-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                                                            Plan Oro King
                                                        </p>
                                                        <div className="text-stone-300">
                                                            <div className="flex justify-between items-center">
                                                                <span>Cada Referido genera:</span>
                                                                <span className="text-emerald-400 font-bold">10% Neto</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {/* 1. PRIMARY ACTION: WHATSAPP (Zero Friction) */}
                                    <button
                                        onClick={() => {
                                            const code = referrals.code;
                                            const text = encodeURIComponent(`Hola! 👋 Te recomiendo Vecy Avalúos para valorar tu inmueble en segundos. Es inteligencia artificial real. Usa mi link: ${window.location.origin}/?ref=${code}`);
                                            window.open(`https://wa.me/?text=${text}`, '_blank');
                                        }}
                                        className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all flex items-center justify-center gap-2 group transform active:scale-95"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                                        </svg>
                                        Enviar por WhatsApp Ahora
                                    </button>

                                    {/* 2. SECONDARY ACTIONS */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => {
                                                const code = referrals.code;
                                                navigator.clipboard.writeText(`${window.location.origin}/?ref=${code}`);
                                                showModal({ title: 'Copiado', message: 'Link copiado al portapapeles.', type: 'success' });
                                            }}
                                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                                            <span className="font-bold text-white text-[10px] uppercase">Copiar Link</span>
                                        </button>

                                        <button
                                            onClick={handleCashout}
                                            disabled={referrals.balance <= 0}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group relative overflow-hidden ${referrals.balance > 0 ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 hover:border-emerald-500 cursor-pointer' : 'bg-stone-800/10 border-stone-700/30 opacity-50 cursor-not-allowed'}`}
                                        >
                                            {/* Pulse Animation Overlay */}
                                            {referrals.balance >= 50000 && (
                                                <span className="absolute inset-0 bg-emerald-500/20 animate-pulse pointer-events-none"></span>
                                            )}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 mb-1 text-emerald-400 group-hover:scale-110 transition-transform ${referrals.balance >= 50000 ? 'animate-bounce' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                            <span className={`font-bold text-[10px] uppercase tracking-wider ${referrals.balance > 0 ? 'text-emerald-400' : 'text-stone-500'}`}>Canjear</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    <p className="text-center text-[10px] text-stone-400 mt-4">
                        * Los reportes del Plan Oro son revisados manualmente y aprobados por peritos certificados.
                    </p>
                </div>
            </div>

            {/* CROPPER MODAL */}
            {cropImageSrc && (
                <ImageCropperModal
                    imageSrc={cropImageSrc}
                    onCancel={() => {
                        setCropImageSrc(null);
                        // Optional: Clear file input via ref if needed, but not critical here
                    }}
                    onCropComplete={handleUploadCroppedImage}
                />
            )}

            <div className="w-full max-w-5xl mt-12 mb-4">
                <Footer compact={true} />
            </div>
        </div>
    );
};

export default Perfil;
