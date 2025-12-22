import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/VecyPhoenix/Footer';
import Navbar from '../components/VecyPhoenix/Navbar';

const PaymentConfirmation = () => {
    const { theme } = useTheme();

    // Themes (Consistent)
    const bgClass = theme === 'coffee' ? 'bg-[#423229]' : 'bg-[#0f0f0f]';
    const bgStyle = theme === 'coffee'
        ? { backgroundImage: 'radial-gradient(circle at center, #7D6B65 0%, #4E3D32 40%, #423229 100%)' }
        : { background: '#0f0f0f' };
    return (
        <div
            className={`min-h-screen w-full flex flex-col text-stone-200 font-sans overflow-x-hidden transition-colors duration-500 ease-in-out ${bgClass}`}
            style={bgStyle}
        >
            <Navbar />

            {/* BACKGROUND DECOR */}
            <div className={`fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[140px] pointer-events-none z-0 ${theme === 'dark' ? 'opacity-20' : 'opacity-100'}`}></div>

            <main className="flex-grow flex items-center justify-center p-6 relative z-10">
                <div className="max-w-md w-full bg-white/[0.02] backdrop-blur-[60px] border border-white/10 p-12 rounded-[48px] text-center shadow-2xl relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {/* Decorative Elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-accent/10 rounded-full blur-2xl animate-pulse"></div>

                    <div className="w-28 h-28 bg-gradient-to-br from-brand-accent/30 to-brand-accent/5 text-brand-accent rounded-[32px] mx-auto flex items-center justify-center mb-10 rotate-3 shadow-2xl shadow-brand-accent/10 border border-brand-accent/20 animate-bounce">
                        <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>

                    <h2 className="text-4xl font-outfit font-bold text-white mb-4 tracking-tighter">Casi Listos</h2>
                    <p className="text-stone-400 mb-10 leading-relaxed font-light text-lg">Estamos sincronizando con la red bancaria. No cierres esta ventana, JanIA está preparando tu reporte.</p>

                    <div className="space-y-4">
                        <Link to="/" className="group relative inline-flex items-center justify-center w-full py-5 bg-brand-accent text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-accent/20">
                            <span className="relative z-10">IR A MIS PROPIEDADES</span>
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                        </Link>
                        <Link to="/" className="inline-block w-full py-5 bg-white/[0.03] text-stone-300 font-medium rounded-2xl hover:bg-white/[0.08] transition-all border border-white/5 backdrop-blur-sm">
                            Ver Estado del Pedido
                        </Link>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 text-stone-600 text-xs uppercase tracking-[0.2em] font-bold">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                        Transacción Segura
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PaymentConfirmation;
