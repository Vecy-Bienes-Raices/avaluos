import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Supabase handles the hash parsing automatically when the client is initialized,
                // allows us to just check for the session.
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) throw error;

                if (session) {
                    console.log("✅ Sesión recuperada en Callback:", session.user.email);
                } else {
                    console.warn("⚠️ No se detectó sesión en Callback");
                }
            } catch (e) {
                console.error("Error en Auth Callback:", e);
            } finally {
                // Redirect to home regardless of outcome, main app handles auth state
                navigate('/');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-stone-400 text-sm font-medium animate-pulse">Conectando con JanIA...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
