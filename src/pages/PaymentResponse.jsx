import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/VecyPhoenix/Footer';
import Navbar from '../components/VecyPhoenix/Navbar';

const PaymentResponse = () => {
    const [status, setStatus] = useState('loading');
    const location = useLocation();
    const { theme } = useTheme();

    // Themes (Consistent with JanIAAgent)
    const bgClass = theme === 'coffee' ? 'bg-[#423229]' : 'bg-[#0f0f0f]';
    const bgStyle = theme === 'coffee'
        ? { backgroundImage: 'radial-gradient(circle at center, #7D6B65 0%, #4E3D32 40%, #423229 100%)' }
        : { background: '#0f0f0f' };

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const refPayco = query.get('ref_payco');

        if (refPayco) {
            fetch(`https://secure.epayco.co/validation/v1/reference/${refPayco}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data.x_cod_response === 1) {
                        setStatus('success');
                    } else {
                        setStatus('error');
                    }
                })
                .catch(() => setStatus('error'));
        }
    }, [location]);

    return (
        <div
            className={`min-h-screen w-full flex flex-col text-stone-200 font-sans overflow-x-hidden transition-colors duration-500 ease-in-out ${bgClass}`}
            style={bgStyle}
        >
            <Navbar />

            {/* BACKGROUND DECOR */}
            <div className={`fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none z-0 ${theme === 'dark' ? 'opacity-20' : 'opacity-100'}`}></div>

            <main className="flex-grow flex items-center justify-center p-6 relative z-10">
                <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-[50px] border border-white/10 p-12 rounded-[40px] text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative animate-in fade-in zoom-in-95 duration-1000">
                    {/* Glass Inner Shine */}
                    <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                    {status === 'loading' && (
                        <div className="space-y-6">
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 border-4 border-brand-accent/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h2 className="text-2xl font-outfit font-bold text-white tracking-tight">Procesando Transacción</h2>
                            <p className="text-stone-500 text-sm">Validando con la pasarela segura...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-12 shadow-xl shadow-emerald-500/20 border border-emerald-500/20">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <h2 className="text-3xl font-outfit font-bold text-white mb-3 tracking-tight">¡Pago Confirmado!</h2>
                            <p className="text-stone-400 mb-10 leading-relaxed font-light">Tu informe técnico de JanIA ha sido liberado. Revisa tu correo y el panel de control.</p>
                            <Link to="/" className="group relative inline-flex items-center justify-center w-full py-5 bg-brand-accent text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-accent/20">
                                <span className="relative z-10">VOLVER AL PANEL</span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-24 h-24 bg-red-500/10 text-red-400 rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-[-12deg] shadow-xl shadow-red-500/20 border border-red-500/20">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <h2 className="text-3xl font-outfit font-bold text-white mb-3 tracking-tight">Pago Fallido</h2>
                            <p className="text-stone-400 mb-10 leading-relaxed font-light">No pudimos completar la operación. Si el dinero fue debitado, contacta a soporte.</p>
                            <Link to="/" className="inline-block w-full py-5 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                                REINTENTAR AHORA
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
