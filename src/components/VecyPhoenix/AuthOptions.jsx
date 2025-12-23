import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const AuthOptions = ({ onSelect }) => {
    return (
        <div className="flex flex-col gap-4 w-full max-w-[260px] mx-auto animate-fade-in py-2">
            {/* GOOGLE BUTTON - Liquid Glass Style */}
            <button
                onClick={() => onSelect('google')}
                className="flex items-center justify-center gap-3 bg-white/95 text-stone-900 font-bold py-3 px-4 rounded-xl hover:bg-white transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-white/10 hover:-translate-y-0.5 group overflow-hidden w-full text-[13px] backdrop-blur-md"
            >
                <div className="w-5 h-5 flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                </div>
                <span>Continuar con Google</span>
            </button>

            {/* FACEBOOK BUTTON - Liquid Glass Style */}
            <button
                onClick={() => onSelect('facebook')}
                className="flex items-center justify-center gap-3 bg-[#1877F2]/90 text-white font-bold py-3 px-4 rounded-xl hover:bg-[#1877F2] transition-all shadow-[0_8px_32px_rgba(24,119,242,0.2)] hover:shadow-[#1877F2]/30 hover:-translate-y-0.5 group overflow-hidden w-full text-[13px] backdrop-blur-md"
            >
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="#1877F2" className="w-4 h-4">
                        <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                    </svg>
                </div>
                <span>Continuar con Facebook</span>
            </button>

            <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-3 text-[9px] font-bold tracking-widest text-stone-500 uppercase">O usa tu email</span>
                <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* EMAIL BUTTON - Glass/Gold Premium */}
            <button
                onClick={() => onSelect('email')}
                className="flex items-center justify-center gap-3 bg-white/5 text-stone-200 font-medium py-3 px-4 rounded-xl hover:bg-brand-gold/10 border border-white/10 hover:border-brand-gold/30 transition-all group text-[13px] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
                <FontAwesomeIcon icon={faEnvelope} className="text-stone-400 group-hover:text-brand-gold transition-colors w-4 h-4" />
                Continuar con Correo
            </button>
        </div>
    );
};

export default AuthOptions;
