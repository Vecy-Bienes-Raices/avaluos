import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Footer from '../components/VecyPhoenix/Footer';

// Simplified PaymentResponse
// Reason: Previous versions had stability issues with Context/Theme and empty query params.
// This version hardcodes the 'Premium/Dark' aesthetic for consistency and includes robust error handling.

const PaymentResponse = () => {
    const [status, setStatus] = useState('loading');
    const location = useLocation();

    // Force Premium Dark/Coffee Theme (Standard JanIA Background)
    const bgClass = 'bg-[#423229]';
    const bgStyle = {
        backgroundImage: 'radial-gradient(circle at center, #7D6B65 0%, #4E3D32 40%, #423229 100%)',
        backgroundAttachment: 'fixed'
    };

    useEffect(() => {
        let isMounted = true;
        const timeoutId = setTimeout(() => {
            if (isMounted && status === 'loading') {
                setStatus('error'); // Timeout safety
            }
        }, 10000);

        try {
            const query = new URLSearchParams(location.search);

            // DEMO MODE for User Verification
            if (query.get('demo') === 'success') {
                if (isMounted) setStatus('success');
                return;
            } else if (query.get('demo') === 'error') {
                if (isMounted) setStatus('error');
                return;
            }

            const refPayco = query.get('ref_payco');

            if (refPayco) {
                fetch(`https://secure.epayco.co/validation/v1/reference/${refPayco}`)
                    .then(res => res.json())
                    .then(data => {
                        if (!isMounted) return;
                        if (data.success && data.data.x_cod_response === 1) {
                            setStatus('success');

                            // 💎 VECY NETWORK WIRING: TRIGGER COMMISSION
                            // We attempt to attribute commission. If no referrer, the RPC handles it gracefully.
                            // We need user_id (payer) and plan details.
                            // Ideally, x_extra1 or x_extra2 in ePayco params holds the user_id.
                            // Fallback: We rely on the current session if user is logged in (risk: cross-device payment).

                            // For MVP: We assume the user is logged in on this device.
                            import('../lib/supabaseClient').then(async ({ supabase }) => {
                                const { data: { user } } = await supabase.auth.getUser();
                                if (user) {
                                    const amountPaid = parseFloat(data.data.x_amount);
                                    // Infer plan from amount (Safe heuristic for MVP)
                                    let planType = 'unknown';
                                    if (amountPaid > 20000 && amountPaid < 60000) planType = 'cafe';
                                    if (amountPaid > 90000 && amountPaid < 160000) planType = 'esmeralda';
                                    if (amountPaid > 200000) planType = 'oro';

                                    const { data: rpcData, error: rpcError } = await supabase.rpc('process_referral_commission', {
                                        p_payer_id: user.id,
                                        p_plan_type: planType,
                                        p_amount_paid: amountPaid
                                    });

                                    if (rpcError) console.error("Referral Commission Error:", rpcError);
                                    else console.log("Referral Commission Result:", rpcData);
                                }
                            });

                        } else {
                            setStatus('error');
                        }
                    })
                    .catch((err) => {
                        console.error("Validation Error:", err);
                        if (isMounted) setStatus('error');
                    });
            } else {
                // Gracefully handle missing reference
                if (isMounted) setStatus('no_ref');
            }
        } catch (error) {
            console.error("Critical Error in PaymentResponse:", error);
            if (isMounted) setStatus('error');
        }

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [location]);

    return (
        <div className={`min-h-screen w-full flex flex-col text-stone-200 font-sans overflow-x-hidden ${bgClass}`} style={bgStyle}>
            {/* <nav> REMOVED as per user request */}
            <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none z-0 opacity-20"></div>

            <main className="flex-grow flex items-center justify-center p-6 relative z-10">
                {/* STRICT VECY GLASS DESIGN: bg-white/10, backdrop-blur-md, border-white/20, shadow-lg */}
                <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 p-12 rounded-[40px] text-center shadow-lg relative overflow-hidden">

                    {/* Background Shine Effect */}
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shine"></div>

                    {/* LOADING - Crystal Blue/Gold */}
                    {status === 'loading' && (
                        <div className="space-y-6">
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <div className="absolute inset-0 bg-brand-gold/30 rounded-full blur-xl animate-pulse"></div>
                                <div className="relative w-full h-full bg-gradient-to-br from-brand-gold to-brand-coffee-light rounded-full border border-white/50 flex items-center justify-center shadow-2xl animate-spin-slow ring-4 ring-white/10">
                                    <div className="w-16 h-16 rounded-full border-t-4 border-l-4 border-white/80 animate-spin"></div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-wide">Validando...</h2>
                        </div>
                    )}

                    {/* NO REF (AVISO) - Crystal Amber */}
                    {status === 'no_ref' && (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            <div className="relative w-24 h-24 mx-auto mb-8 group">
                                <div className="absolute inset-0 bg-amber-500/40 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                                <div className="relative w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2rem] border-t border-l border-white/50 shadow-[0_10px_40px_rgba(245,158,11,0.5)] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                                    <div className="absolute inset-0 bg-white/20 rounded-[2rem] backdrop-blur-[1px]"></div>
                                    <svg className="w-12 h-12 text-white drop-shadow-md relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Aviso</h2>
                            <p className="text-stone-300 mb-8 leading-relaxed">No detectamos una transacción activa. Vuelve con JanIA para iniciar.</p>
                            <Link to="/" className="block w-full py-4 bg-gradient-to-r from-brand-accent to-brand-gold text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(204,172,78,0.6)] hover:brightness-110 shadow-lg shadow-brand-accent/30 relative overflow-hidden group">
                                <span className="relative z-10 drop-shadow-sm">Volver con JanIA</span>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                            </Link>
                        </div>
                    )}

                    {/* SUCCESS - Crystal Emerald */}
                    {status === 'success' && (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            <div className="relative w-28 h-28 mx-auto mb-8">
                                <div className="absolute inset-0 bg-emerald-500/40 rounded-full blur-2xl animate-pulse"></div>
                                <div className="relative w-full h-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 rounded-full border-t-2 border-l-2 border-white/40 shadow-[0_0_50px_rgba(16,185,129,0.6)] flex items-center justify-center animate-float">
                                    <div className="absolute top-2 right-4 w-6 h-6 bg-white/40 rounded-full blur-[2px]"></div>
                                    <svg className="w-14 h-14 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-md">¡Pago Exitoso!</h2>
                            <p className="text-stone-300 mb-8 leading-relaxed">Tu servicio ha sido activado y JanIA está lista.</p>
                            <Link to="/" className="block w-full py-4 bg-gradient-to-r from-brand-accent to-brand-gold text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(204,172,78,0.6)] hover:brightness-110 shadow-lg shadow-brand-accent/30 relative overflow-hidden group">
                                <span className="relative z-10 drop-shadow-sm">Volver con JanIA</span>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                            </Link>
                        </div>
                    )}

                    {/* ERROR - Crystal Ruby */}
                    {status === 'error' && (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            <div className="relative w-28 h-28 mx-auto mb-8">
                                <div className="absolute inset-0 bg-red-600/40 rounded-full blur-2xl animate-pulse"></div>
                                <div className="relative w-full h-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 rounded-full border-t-2 border-l-2 border-white/40 shadow-[0_0_50px_rgba(220,38,38,0.6)] flex items-center justify-center">
                                    <div className="absolute top-3 left-3 w-4 h-4 bg-white/30 rounded-full blur-[1px]"></div>
                                    <svg className="w-14 h-14 text-white drop-shadow-md relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Falló la Transacción</h2>
                            <p className="text-stone-300 mb-8 leading-relaxed">No pudimos procesar el pago. Por favor regresa e intenta de nuevo.</p>
                            <Link to="/" className="block w-full py-4 bg-gradient-to-r from-brand-accent to-brand-gold text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(204,172,78,0.6)] hover:brightness-110 shadow-lg shadow-brand-accent/30 relative overflow-hidden group">
                                <span className="relative z-10 drop-shadow-sm">Volver con JanIA</span>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                            </Link>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentResponse;
