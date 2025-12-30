import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/VecyPhoenix/Footer';
import Navbar from '../components/VecyPhoenix/Navbar';

const PaymentConfirmation = () => {
    const { theme } = useTheme();

    // Force Premium Dark/Coffee Theme for consistency (Standard JanIA Background)
    const bgClass = 'bg-[#423229]';
    const bgStyle = {
        backgroundImage: 'radial-gradient(circle at center, #7D6B65 0%, #4E3D32 40%, #423229 100%)',
        backgroundAttachment: 'fixed'
    };
    return (
        <div
            className={`min-h-screen w-full flex flex-col text-stone-200 font-sans overflow-x-hidden transition-colors duration-500 ease-in-out ${bgClass}`}
            style={bgStyle}
        >
            {/* Navbar REMOVED as per user request */}

            {/* BACKGROUND DECOR */}
            <div className={`fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[140px] pointer-events-none z-0 ${theme === 'dark' ? 'opacity-20' : 'opacity-100'}`}></div>

            <main className="flex-grow flex items-center justify-center p-6 relative z-10">
                {/* STRICT VECY GLASS DESIGN: bg-white/10, backdrop-blur-md, border-white/20, shadow-lg */}
                <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 p-12 rounded-[48px] text-center shadow-lg relative animate-in fade-in slide-in-from-bottom-8 duration-1000 overflow-hidden">

                    {/* Background Shine Effect */}
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shine"></div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-accent/10 rounded-full blur-2xl animate-pulse"></div>

                    {/* PROCESSING ICON - Strong Orange Circle */}
                    <div className="relative w-32 h-32 mx-auto mb-10 group">
                        <div className="absolute inset-0 bg-orange-500/50 rounded-full blur-2xl animate-pulse"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-full shadow-[0_0_60px_rgba(249,115,22,0.6)] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500 ring-2 ring-white/20">
                            {/* Inner Shine */}
                            <div className="absolute top-2 right-4 w-8 h-8 bg-white/30 rounded-full blur-[4px]"></div>

                            {/* Icon */}
                            <svg className="w-14 h-14 text-white drop-shadow-md relative z-10 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                    </div>

                    <h2 className="text-4xl font-outfit font-bold text-white mb-4 tracking-tighter drop-shadow-lg">Procesando Pago</h2>
                    <p className="text-stone-300 mb-10 leading-relaxed font-light text-lg">Estamos sincronizando con la red bancaria. No cierres esta ventana.</p>

                    <div className="space-y-4">
                        <Link to="/" className="group relative inline-flex items-center justify-center w-full py-5 bg-gradient-to-r from-brand-accent to-brand-gold text-black font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(204,172,78,0.6)] hover:brightness-110 shadow-xl shadow-brand-accent/30 active:scale-95">
                            <span className="relative z-10 drop-shadow-sm">Volver con JanIA</span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                        </Link>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-3 text-stone-400 text-xs uppercase tracking-[0.2em] font-bold">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 shadow-[0_0_10px_#4ade80]"></span>
                        </span>
                        Transacción Segura
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PaymentConfirmation;
