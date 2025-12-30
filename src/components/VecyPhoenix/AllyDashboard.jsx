import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { approveAppraisal } from '../../services/solicitudesService';
import EsmeraldaReport from '../reports/EsmeraldaReport';
import { pdf } from '@react-pdf/renderer';

const AllyDashboard = ({ session }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [earnings, setEarnings] = useState(0);
    const [selectedTask, setSelectedTask] = useState(null); // For Preview Modal
    const navigate = useNavigate();

    useEffect(() => {
        // Just in case session is passed, otherwise we might need to fetch it
        // Ideally App should pass session, but if not we can get it from supabase.auth
        checkRoleAndFetch();
    }, [session]);

    const checkRoleAndFetch = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/'); return; }

        // 1. Verify Role
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'ally' && profile?.role !== 'admin') {
            navigate('/');
            return;
        }

        // 2. Fetch Tasks (Processing, Waiting Ally, In Review)
        const { data: appraisals } = await supabase
            .from('appraisals')
            .select(`*, profiles:client_id (full_name, email)`)
            .in('status', ['processing', 'waiting_ally', 'in_review'])
            .order('created_at', { ascending: false });

        if (appraisals) setTasks(appraisals);

        // 3. Calculate Earnings (Mock logic: 70% of completed)
        const { data: completed } = await supabase
            .from('appraisals')
            .select('total_price')
            .eq('status', 'completed')
            .eq('ally_id', user.id);

        if (completed) {
            const total = completed.reduce((sum, item) => sum + (item.total_price || 0), 0);
            setEarnings(total * 0.70);
        }

        setLoading(false);
    };

    const handleApprove = async (task) => {
        if (!window.confirm(`¿Confirmas el Visto Bueno FINAL para ${task.property_data?.address}?`)) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();

            // A. GENERATE PDF BLOB
            const blob = await pdf(
                <EsmeraldaReport
                    propertyData={task.property_data || { address: 'Sin dirección', area: task.property_area }}
                    estimatedValue={task.total_price * 10 || 0} // Logic ref
                    humanReviewer={user.user_metadata?.full_name || "Perito Vecy"}
                />
            ).toBlob();

            // B. CALL SERVICE
            const result = await approveAppraisal(task.id, user.id, blob);

            if (result.success) {
                alert('¡Informe Validado y Enviado! 🚀');
                setSelectedTask(null); // Close modal
                checkRoleAndFetch(); // Refresh list
            } else {
                alert('Error: ' + result.error);
            }
        } catch (e) {
            console.error(e);
            alert('Error generando reporte.');
        }
    };

    if (loading) return <div className="p-10 text-brand-gold bg-stone-900 min-h-screen">Cargando Oficina Virtual...</div>;

    return (
        <div className="min-h-screen bg-stone-900 text-stone-200 p-4 md:p-8 font-sans">
            {/* HEADER */}
            <div className="max-w-7xl mx-auto mb-8 border-b border-brand-gold/20 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Oficina Virtual <span className="text-brand-gold">Perito</span> 🛡️</h1>
                    <p className="text-stone-400 text-sm">Gestiona y certifica los avalúos de la red Vecy.</p>
                </div>

                {/* WIDGETS */}
                <div className="flex gap-4">
                    <div className="bg-stone-800 border border-brand-gold/30 p-4 rounded-xl text-center min-w-[140px]">
                        <p className="text-stone-400 text-[10px] uppercase tracking-widest mb-1">Avalúos Pendientes</p>
                        <p className="text-2xl font-bold text-brand-emerald">{tasks.length}</p>
                    </div>
                    <div className="bg-brand-coffee-darkest border border-brand-gold/50 p-4 rounded-xl text-center min-w-[160px] shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                        <p className="text-brand-gold text-[10px] uppercase tracking-widest mb-1">Saldo por Cobrar</p>
                        <p className="text-xl font-bold text-white">
                            ${new Intl.NumberFormat('es-CO').format(earnings)}
                        </p>
                    </div>
                </div>
            </div>

            {/* TASK LIST */}
            <div className="max-w-7xl mx-auto">
                {tasks.length === 0 ? (
                    <div className="text-center p-20 border-2 border-dashed border-stone-800 rounded-2xl text-stone-600">
                        <p className="text-lg">Todo al día. No hay solicitudes pendientes. ☕</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-stone-800/50 backdrop-blur-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/40 text-brand-gold border-b border-white/10 text-xs uppercase tracking-wider">
                                    <th className="p-4">Fecha</th>
                                    <th className="p-4">Cliente</th>
                                    <th className="p-4">Inmueble</th>
                                    <th className="p-4">Plan</th>
                                    <th className="p-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-stone-400">
                                            {new Date(task.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 font-medium text-white">
                                            {task.profiles?.full_name || 'Desconocido'}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-stone-200">{task.property_data?.address || 'Sin Dirección'}</div>
                                            <div className="text-xs text-stone-500">{task.property_area || 0} m²</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${task.plan_type === 'oro' ? 'bg-brand-gold text-black' : 'bg-emerald-900/50 text-emerald-400 border border-emerald-800'
                                                }`}>
                                                {task.plan_type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setSelectedTask(task)}
                                                className="bg-stone-700 hover:bg-brand-gold hover:text-black text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg border border-white/10"
                                            >
                                                Gestionar 🔍
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* PREVIEW MODAL */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-stone-900 border border-brand-gold/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-stone-900 z-10">
                            <h2 className="text-xl font-bold text-white">Revisión Técnica <span className="text-stone-500">#{selectedTask.id.slice(0, 6)}</span></h2>
                            <button onClick={() => setSelectedTask(null)} className="text-stone-400 hover:text-white">✕</button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Data Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/20 p-4 rounded-lg">
                                    <p className="text-xs text-stone-500 uppercase">Propietario</p>
                                    <p className="text-white font-medium">{selectedTask.profiles?.full_name}</p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-lg">
                                    <p className="text-xs text-stone-500 uppercase">Dirección</p>
                                    <p className="text-white font-medium">{selectedTask.property_data?.address}</p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-lg">
                                    <p className="text-xs text-stone-500 uppercase">Área Privada</p>
                                    <p className="text-white font-medium">{selectedTask.property_area} m²</p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-lg">
                                    <p className="text-xs text-stone-500 uppercase">Valor Estimado (IA)</p>
                                    <p className="text-brand-gold font-bold">${new Intl.NumberFormat('es-CO').format(selectedTask.total_price * 10 || 0)}</p>
                                </div>
                            </div>

                            {/* Actions Area */}
                            <div className="bg-brand-emerald/10 border border-brand-emerald/20 p-4 rounded-xl">
                                <p className="text-sm text-brand-emerald mb-2 font-bold">✓ Acciones Permitidas</p>
                                <p className="text-xs text-stone-400 mb-4">
                                    Al dar Visto Bueno, se generará el <strong>Informe {selectedTask.plan_type.toUpperCase()}</strong> y se notificará al cliente automáticamente.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleApprove(selectedTask)}
                                        className="flex-1 bg-brand-emerald hover:bg-emerald-400 text-black py-3 rounded-xl font-bold transition-colors shadow-lg"
                                    >
                                        DAR VISTO BUENO ✅
                                    </button>
                                    <button className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium text-sm transition-colors">
                                        Rechazar / Observación
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllyDashboard;
