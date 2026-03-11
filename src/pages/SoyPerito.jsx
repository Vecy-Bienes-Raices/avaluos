import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { GlassToast } from '../components/VecyAlerts';
import Footer from '../components/VecyPhoenix/Footer';

const SoyPerito = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        raaNumber: '', // Registro Abierto de Avaluadores
        specialty: 'urbano' // urbano, rural, especial
    });
    const [toast, setToast] = useState({ message: null, type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Simulate Registration (In real backend, this would create a 'pending_approval' user)
            // For MVP, we just save to a 'leads_peritos' table or just log it for now if table doesn't exist
            // Let's assume we engage via email first.

            // Just for simulation effect
            await new Promise(r => setTimeout(r, 1500));

            // Success
            setToast({ message: '¡Solicitud Recibida! Te contactaremos para validar tu RAA.', type: 'success' });
            setTimeout(() => navigate('/'), 3000);

        } catch (error) {
            setToast({ message: 'Error enviando solicitud.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-stone-200 font-sans selection:bg-brand-gold selection:text-black flex flex-col">
            {/* Nav */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full animate-fade-in-down">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                        <span className="text-black font-black text-xl">V</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:block text-white">Vecy<span className="text-brand-gold">Pro</span></span>
                </div>
                <button onClick={() => navigate('/')} className="text-sm font-medium hover:text-brand-gold transition-colors">
                    Soy un Cliente
                </button>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">

                    {/* Left: Copy */}
                    <div className="space-y-6 text-center md:text-left animate-slide-in-left">
                        <div className="inline-block px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-2">
                            Socios Avaluadores
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            Tu Próximo Avalúo <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-amber-500">Te Encuentra a Ti.</span>
                        </h1>
                        <p className="text-stone-400 text-lg leading-relaxed">
                            Únete a la primera red de avaluadores "Uberizada" de Bogotá.
                            Recibe notificaciones en tiempo real, agiliza tus informes con JanIA y cobra semanalmente.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <span className="text-2xl">🔔</span>
                                <h3 className="font-bold text-white mt-2">Alertas 5km</h3>
                                <p className="text-xs text-stone-500">Servicios cerca de tu ubicación actual.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <span className="text-2xl">🤖</span>
                                <h3 className="font-bold text-white mt-2">Asistente IA</h3>
                                <p className="text-xs text-stone-500">JanIA redacta el informe por ti.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl animate-fade-in-up">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Aplicar como Socio</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold/50 focus:outline-none transition-colors"
                                    placeholder="Ej: Carlos Perito"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Celular</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold/50 focus:outline-none transition-colors"
                                        placeholder="300..."
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Registro RAA</label>
                                    <input
                                        type="text"
                                        name="raaNumber"
                                        required
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold/50 focus:outline-none transition-colors"
                                        placeholder="#12345"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Email Profesional</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold/50 focus:outline-none transition-colors"
                                    placeholder="perito@ejemplo.com"
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-brand-gold to-amber-500 text-black font-bold rounded-xl shadow-lg hover:shadow-brand-gold/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 mt-4"
                            >
                                {loading ? 'Enviando...' : 'Iniciar Proceso de Validación'}
                            </button>

                            <p className="text-[10px] text-center text-stone-500 mt-4">
                                Al aplicar aceptas nuestros Términos de Socio. Tu RAA será verificado manualmente.
                            </p>
                        </form>
                    </div>

                </div>
            </main>

            <Footer compact={true} />

            {/* Toast */}
            {toast.message && (
                <GlassToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ message: null, type: '' })}
                />
            )}
        </div>
    );
};

export default SoyPerito;
