import React, { useEffect, useState } from 'react';

/**
 * 💎 GLASS TOAST (Notificación Flotante)
 * Muestra mensajes de éxito, error o info con estilo Glassmorphism
 */
export const GlassToast = ({ type = 'info', message, onClose, duration = 4000 }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!message) return null;

    // Define colors based on type
    const colors = {
        success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100',
        error: 'border-red-500/50 bg-red-500/10 text-red-100',
        info: 'border-brand-gold/50 bg-brand-gold/10 text-brand-ivory',
        warning: 'border-orange-500/50 bg-orange-500/10 text-orange-100'
    };

    const icon = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    return (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] animate-fade-in-down">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-xl shadow-2xl border ${colors[type] || colors.info}`}>
                <span className="text-xl">{icon[type] || 'ℹ️'}</span>
                <span className="font-medium text-sm tracking-wide">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-4 opacity-50 hover:opacity-100 transition-opacity"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

/**
 * 💎 GLASS CONFIRM (Modal de Confirmación)
 * Reemplaza el window.confirm nativo
 */
export const GlassConfirm = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar", isDanger = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop con Blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-[#1A1A1A]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 transform scale-100 animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-4">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDanger ? 'bg-red-500/20 text-red-400' : 'bg-brand-gold/20 text-brand-gold'}`}>
                        {isDanger ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-stone-300 text-sm leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 font-medium transition-all text-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-white font-bold shadow-lg transition-all transform active:scale-95 text-sm ${isDanger
                                ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-500/20'
                                : 'bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-light shadow-brand-gold/20'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
