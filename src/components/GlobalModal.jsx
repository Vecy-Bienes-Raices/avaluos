import React from 'react';
import { useModal } from '../context/ModalContext';
import { createPortal } from 'react-dom';

const GlobalModal = () => {
    const { modal, closeModal } = useModal();

    if (!modal.isOpen) return null;

    const handleConfirm = () => {
        if (modal.onConfirm) modal.onConfirm();
        closeModal();
    };

    // Icons based on type
    const getIcon = () => {
        switch (modal.type) {
            case 'success':
                return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-emerald-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            case 'error':
                return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>;
            case 'warning':
                return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-amber-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" /></svg>;
            default: // info
                return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>;
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm bg-[#1a1a1a]/90 border border-white/10 rounded-2xl shadow-2xl p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-white/5 rounded-full ring-1 ring-white/10">
                        {getIcon()}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 font-display">
                        {modal.title}
                    </h3>

                    <p className="text-stone-300 text-sm mb-6 leading-relaxed">
                        {modal.message}
                    </p>

                    <div className="flex gap-3 w-full">
                        {modal.onConfirm ? (
                            <>
                                <button
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-stone-300 hover:bg-white/5 transition-colors text-sm font-medium"
                                >
                                    {modal.cancelText}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-brand-gold text-black font-bold hover:bg-brand-gold-light transition-all shadow-lg hover:shadow-brand-gold/20 text-sm"
                                >
                                    {modal.confirmText}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={closeModal}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10 text-sm"
                            >
                                Entendido
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default GlobalModal;
