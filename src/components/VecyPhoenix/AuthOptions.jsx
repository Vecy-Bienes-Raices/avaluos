import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const AuthOptions = ({ onSelect }) => {
    return (
        <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 w-full max-w-xs animate-fade-in">
            <p className="text-sm text-stone-300 mb-2 text-center">Selecciona una opción para guardar tu progreso:</p>

            <button
                onClick={() => onSelect('google')}
                className="flex items-center justify-center gap-3 bg-white text-stone-800 font-bold py-2.5 px-4 rounded-xl hover:bg-stone-100 transition-all shadow-md group"
            >
                <FontAwesomeIcon icon={faGoogle} className="text-red-500 group-hover:scale-110 transition-transform" />
                Continuar con Google
            </button>

            <button
                onClick={() => onSelect('facebook')}
                className="flex items-center justify-center gap-3 bg-[#1877F2] text-white font-bold py-2.5 px-4 rounded-xl hover:bg-[#166fe5] transition-all shadow-md group"
            >
                <FontAwesomeIcon icon={faFacebook} className="text-white group-hover:scale-110 transition-transform" />
                Continuar con Facebook
            </button>

            <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-2 text-xs text-stone-500">O</span>
                <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
                onClick={() => onSelect('email')}
                className="flex items-center justify-center gap-3 bg-white/5 text-stone-300 font-medium py-2.5 px-4 rounded-xl hover:bg-white/10 border border-white/10 transition-all"
            >
                <FontAwesomeIcon icon={faEnvelope} />
                Usar Correo Electrónico
            </button>
        </div>
    );
};

export default AuthOptions;
