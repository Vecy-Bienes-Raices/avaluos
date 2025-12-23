import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabaseClient';

const Perfil = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setFullName(user.user_metadata?.full_name || '');
            } else {
                navigate('/');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        });
        setSaving(false);
        if (error) alert(error.message);
        else alert('Perfil actualizado con éxito');
    };

    const bgClass = theme === 'coffee' ? 'bg-[#423229]' : 'bg-[#0f0f0f]';
    const bgStyle = theme === 'coffee'
        ? { backgroundImage: 'radial-gradient(circle at center, #7D6B65 0%, #4E3D32 40%, #423229 100%)' }
        : { background: '#0f0f0f' };

    return (
        <div className={`min-h-screen w-full flex flex-col items-center justify-center p-6 text-stone-200 transition-colors duration-500 ${bgClass}`} style={bgStyle}>
            {/* Header / Back Button */}
            <div className="absolute top-8 left-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-bold backdrop-blur-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    Volver a JanIA
                </button>
            </div>

            <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 rounded-full border-4 border-brand-accent/30 mx-auto mb-4 overflow-hidden shadow-2xl">
                        {(user?.user_metadata?.avatar_url || user?.user_metadata?.picture) ? (
                            <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-brand-accent font-bold text-2xl">
                                {user?.email ? user.email.substring(0, 2).toUpperCase() : 'ER'}
                            </div>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold font-outfit text-white">Editar Perfil</h1>
                    <p className="text-sm text-stone-400 font-medium">Gestiona tu identidad en JanIA</p>
                </div>

                <div className={`p-8 rounded-3xl border border-white/10 ${theme === 'coffee' ? 'bg-white/5' : 'bg-white/[0.02]'} backdrop-blur-xl shadow-2xl`}>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest pl-1">Email</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-400 cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest pl-1">Nombre Completo</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Tu nombre"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent/50 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-brand-accent hover:bg-brand-accent/90 text-black font-bold rounded-2xl transition-all shadow-lg hover:shadow-brand-accent/20 disabled:opacity-50"
                        >
                            {saving ? 'Guardando...' : 'Actualizar Perfil'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Footer Copy */}
            <footer className="mt-16 text-[10px] md:text-xs text-stone-500 uppercase tracking-[0.2em] font-bold opacity-50">
                Vecy Intelligence &copy; 2024 • JanIA Cognitive System
            </footer>
        </div>
    );
};

export default Perfil;
